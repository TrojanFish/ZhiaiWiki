from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Optional
import json
import logging
import re
import uuid

from app.core.database import get_db
from app.models.evidence import Evidence
from app.models.case import PatientCase, Tumor, PathologyFeature
from app.models.user import User
from app.services.agent import AnalysisAgent
from app.services.rules import MedicalRulesEngine
from app.services.vector_search import VectorSearchService
from app.api.deps import get_current_user, get_optional_current_user

logger = logging.getLogger(__name__)
router = APIRouter()
agent = AnalysisAgent()

def extract_json_from_llm_output(raw_text: str) -> dict:
    """Robustly extract JSON dictionary from LLM output using codeblock detection and brace-balancing."""
    if not raw_text or not raw_text.strip():
        raise ValueError("Empty LLM response")

    text = raw_text.strip()

    # 1. Try markdown code block extraction first
    codeblock_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if codeblock_match:
        try:
            return json.loads(codeblock_match.group(1))
        except Exception:
            pass

    # 2. Brace-balancing parser to accurately extract the top-level JSON object
    first_brace = text.find('{')
    if first_brace != -1:
        depth = 0
        in_string = False
        escape = False
        start_idx = first_brace

        for idx in range(first_brace, len(text)):
            char = text[idx]
            if escape:
                escape = False
                continue
            if char == '\\':
                escape = True
                continue
            if char == '"':
                in_string = not in_string
                continue
            if not in_string:
                if char == '{':
                    depth += 1
                elif char == '}':
                    depth -= 1
                    if depth == 0:
                        candidate = text[start_idx:idx + 1]
                        try:
                            return json.loads(candidate)
                        except Exception:
                            # Continue searching if this segment fails
                            pass

    # 3. Fallback: try raw json.loads
    try:
        return json.loads(text)
    except Exception:
        pass

    # 4. Fallback: try regex search for outermost curly braces
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except Exception:
            pass

    raise ValueError("LLM generated output without valid JSON structure")

class PatientProfileInput(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    surgeryType: Optional[str] = None
    stage: Optional[str] = None
    iaslcGrade: Optional[str] = None
    morphology: Optional[str] = None
    ctr: Optional[float] = None
    solidSize: Optional[float] = None  # Size in centimeters (cm)
    tumorSize: Optional[float] = None  # Size in centimeters (cm)
    stas: Optional[str] = None
    lvi: Optional[str] = None
    vpi: Optional[str] = None
    lymphNodes: Optional[str] = None
    egfr: Optional[str] = None
    margin: Optional[str] = None

@router.post("/generate")
async def generate_analysis(
    profile: PatientProfileInput, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    trace_id = str(uuid.uuid4())
    try:
        # Step 1: Medical Rules Engine override
        # We strictly calculate TNM instead of trusting frontend or LLM
        if profile.tumorSize is not None or profile.solidSize is not None:
            tnm = MedicalRulesEngine.calculate_tnm(
                tumor_size_cm=profile.tumorSize,
                solid_size_cm=profile.solidSize,
                nodes=profile.lymphNodes or "N0"
            )
            # Overwrite stage with computed stage for safety
            profile.stage = tnm["stage"]

        # Step 2: Build a semantic search query from the patient profile.
        query_parts = []
        if profile.stage:
            query_parts.append(f"stage {profile.stage}")
        if profile.stas == "阳性":
            query_parts.append("STAS spread through air spaces")
        if profile.ctr is not None:
            query_parts.append(f"consolidation tumor ratio CTR {profile.ctr}")
        if profile.iaslcGrade:
            query_parts.append(f"IASLC grade {profile.iaslcGrade}")
        if profile.morphology:
            query_parts.append(profile.morphology)
        if profile.lymphNodes:
            query_parts.append(f"lymph node {profile.lymphNodes}")
        if profile.egfr:
            query_parts.append(f"EGFR {profile.egfr}")
        if not query_parts:
            query_parts.append("lung adenocarcinoma early stage prognosis")
        semantic_query = " ".join(query_parts)

        # Step 3: Retrieve evidence via semantic (vector) search.
        search_service = VectorSearchService(db)
        retrieved_evidences = await search_service.search_evidence(semantic_query, limit=5)
                    
        # Step 4: Call LLM Agent
        profile_dict = profile.model_dump(exclude_none=True)
        raw_report = await agent.generate_report(profile_dict, retrieved_evidences)
        
        # Step 5: Parse JSON safely and Save to Database
        try:
            report_json = extract_json_from_llm_output(raw_report)
        except Exception as parse_err:
            logger.warning("LLM report JSON parsing failed [trace_id=%s]: %s", trace_id, parse_err)
            raise HTTPException(status_code=500, detail="LLM generated invalid JSON format")

        # Step 6: Save Patient Case Hierarchically if user is authenticated
        if current_user:
            new_case = PatientCase(
                user_id=current_user.id,
                age=profile.age,
                gender=profile.gender,
                surgery_type=profile.surgeryType,
                report_json=report_json
            )
            db.add(new_case)
            await db.flush() # get new_case.id
            
            # Explicitly convert cm to mm when persisting to database
            tumor_size_mm = round(profile.tumorSize * 10.0, 2) if profile.tumorSize is not None else None
            solid_size_mm = round(profile.solidSize * 10.0, 2) if profile.solidSize is not None else None

            new_tumor = Tumor(
                case_id=new_case.id,
                stage=profile.stage,
                location="Lung", # MVP default
                tumor_size_mm=tumor_size_mm,
                solid_size_mm=solid_size_mm,
                ctr=profile.ctr,
                morphology=profile.morphology
            )
            db.add(new_tumor)
            await db.flush()
            
            new_path = PathologyFeature(
                tumor_id=new_tumor.id,
                stas=profile.stas,
                vpi=profile.vpi,
                lvi=profile.lvi,
                iaslc_grade=profile.iaslcGrade,
                margin=profile.margin,
                lymph_nodes=profile.lymphNodes,
                egfr=profile.egfr
            )
            db.add(new_path)
            
            await db.commit()
        
        return report_json

    except HTTPException:
        # Re-raise explicit HTTP exceptions
        raise
    except Exception as e:
        logger.error("Analysis generation error [trace_id=%s]: %s", trace_id, e, exc_info=True)
        # Return 503 when the LLM API key is missing or invalid — no patient data in response
        if "Incorrect API key provided" in str(e) or "sk-mock-key" in str(e) or "AuthenticationError" in type(e).__name__:
            raise HTTPException(
                status_code=503,
                detail=(
                    "AI 分析服务当前不可用：后端未配置有效的 LLM API Key。"
                    "请联系系统管理员在服务器环境中设置 OPENAI_API_KEY。"
                    f" (Request ID: {trace_id})"
                ),
            )
        raise HTTPException(
            status_code=500,
            detail=f"智能循证分析服务暂时遇到内部处理异常，请稍后重试 (Request ID: {trace_id})"
        )

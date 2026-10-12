"""
Backend Unit Test Suite for ZhiaiWiki.
Covers:
  - IASLC / AJCC 9th Edition Staging Rules Engine (MedicalRulesEngine)
  - Security utilities (password hashing, PBKDF2 downgrade guards, strength validation)
  - Evidence API authentication dependencies (require_admin)
  - Vector search keyword fallback logic
"""
import sys
from pathlib import Path
# Ensure backend directory is in sys.path so 'app' is importable
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from app.services.rules import MedicalRulesEngine
from app.core.security import (
    get_password_hash,
    verify_password,
    validate_password_strength,
    PBKDF2_MIN_ACCEPTED_ITERATIONS,
)
from app.api.evidence import require_admin
from fastapi.security import HTTPBasicCredentials
from fastapi import HTTPException
from app.core.config import settings


# ============================================================================
# 1. MedicalRulesEngine IASLC / AJCC 9th Edition Tests
# ============================================================================

class TestMedicalRulesEngineAJCC9th:
    """Validate alignment with IASLC Staging Cards 9th Edition (2024)."""

    def test_pure_ggo_in_situ_tis(self):
        """Solid size = 0 indicates pure GGO / AIS => Tis / Stage 0."""
        result = MedicalRulesEngine.calculate_tnm(1.5, 0.0, "N0")
        assert result["t"] == "Tis"
        assert result["stage"] == "0"

    def test_t1a_n0_stage_ia1(self):
        """T1a (<=1.0cm) N0 => Stage IA1."""
        result = MedicalRulesEngine.calculate_tnm(1.0, None, "N0")
        assert result["t"] == "T1a"
        assert result["stage"] == "IA1"

    def test_t1_n1_downstage_to_iia(self):
        """CRITICAL AJCC 9th CHANGE: T1 N1 is Stage IIA (was IIB in 8th ed)."""
        for t_size in [0.8, 1.5, 2.5]:  # T1a, T1b, T1c
            result = MedicalRulesEngine.calculate_tnm(t_size, None, "N1")
            assert result["stage"] == "IIA", (
                f"T={result['t']} N1 should be Stage IIA in AJCC 9th, got {result['stage']}"
            )

    def test_t2a_n1_stage_iib(self):
        """T2a (3.1-4.0cm) N1 => Stage IIB."""
        result = MedicalRulesEngine.calculate_tnm(3.5, None, "N1")
        assert result["t"] == "T2a"
        assert result["stage"] == "IIB"

    def test_tis_n_positive_clinical_guard(self):
        """CLINICAL GUARD: Tis + N1-N3 is impossible; must not return a plausible stage."""
        for n in ["N1", "N2", "N3"]:
            result = MedicalRulesEngine.calculate_tnm(1.5, 0.0, n)
            assert result["stage"] == "Invalid_TisN+", (
                f"Tis with {n} must be flagged as Invalid_TisN+, got {result['stage']}"
            )

    def test_m1_subclassification(self):
        """M1a/M1b => IVA; M1c => IVB."""
        iva = MedicalRulesEngine.calculate_tnm(2.0, None, "N0", metastasis="M1a")
        assert iva["stage"] == "IVA"

        ivb = MedicalRulesEngine.calculate_tnm(2.0, None, "N0", metastasis="M1c")
        assert ivb["stage"] == "IVB"

    def test_n2_single_vs_multistation(self):
        """N2a (single-station) => IIIA; N2b (multi-station) => IIIB."""
        n2a = MedicalRulesEngine.calculate_tnm(1.5, None, "N2a")
        assert n2a["stage"] == "IIIA"

        n2b = MedicalRulesEngine.calculate_tnm(1.5, None, "N2b")
        assert n2b["stage"] == "IIIB"


# ============================================================================
# 2. Security & Password Tests
# ============================================================================

class TestSecurityModule:
    """Validate OWASP password strength, PBKDF2 hashing, and downgrade guards."""

    def test_weak_passwords_rejected(self):
        for weak in ["12345678", "password", "short", "zhiaiwiki"]:
            valid, _ = validate_password_strength(weak)
            assert not valid, f"Weak password '{weak}' was unexpectedly accepted"

    def test_strong_password_accepted(self):
        valid, _ = validate_password_strength("ClinicaL_Secur3_2026!")
        assert valid

    def test_pbkdf2_hash_and_verify(self):
        pwd = "SafePassword#2026"
        h = get_password_hash(pwd)
        assert h.startswith("pbkdf2_sha512$210000$")
        assert verify_password(pwd, h)
        assert not verify_password("WrongPassword#2026", h)

    def test_pbkdf2_downgrade_attack_rejected(self):
        """BUG-013 guard: tampered iteration count < 100,000 must be rejected."""
        pwd = "SafePassword#2026"
        h = get_password_hash(pwd)
        parts = h.split("$")
        # Attacker reduces iterations to 1
        tampered = f"pbkdf2_sha512$1${parts[2]}${parts[3]}"
        assert not verify_password(pwd, tampered), (
            "Downgraded hash with 1 iteration was incorrectly accepted!"
        )


# ============================================================================
# 3. Evidence API Admin Guard Tests
# ============================================================================

class TestEvidenceAuth:
    """Validate require_admin dependency on evidence endpoints."""

    def test_anonymous_request_rejected(self):
        with pytest.raises(HTTPException) as exc_info:
            require_admin(None)
        assert exc_info.value.status_code == 401

    def test_invalid_credentials_rejected(self):
        with pytest.raises(HTTPException) as exc_info:
            require_admin(HTTPBasicCredentials(username="admin", password="wrong"))
        assert exc_info.value.status_code == 401

    def test_valid_credentials_accepted(self):
        # Should execute without raising
        require_admin(
            HTTPBasicCredentials(
                username=settings.ADMIN_USERNAME,
                password=settings.ADMIN_PASSWORD,
            )
        )

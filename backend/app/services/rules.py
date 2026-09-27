class MedicalRulesEngine:
    """IASLC / AJCC 9th Edition (2024 Staging Cards) NSCLC staging rules.

    Key changes from 8th → 9th edition implemented here:
    - T1a/T1b/T1c/T1mi N1 → Stage IIA (was IIB in 8th ed.)
    - N2 is sub-divided into N2a (single-station) and N2b (multi-station)
    - M1 is sub-divided into IVA (M1a/M1b oligometastasis) and IVB (M1c widespread)
    - Tis (carcinoma in situ) with N1-N3 is clinically invalid: Tis has no
      invasive component and therefore cannot harbour lymph-node metastases;
      any such combination is flagged as "Invalid_TisN+" rather than silently
      producing a plausible-but-wrong stage.

    Source: IASLC Staging Cards 9th Edition (2024).
    """

    # IASLC / AJCC 9th edition NSCLC anatomic stage table.
    # Rows = T descriptor; N2 = N2a (single-station → IIIA); N2b = multi-station → IIIB.
    # M0 implied unless specified. M1a/M1b => IVA; M1c => IVB.
    STAGE_TABLE = {
        "Tis":  {"N0": "0"},        # Tis N1-N3 are clinically invalid (see calculate_tnm)
        "T1mi": {"N0": "IA1", "N1": "IIA",  "N2": "IIIA", "N2b": "IIIB", "N3": "IIIB"},
        "T1a":  {"N0": "IA1", "N1": "IIA",  "N2": "IIIA", "N2b": "IIIB", "N3": "IIIB"},
        "T1b":  {"N0": "IA2", "N1": "IIA",  "N2": "IIIA", "N2b": "IIIB", "N3": "IIIB"},
        "T1c":  {"N0": "IA3", "N1": "IIA",  "N2": "IIIA", "N2b": "IIIB", "N3": "IIIB"},
        "T2a":  {"N0": "IB",  "N1": "IIB",  "N2": "IIIA", "N2b": "IIIB", "N3": "IIIB"},
        "T2b":  {"N0": "IIA", "N1": "IIB",  "N2": "IIIA", "N2b": "IIIB", "N3": "IIIB"},
        "T3":   {"N0": "IIB", "N1": "IIIA", "N2": "IIIB", "N2b": "IIIB", "N3": "IIIC"},
        "T4":   {"N0": "IIIA","N1": "IIIA", "N2": "IIIB", "N2b": "IIIB", "N3": "IIIC"},
    }

    @staticmethod
    def calculate_tnm(
        tumor_size_cm: float,
        solid_size_cm: float,
        nodes: str,
        metastasis: str = "M0",
        n2_multistation: bool = False,
    ) -> dict:
        """
        Calculate TNM stage based on IASLC / AJCC 9th Edition (2024) rules for lung cancer.

        Parameters
        ----------
        tumor_size_cm : float | None
            Total gross tumor size on CT (cm).
        solid_size_cm : float | None
            Solid/invasive component size for subsolid nodules (cm).
            When present, this value drives the T descriptor (IASLC 9th rule).
        nodes : str
            N descriptor string: "N0", "N1", "N2", "N2a", "N2b", or "N3".
        metastasis : str
            M descriptor: "M0", "M1", "M1a", "M1b", "M1c", "M1c1", "M1c2".
        n2_multistation : bool
            If True, treats N2 as N2b (multi-station mediastinal → IIIB).
            If False, treats N2 as N2a (single-station → IIIA). Default False.
        """
        # T descriptor relies on solid size for subsolid nodules (IASLC 9th).
        if solid_size_cm is not None:
            size_to_use = solid_size_cm
        elif tumor_size_cm is not None:
            size_to_use = tumor_size_cm
        else:
            size_to_use = 0.0

        t = "Tx"
        if (solid_size_cm == 0.0) or (size_to_use == 0.0 and (tumor_size_cm is not None or solid_size_cm is not None)):
            # Pure GGO or pathological in-situ: no invasive component => Tis (Stage 0)
            t = "Tis"
        elif size_to_use <= 0.5 and solid_size_cm is not None and tumor_size_cm and tumor_size_cm > solid_size_cm:
            t = "T1mi"
        elif 0.0 < size_to_use <= 1.0:
            t = "T1a"
        elif size_to_use <= 2.0:
            t = "T1b"
        elif size_to_use <= 3.0:
            t = "T1c"
        elif size_to_use <= 4.0:
            t = "T2a"
        elif size_to_use <= 5.0:
            t = "T2b"
        elif size_to_use <= 7.0:
            t = "T3"
        else:
            t = "T4"

        # Normalize N descriptor and resolve N2a vs N2b.
        raw_n = nodes or "Nx"
        if raw_n == "N2a":
            n = "N2"       # single-station N2 → lookup key "N2"
            n_lookup = "N2"
        elif raw_n == "N2b" or (raw_n == "N2" and n2_multistation):
            n = "N2b"      # multi-station N2 → lookup key "N2b"
            n_lookup = "N2b"
        elif raw_n in ("N0", "N1", "N2", "N3"):
            n = raw_n
            n_lookup = raw_n
        else:
            n = "Nx"
            n_lookup = None

        # Determine M sub-class and overall stage.
        m = metastasis or "M0"
        stage = "Unknown"

        if m in ("M1c", "M1c1", "M1c2"):
            stage = "IVB"
        elif m in ("M1", "M1a", "M1b"):
            stage = "IVA"
        elif m not in ("M0",):
            stage = "IVA"  # any unrecognised M1 sub-type → IVA (safe default)
        elif t == "Tis" and n_lookup and n_lookup != "N0":
            # CLINICAL SAFETY GUARD: Tis (carcinoma in situ) cannot have lymph-node
            # metastases — no invasive component means no lymphatic spread pathway.
            # Returning a labelled invalid stage prevents downstream LLM or UI from
            # displaying a plausible-looking but medically impossible result.
            stage = "Invalid_TisN+"
        elif t in MedicalRulesEngine.STAGE_TABLE and n_lookup and n_lookup in MedicalRulesEngine.STAGE_TABLE[t]:
            stage = MedicalRulesEngine.STAGE_TABLE[t][n_lookup]
        elif t in MedicalRulesEngine.STAGE_TABLE and n == "N0":
            # Fallback for Nx when N0 is available
            stage = MedicalRulesEngine.STAGE_TABLE[t].get("N0", "Unknown")

        return {"t": t, "n": n, "m": m, "stage": stage, "edition": "IASLC_9th_2024"}

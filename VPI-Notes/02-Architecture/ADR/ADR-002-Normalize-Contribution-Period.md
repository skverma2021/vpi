# ADR-002: Normalize Contribution Period Fields

- **Status:** Accepted  
- **Date:** 2026-02-20  
- **Owner:** s  
- **Related Docs:** [[VPI-ERD]], [[Feature-Monthly-Contribution-Status-Report]]

---

## 1. Context

The initial Contributions table included four fields:

- fromMonth  
- fromYear  
- toMonth  
- toYear  

This structure is verbose, error‑prone, and complicates:

- Querying  
- Indexing  
- Filtering  
- Reporting  
- Future extensions (e.g., quarterly or annual contributions)

The system primarily needs to represent **a single monthly period** for each contribution. Even if multi‑month payments are allowed later, the current four‑field structure is unnecessarily complex.

---

## 2. Decision

**We will replace the four fields with two normalized fields:**

- `periodStart` — a `date` representing the first day of the month  
- `periodEnd` — a `date` representing the last day of the month  

Alternatively, for v1, we may use:

- `periodMonth` — integer (1–12)  
- `periodYear` — integer  

The final choice will depend on reporting needs, but the four‑field structure will be removed.

---

## 3. Rationale

### Why normalize?

- **Cleaner queries**  
  - `WHERE periodMonth = 2 AND periodYear = 2026`  
  - or `WHERE periodStart BETWEEN ...`

- **Better indexing**  
  - Single composite index instead of four fields

- **Less user error**  
  - No mismatched month/year combinations

- **Future‑proof**  
  - Supports multi‑month ranges if needed  
  - Supports date‑based reporting

- **Aligns with industry practice**  
  - Billing systems typically use a single “billing period” field

### Alternatives considered

#### Option A — Keep four fields  
- Pros: explicit  
- Cons: redundant, error‑prone, harder to query

#### Option B — Use a single `yearMonth` integer (e.g., 202602)  
- Pros: compact  
- Cons: less readable, requires parsing

The chosen approach balances clarity and flexibility.

---

## 4. Consequences

### Positive
- Simpler schema  
- Easier reporting  
- Cleaner Prisma models  
- Better performance on queries  
- Less UI complexity  

### Negative / Risks
- Migration required for existing data  
- Need to ensure consistent date formatting  

---

## 5. Implementation Notes

- Update Prisma schema  
- Update ERD  
- Update contribution creation UI  
- Update monthly report logic  
- Update tests  
- Add composite index on (periodYear, periodMonth) if using integers  

**Follow-ups:**  
- [ ] Update ERD  
- [ ] Update Prisma schema  
- [ ] Update Contribution forms  

# ADR-003: Enforce toDt for Owners/Residents to Maintain Temporal Integrity

- **Status:** Accepted  
- **Date:** 2026-02-20  
- **Owner:** s  
- **Related Docs:** [[VPI-ERD]], [[Feature-Monthly-Contribution-Status-Report]]

---

## 1. Context

The `unitOwners` and `unitResidents` tables represent **temporal relationships**:

- A unit may have multiple owners over time  
- A unit may have multiple residents over time  
- Only one owner/resident should be “current” at any time  

Copilot has already added:toDt DateTime? // null means current

This is correct, but **temporal integrity** requires:

- No overlapping date ranges  
- A new row can only be added when the previous row is closed  
- The UI must enforce entering `toDt` before adding a new owner/resident  

Without this, the system risks:

- Multiple “current” owners  
- Ambiguous residency  
- Incorrect reporting  
- Broken audit trails  

---

## 2. Decision

**We will enforce that:**

1. `toDt` must be provided before a new owner/resident row is created  
2. Only one row per unit may have `toDt = null`  
3. The UI will require the user to “close” the current owner/resident before adding a new one  
4. Prisma will enforce a constraint via application logic (since SQL cannot enforce non-overlapping ranges easily)

---

## 3. Rationale

### Why enforce `toDt`?

- Ensures **clean temporal history**  
- Prevents overlapping ownership/residency  
- Supports accurate reporting (e.g., who was the owner in a given month)  
- Matches real-world processes (handover dates)  
- Avoids ambiguous data that AI cannot reason about  

### Alternatives considered

#### Option A — Allow multiple open rows  
- Pros: simpler UI  
- Cons: breaks reporting, creates ambiguity

#### Option B — Auto-close previous row  
- Pros: convenient  
- Cons: dangerous — system should not guess dates

The chosen approach ensures correctness and auditability.

---

## 4. Consequences

### Positive
- Clean, reliable ownership/residency history  
- Accurate contribution reports  
- Predictable behavior for future modules (maintenance, security)  
- Easier debugging and auditing  

### Negative / Risks
- Slightly more UI steps  
- Requires validation logic in server actions  

---

## 5. Implementation Notes

### Backend
- Add server-side validation:
  - Reject new row if existing row has `toDt = null`
  - Reject overlapping date ranges
- Add helper:
  - `closeCurrentOwner(unitId, toDt)`
  - `closeCurrentResident(unitId, toDt)`

### Frontend
- UI flow:
  1. Show current owner/resident  
  2. Require user to enter `toDt`  
  3. Only then allow adding a new row  

### Testing
- Test overlapping ranges  
- Test missing `toDt`  
- Test correct “current” owner/resident selection  

**Follow-ups:**  
- [ ] Update ERD  
- [ ] Update Prisma schema  
- [ ] Update Owner/Resident UI  



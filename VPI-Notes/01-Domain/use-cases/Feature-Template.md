# Feature: <Name> (e.g. Monthly Contribution Status Report)

- **Status:** Draft | In Progress | Implemented
- **Owner:** <Your Name>
- **Related ADRs:** [[ADR-XXX]], [[ADR-YYY]]
- **Related Diagrams:** [[Payment-Flow]], [[VPI-ERD]]

---

## 1. Summary

- **Goal:**
  - What problem does this feature solve?
- **Primary users:**
  - e.g. Society Manager, Block Representative, Resident

---

## 2. Domain Description

- **Entities involved:**
  - Units, Contributions, Individuals, unitOwners, unitResidents
- **Business rules:**
  - e.g. “Payment status is evaluated per unit per month”
  - e.g. “Late payments are flagged after 7 days”

---

## 3. User Stories

- **Story 1:**
  - As a `<role>`, I want `<action>` so that `<outcome>`.
- **Story 2:**
  - ...

---

## 4. Flows

- **Happy path:**
  1. User does X
  2. System validates Y
  3. System generates Z

- **Edge cases:**
  - Owner changed mid-month
  - No contribution recorded
  - Partial payment

- **Diagrams:**
  - [[Payment-Flow]] (sequence diagram)
  - [[Monthly-Report-Generation]] (flowchart)

---

## 5. Data Requirements

- **Inputs:**
  - Tables/fields used (Units, Contributions, etc.)
- **Outputs:**
  - e.g. “Per-unit status: Paid / Pending / Late”
  - e.g. “PDF report per block”

---

## 6. UX Notes

- **Views:**
  - List view (by block, by unit)
  - Filters (month, block, status)
- **PDF:**
  - Branding (VPI logo, block name)
  - Columns (Unit, Owner, Status, Amount, Date)

---

## 7. Non-Functional Requirements

- **Performance:**
  - Must generate report for all blocks within X seconds
- **Security:**
  - Only managers can see all units
  - Residents see only their unit(s)
- **Auditability:**
  - Changes to contributions must be traceable

---

## 8. Implementation Notes

- **Backend:**
  - New server actions?
  - New Prisma queries?
- **Frontend:**
  - New pages/routes?
  - New components?
- **Testing:**
  - Critical scenarios to cover

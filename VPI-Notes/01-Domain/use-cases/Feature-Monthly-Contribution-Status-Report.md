# Feature: Monthly Contribution Status Report

- **Status:** Draft  
- **Owner:** s  
- **Related ADRs:** [[ADR-001-IDs-UUID]]  
- **Related Diagrams:** [[VPI-ERD]], [[Monthly-Report-Generation]]

---

## 1. Summary

The society management team needs a monthly report showing which units have paid their contribution and which have not. This report must be generated during the first week of each month and made available to managers and block representatives.

The report will also be exportable as a PDF for offline circulation.

---

## 2. Domain Description

### Entities involved
- **Units** — the fundamental billing entity  
- **Contributions** — payment records  
- **Individuals** — owners/residents (for display)  
- **unitOwners / unitResidents** — determine who is associated with a unit during the billing period  

### Business rules
- Each unit owes a monthly contribution (amount defined elsewhere).  
- A payment is considered **on-time** if received within the first 7 days of the month.  
- A unit’s status is one of:
  - **Paid**
  - **Pending**
  - **Late**
- Ownership/residency changes do not affect the unit’s obligation.

---

## 3. User Stories

### Story 1  
As a **Society Manager**, I want to view a list of all units with their payment status for a selected month so that I can track compliance.

### Story 2  
As a **Block Representative**, I want to filter the report by block so that I can focus on my area.

### Story 3  
As a **Manager**, I want to download the report as a PDF so that I can circulate it offline.

---

## 4. Flows

### Happy Path
1. Manager selects month/year.  
2. System fetches all units.  
3. System checks Contributions for that period.  
4. System determines status (Paid / Pending / Late).  
5. System displays results in a table.  
6. Manager optionally exports PDF.

### Edge Cases
- No contributions recorded for any unit.  
- Multiple contributions for the same unit (take earliest).  
- Owner/resident changed mid-month (irrelevant to status).  
- Invalid month/year input.

### Diagrams
- [[Monthly-Report-Generation]] (flowchart)  
- [[Payment-Flow]] (sequence diagram)

---

## 5. Data Requirements

### Inputs
- `Units`  
- `Contributions` filtered by month/year  
- `unitOwners` (for display)  
- `unitResidents` (optional for display)

### Outputs
- Table with:
  - Unit description  
  - Block  
  - Owner name  
  - Amount  
  - Payment date  
  - Status  

- PDF export with:
  - VPI branding  
  - Block-wise grouping  
  - Summary totals  

---

## 6. UX Notes

### Views
- Month/year selector  
- Block filter  
- Table with sortable columns  
- Status badges (Paid / Pending / Late)

### PDF
- Header: “VPI Monthly Contribution Status Report”  
- Subheader: Month + Year  
- Group by block  
- Footer: Generated on <date>

---

## 7. Non-Functional Requirements

- **Performance:**  
  - Must generate report for all 300 units within 2 seconds.

- **Security:**  
  - Only managers can view all units.  
  - Residents can view only their own unit(s).

- **Auditability:**  
  - Contribution entries must not be editable after creation.  
  - All server actions must be logged.

---

## 8. Implementation Notes

### Backend
- New server action: `getMonthlyContributionStatus(month, year)`  
- Prisma query to fetch contributions in range  
- Logic to determine status  
- PDF generation using React-PDF

### Frontend
- New route: `/reports/contributions`  
- Filters + table using shadcn + TanStack Query  
- PDF download button

### Testing
- Unit tests for status calculation  
- Integration test for PDF generation  
- UI test for filters  
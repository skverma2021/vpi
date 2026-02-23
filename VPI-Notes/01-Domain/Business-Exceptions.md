# Business Exceptions

## Duplicate Contribution
**Rule:** A Unit cannot pay twice for the same period (month/year).

**System Behavior:**
- Server Action returns a 400 error with message:
  "Contribution already exists for this period."
- UI displays a toast notification with the same message.

## Ownership Overlap
**Rule:** A Unit cannot have two active owners.

**System Behavior:**
- Prevent creation of new owner record until current owner is closed.

## Residency Overlap
Same rules as ownership.

## Invalid Dates
**Rule:** toDt must be >= fromDt.

**System Behavior:**
- Validation error shown in form.

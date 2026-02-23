# Domain Rules

## Ownership Rules
1. A Unit may have multiple historical owners but only one active owner at a time.
2. An ownership record must have `fromDt` and may have `toDt`. A null `toDt` indicates the current owner.
3. A new owner cannot be added until the current owner record is closed.

## Residency Rules
1. A Unit may have multiple historical residents but only one active resident at a time.
2. Residency follows the same temporal integrity rules as ownership.

## Contribution Rules
1. Contributions are recorded per Unit per month/year.
2. A Unit may have zero or more contributions for a given period.
3. Contribution periods are normalized using `periodMonth` and `periodYear`.

## Individual Rules
1. An Individual may be an owner, resident, or both.
2. Email and mobile must be unique per individual.

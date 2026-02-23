# Entities

## Blocks
Represents a building block containing multiple Units.

### Attributes
- ID
- description

## Units
Represents a residential or commercial unit.

### Attributes
- ID
- description
- blockId
- sqFt

## Individuals
Represents a person associated with a Unit.

### Attributes
- ID
- fName, mName, sName
- eMail
- mobile
- gender
- altMobile

## Contributions
Represents a monthly maintenance payment.

### Attributes
- ID
- unitId
- transactionId
- transactionDateTime
- periodMonth
- periodYear
- amt
- depositedBy
- depositorMobile

## unitOwners
Represents ownership history for a Unit.

### Attributes
- ID
- unitId
- indId
- fromDt
- toDt

## unitResidents
Represents residency history for a Unit.

### Attributes
- ID
- unitId
- indId
- fromDt
- toDt

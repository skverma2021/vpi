/individuals
    GET     → listIndividuals()
/individuals/new
    POST    → createIndividual()
/individuals/[id]
    GET     → getIndividualById()
/individuals/[id]/edit
    POST    → updateIndividual()
/individuals/[id]/delete
    POST    → deleteIndividual()


/blocks
    GET     → listBlocks()
/blocks/new
    POST    → createBlock()
/blocks/[id]
    GET     → getBlockById()
/blocks/[id]/edit
    POST    → updateBlock()
/blocks/[id]/delete
    POST    → deleteBlock()


/units
    GET     → listUnits()
/units/new
    POST    → createUnit()
/units/[id]
    GET     → getUnitById()
/units/[id]/edit
    POST    → updateUnit()
/units/[id]/delete
    POST    → deleteUnit()


/units/[id]/owners
    GET     → listOwnersForUnit()
/units/[id]/owners/new
    POST    → addOwner()
/units/[id]/owners/[ownerId]/close
    POST    → closeOwnerRecord()

/units/[id]/residents
    GET     → listResidentsForUnit()
/units/[id]/residents/new
    POST    → addResident()
/units/[id]/residents/[residentId]/close
    POST    → closeResidentRecord()


/contributions
    GET     → listContributions()
/contributions/new
    POST    → createContribution()
/contributions/[id]
    GET     → getContributionById()
/contributions/[id]/edit
    POST    → updateContribution()
/contributions/[id]/delete
    POST    → deleteContribution()


/reports
    GET     → listAvailableReports()

/reports/contributions
    GET     → showMonthlyContributionReportPage()

/reports/contributions/generate
    POST    → getMonthlyContributionStatus(month, year)

/reports/contributions/pdf
    POST    → generateMonthlyContributionPDF(month, year)


/auth/login
/auth/logout
/auth/callback

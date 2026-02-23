VPI Naming Conventions

1. Database (Prisma Models)
    Model names
        PascalCase
        Singular
        Match domain language

    Examples:
        Individuals
        Units
        Blocks  
        Contributions
        unitOwners
        unitResidents

    Field names
        camelCase
        Clear and descriptive
    Examples:
        transactionDateTime
        periodMonth
        periodYear
        fromDt
        toDt

2. Zod Schemas
    Schema names
        camelCase   
    Suffix: Schema

    Examples:
        individualSchema
        unitSchema
        contributionSchema

    Types
        PascalCase
        Suffix: Input
    Examples:
        IndividualInput
        UnitInput

3. Server Actions
    Naming pattern
        camelCase
        Verb + Entity
    Examples:
        createIndividual
        updateIndividual
        deleteIndividual
        listIndividuals
        getIndividualById

    File placement
        Inside the route folder:
            /individuals/actions.ts
            /units/actions.ts
            /contributions/actions.ts

4. Next.js Routes (App Router)
    Folder names
        kebab-case
        Plural for collections
        Singular for dynamic routes
    Examples:
        /individuals
        /individuals/[id]
        /individuals/new
        /individuals/[id]/edit

    Page files
        Always page.tsx

    Examples:
        /individuals/page.tsx
        /individuals/new/page.tsx
        /individuals/[id]/edit/page.tsx

5. React Components
    Component names
        PascalCase
        One component per file
    Examples:
        IndividualsTable.tsx
        IndividualForm.tsx
        UnitDetails.tsx
    File names
        Match component name exactly

6. shadcn UI Components
    Form components
        <Entity>Form.tsx

    Examples:
        IndividualForm.tsx
        ContributionForm.tsx

    Table components
        <Entity>Table.tsx
    Examples:
        IndividualsTable.tsx

7. TanStack Query Keys
    Pattern
        Array form
        Entity + optional params

    Examples:
        ["individuals"]
        ["individuals", id]
        ["contributions", { month, year }]

8. Utility Functions
    Naming pattern
        camelCase
        Verb + Noun
    Examples:
        formatDate
        calculateStatus
        closeCurrentOwner

9. PDF Generation
    Naming pattern
        camelCase
        Verb + ReportName
    Examples:
        generateMonthlyContributionPDF

10. Excalidraw Files
    Naming pattern
        PascalCase
        Suffix: .excalidraw
    Examples:
        Dashboard.excalidraw
        Individuals-List.excalidraw
        Individuals-Form.excalidraw
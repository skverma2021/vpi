# Architecture Prompt Standards

Use these prompts when generating or updating architecture artefacts such as ERDs, sequence diagrams, flowcharts, ADRs, and system context diagrams.

---

## ERD Generation Prompt
“Generate a Mermaid ERD for the following entities. Use only valid Mermaid ERD syntax. Do not include inline comments inside attribute blocks. Ensure relationships are clearly defined.”

## Sequence Diagram Prompt
“Generate a Mermaid sequence diagram showing the interaction between UI, Server Actions, Prisma, and Database for the following flow: <describe flow>.”

## Flowchart Prompt
“Generate a Mermaid flowchart describing the decision logic for <feature>. Use clear branching and label all decision nodes.”

## ADR Prompt
“Write an Architecture Decision Record using the ADR template. Include: Context, Decision, Rationale, Alternatives, Consequences.”

## System Context Prompt
“Generate a high-level system context diagram showing users, external systems, and the VPI application boundary.”

## Module Boundary Prompt
“Describe module boundaries using domain-driven design style: Domain Layer, Application Layer, UI Layer, Infrastructure Layer.”


---
trigger: always_on
---

# Future Mail Project Rules
## Language

The user communicates in Vietnamese.

All communication with the user must be in Vietnamese, including:

- Progress reports
- Explanations
- Questions
- Error reports
- Implementation summaries
- Test results
- Requests for permission
- Phase completion reports

Use English only when technically necessary, such as:

- Source code
- Variable names
- Function names
- File names
- Package names
- API routes
- Official technology names
- Error messages that must be reproduced exactly

Do not respond to the user in English unless explicitly requested.
## Source of Truth

The complete product specification is defined in:

`@FUTURE-MAIL-SPEC.md`

Always read and follow this specification before implementing the application.

## Scope Control

The specification is the strict product boundary.

Do not add anything that is not explicitly required by the specification.

Do not:

- Add features
- Add libraries
- Add frameworks
- Change the technology stack
- Add infrastructure
- Add services
- Add database models
- Add API endpoints
- Add pages
- Add authentication
- Add notifications
- Add analytics
- Add file uploads
- Add unrelated UI functionality

unless explicitly authorized by the user.

## Existing Skills

The project already contains skills under:

`.agents/skills/`

Use the existing skills when they are relevant.

Do not modify existing skills.

Do not create new skills.

Do not install additional skills.

Skills provide implementation guidance only. They do not grant permission to expand the product scope.

## Development Process

Follow the development phases defined in:

`@FUTURE-MAIL-SPEC.md`

Work on one phase at a time.

Do not automatically continue to the next phase.

After completing a phase:

1. Verify the implementation.
2. Report what was completed.
3. Report any problems.
4. Stop and wait for further instruction.

## Change Control

Before implementing a change, classify it as:

### Required

Explicitly required by `FUTURE-MAIL-SPEC.md`.

Implement it.

### Implementation Detail

Necessary to implement an explicitly required feature.

Implement it if it does not expand the product scope.

### New Scope

Anything that introduces functionality, technology, dependency, infrastructure, API, page, database model, or behavior not explicitly required.

STOP.

Do not implement it.

Explain what is required and wait for user authorization.

## Dependency Control

Do not install a dependency unless:

1. It is explicitly specified in the specification, or
2. It is strictly required to implement an explicitly specified requirement.

If a new dependency appears necessary and is not specified:

STOP and ask for permission.

## Phase Control

When starting a new conversation or recovering from an interrupted session:

1. Read `@FUTURE-MAIL-SPEC.md`.
2. Inspect the current project state.
3. Inspect the relevant existing skills.
4. Determine what has already been implemented.
5. Continue only from the current project state.
6. Do not recreate existing work.
7. Do not skip unfinished requirements.
8. Do not move to a later phase without explicit authorization.

## Quality

Use the existing project skills for:

- API design
- Frontend engineering
- UI quality
- Security
- Browser testing
- Debugging
- Code review
- Git workflow

Do not use quality improvements as justification for adding new product functionality.

## Final Rule

When uncertain whether something is allowed:

DO NOT IMPLEMENT IT.

Stop and ask the user for permission.


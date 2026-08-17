# FUTURE MAIL — SKILL-DRIVEN DEVELOPMENT

## 0. CRITICAL RULES — MUST FOLLOW

You are working inside an existing project that already contains a set of development skills under:

```text
.agents/skills/
```

Available skills include:

```text
.agents/skills/
├── api-and-interface-design/
├── browser-testing-with-devtools/
├── code-review-and-quality/
├── debugging-and-error-recovery/
├── documentation-and-adrs/
├── frontend-ui-engineering/
├── git-workflow-and-versioning/
├── idea-refine/
├── impeccable/
└── security-and-hardening/
```

### ABSOLUTE PROJECT RULE

**DO NOT introduce anything that is not explicitly specified in this prompt without my permission.**

This means:

* Do NOT add new features.
* Do NOT add new libraries.
* Do NOT add new frameworks.
* Do NOT change the specified tech stack.
* Do NOT introduce new infrastructure.
* Do NOT introduce Redis.
* Do NOT introduce Kafka.
* Do NOT introduce Docker.
* Do NOT introduce Kubernetes.
* Do NOT introduce authentication.
* Do NOT introduce OAuth.
* Do NOT introduce a payment system.
* Do NOT introduce AI features.
* Do NOT introduce notifications.
* Do NOT introduce file uploads.
* Do NOT introduce analytics.
* Do NOT introduce third-party services other than those explicitly specified.
* Do NOT create additional skills.
* Do NOT modify existing skills.
* Do NOT remove existing skills.
* Do NOT install a dependency merely because you personally prefer it.

If you believe something additional is required, **STOP and ask for permission before implementing it.**

Do not silently make architectural decisions that expand the scope.

---

# 1. SKILL USAGE RULE

Before implementing anything, inspect the relevant existing skills under:

```text
.agents/skills/
```

Read the skill instructions before performing work related to that skill.

Use the existing skills as development guidelines.

### Skill mapping

Use:

```text
idea-refine/
```

when analyzing or clarifying the product requirements.

Use:

```text
api-and-interface-design/
```

when designing REST APIs and backend interfaces.

Use:

```text
frontend-ui-engineering/
```

when implementing React, UI structure, responsive behavior, and frontend architecture.

Use:

```text
impeccable/
```

when implementing the visual design and user interface quality.

Use:

```text
security-and-hardening/
```

when implementing validation, secrets handling, API security, and security-related requirements.

Use:

```text
code-review-and-quality/
```

after implementation phases to review code quality.

Use:

```text
debugging-and-error-recovery/
```

when diagnosing and fixing errors.

Use:

```text
browser-testing-with-devtools/
```

when testing the application through the browser.

Use:

```text
documentation-and-adrs/
```

only for documentation or architectural decisions explicitly required by this project.

Use:

```text
git-workflow-and-versioning/
```

when performing Git-related operations.

---

# 2. SKILL PRIORITY

If an existing skill provides a rule for how something should be implemented, follow that skill.

However:

**The project requirements in this prompt define the product scope.**

Skills may improve implementation quality, but they must NOT expand the product scope.

For example:

If a skill suggests adding:

```text
authentication
Redis
analytics
notifications
extra UI pages
additional infrastructure
```

do NOT implement those features unless explicitly required by this prompt.

The skill provides implementation guidance, not permission to expand the product.

---

# 3. PRODUCT

Build a full-stack web application called:

# Future Mail

The application allows me to write an email to my future self and schedule it to be automatically sent at a specific date and time.

Example:

```text
To:
my@email.com

Subject:
Dear Future Me

Content:
I hope things are going well...

Send at:
January 1, 2027 08:00
```

The system stores the email and automatically sends it at the scheduled time.

---

# 4. TECH STACK

Use exactly:

```text
Frontend:
React
TypeScript
Vite
Tailwind CSS

Backend:
Node.js
Express
TypeScript

Database:
Prisma
SQLite

Email:
Resend API

Scheduler:
node-cron

Validation:
Zod
```

Do not replace any of these technologies.

Do not add technologies without permission.

---

# 5. CORE FEATURES

## 5.1 Dashboard

The dashboard must show:

* Number of scheduled emails
* Number of sent emails
* Upcoming emails
* Recent emails

Each email must display:

* Subject
* Recipient
* Scheduled date
* Status

Statuses:

```text
SCHEDULED
SENT
FAILED
CANCELLED
```

---

# 6. CREATE FUTURE EMAIL

Create:

```text
/create
```

The user can enter:

```text
Recipient email
Subject
Message
Date
Time
Timezone
```

Example:

```text
Recipient:
me@example.com

Subject:
Dear Future Me

Message:
I hope you are doing well...

Send date:
01/01/2027

Send time:
08:00

Timezone:
Asia/Ho_Chi_Minh
```

Requirements:

* Validate recipient email.
* Subject is required.
* Message is required.
* Date is required.
* Time is required.
* Timezone is required.
* Scheduled time must be in the future.
* Backend validation is mandatory.
* Frontend validation must not replace backend validation.

Before saving, display:

```text
This email will be sent on January 1, 2027 at 08:00.
```

---

# 7. EMAIL DETAIL

Create:

```text
/emails/:id
```

Display:

* Recipient
* Subject
* Message
* Scheduled time
* Status
* Created time
* Sent time

If status is:

```text
SCHEDULED
```

display a Cancel button.

Cancellation:

```text
SCHEDULED → CANCELLED
```

Do not allow cancellation of an already sent email.

---

# 8. DATABASE

Use:

```text
Prisma + SQLite
```

Create a `ScheduledEmail` model containing:

```text
id
recipient
subject
content
scheduledAt
timezone
status
sentAt
failedAt
errorMessage
createdAt
updatedAt
```

Use these statuses:

```text
SCHEDULED
SENDING
SENT
FAILED
CANCELLED
```

Add indexes for:

```text
status
scheduledAt
```

Store:

```text
scheduledAt
```

in UTC.

Store the user's IANA timezone separately.

Example:

```text
Asia/Ho_Chi_Minh
```

---

# 9. EMAIL SCHEDULER

This is a critical requirement.

Do NOT use:

```text
setTimeout()
```

for persistent scheduling.

Do NOT store scheduled jobs only in memory.

The database is the source of truth.

Use:

```text
node-cron
```

to periodically check the database.

The worker runs every 30 seconds.

It searches for:

```text
status = SCHEDULED
AND scheduledAt <= current UTC time
```

Processing:

```text
SCHEDULED
     ↓
SENDING
     ↓
Send through Resend
     ↓
Success → SENT
Failure → FAILED
```

The implementation must prevent accidental duplicate sending.

The application must continue working correctly after restarting the backend.

---

# 10. EMAIL SERVICE

Create a separate email service abstraction.

Example:

```typescript
sendEmail({
  to,
  subject,
  content
})
```

Use Resend as the implementation.

Environment variables:

```env
RESEND_API_KEY=
EMAIL_FROM=
DATABASE_URL="file:./dev.db"
```

Never expose:

```text
RESEND_API_KEY
```

to the frontend.

---

# 11. REST API

Implement exactly these APIs:

```http
GET    /api/emails
GET    /api/emails/:id
POST   /api/emails
POST   /api/emails/:id/cancel
```

Use Zod for backend request validation.

Return appropriate HTTP status codes.

Return useful error messages.

Do not create additional API endpoints unless they are required by the explicitly specified functionality.

If another endpoint appears necessary, stop and ask for permission.

---

# 12. UI DESIGN

The application should feel like:

# A personal digital time capsule

Visual direction:

* Minimal
* Clean
* Modern
* Calm
* Responsive
* Good typography
* Generous whitespace

Do not turn the UI into a generic admin dashboard.

Pages:

```text
/
Dashboard

/create
Write a Future Email

/emails/:id
Email Detail
```

Main action:

```text
Write a Future Email
```

---

# 13. CREATE EMAIL UX

When writing an email, display a live preview:

```text
You are writing to your future self.

This letter will arrive:

January 1, 2027
08:00
Asia/Ho_Chi_Minh
```

After successful scheduling:

```text
Your letter has been scheduled.

It will be sent on January 1, 2027 at 08:00.
```

Do not add unrelated functionality to this page.

---

# 14. DEVELOPMENT PHASES

Work incrementally.

Do not skip phases.

Do not implement the entire application blindly.

---

## PHASE 1 — PROJECT SETUP

First:

1. Inspect the existing project.
2. Inspect `.agents/skills/`.
3. Read the relevant skills.
4. Determine the current project state.
5. Create the required frontend/backend structure.
6. Set up React + TypeScript + Vite.
7. Set up Tailwind CSS.
8. Set up Node.js + Express + TypeScript.
9. Make frontend and backend run.

At the end of Phase 1:

* Verify frontend works.
* Verify backend works.
* Verify TypeScript compilation.
* Verify the development environment.

Do not implement database, email sending, scheduler, or additional features yet.

---

# PHASE 2 — DATABASE

Implement:

```text
Prisma
SQLite
ScheduledEmail
```

Create the required schema.

Run the migration.

Verify database operations.

Do not implement unrelated database models.

---

# PHASE 3 — API

Implement exactly:

```http
GET    /api/emails
GET    /api/emails/:id
POST   /api/emails
POST   /api/emails/:id/cancel
```

Use:

```text
Zod
```

for validation.

Follow:

```text
.agents/skills/api-and-interface-design/
```

Do not add additional endpoints without permission.

---

# PHASE 4 — FRONTEND

Implement:

```text
Dashboard
Create Future Email
Email Detail
```

Follow:

```text
.agents/skills/frontend-ui-engineering/
.agents/skills/impeccable/
```

Do not add pages that are not specified.

---

# PHASE 5 — RESEND

Implement the email service.

Use:

```text
Resend API
```

Use environment variables.

Never expose API keys.

Follow:

```text
.agents/skills/security-and-hardening/
```

---

# PHASE 6 — SCHEDULER

Implement:

```text
node-cron
```

Run every 30 seconds.

Process due emails.

Ensure:

```text
SCHEDULED → SENDING → SENT
```

or:

```text
SCHEDULED → SENDING → FAILED
```

Prevent duplicate sending.

Test behavior after backend restart.

---

# PHASE 7 — TESTING AND QUALITY

Use:

```text
.agents/skills/browser-testing-with-devtools/
.agents/skills/code-review-and-quality/
.agents/skills/debugging-and-error-recovery/
```

Test:

1. Create email.
2. Validation.
3. Future date requirement.
4. View email.
5. Cancel email.
6. Scheduler.
7. Successful email sending.
8. Failed email sending.
9. Duplicate-send prevention.
10. Backend restart.
11. Timezone handling.

Fix only problems related to the requirements in this prompt.

Do not use testing as an excuse to add new features.

---

# 15. DEFINITION OF DONE

The application is complete when I can:

1. Open the application.
2. Write an email.
3. Choose a future date and time.
4. Schedule it.
5. Restart the backend.
6. Still see the scheduled email.
7. Wait until the scheduled time.
8. Automatically receive the email.
9. See the status change to `SENT`.
10. See the actual sent timestamp.
11. Never receive the same scheduled email twice.

---

# 16. CHANGE CONTROL

This section is mandatory.

Before making a change, classify it as:

```text
REQUIRED
```

if it is explicitly requested in this prompt.

or:

```text
IMPLEMENTATION DETAIL
```

if it is necessary to implement an explicitly requested feature.

or:

```text
NEW SCOPE
```

if it introduces functionality, infrastructure, technology, dependency, API, page, database model, or behavior not explicitly requested.

Rules:

```text
REQUIRED
→ Implement.

IMPLEMENTATION DETAIL
→ Implement if necessary.

NEW SCOPE
→ STOP.
→ Explain what you want to add.
→ Ask for permission.
→ Do not implement it.
```

Never silently convert `NEW SCOPE` into an implementation detail.

---

# 17. NO ASSUMPTIONS

If requirements are ambiguous:

Do not invent a feature.

Do not silently choose a larger architecture.

Do not install a new dependency.

Do not add a new service.

Do not modify the tech stack.

Instead, stop at the relevant point and request permission.

---

# 18. FINAL REVIEW

After implementation:

Read the relevant skills again.

Perform a code review using:

```text
.agents/skills/code-review-and-quality/
```

Perform security review using:

```text
.agents/skills/security-and-hardening/
```

Perform browser testing using:

```text
.agents/skills/browser-testing-with-devtools/
```

Fix bugs that violate this specification.

Do not expand the scope.

---

# START

Start with **Phase 1 only**.

Before writing code:

1. Inspect `.agents/skills/`.
2. Read the relevant skill files.
3. Inspect the current project structure.
4. Report what you found.
5. Identify which existing skills will be used for Phase 1.
6. Implement only Phase 1.

**Do not continue to Phase 2 until Phase 1 is complete and verified.**

**Do not add anything that is not explicitly authorized by this specification.**

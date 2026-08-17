# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Individuals looking to capture their current thoughts, feelings, or predictions and deliver them to their future selves.

## Product Purpose
A personal digital time capsule. It allows users to write letters to their future selves and schedule them for automatic delivery at a specific date and time. Success means the reliable preservation and timely delivery of these personal messages.

## Positioning
A minimalist, focused tool for temporal messaging. It strips away typical email client bloat to focus entirely on the gravity of time and personal reflection.

## Operating Context
Users write these letters in moments of reflection or milestone events. The app must reliably run in the background (via a cron-based scheduler) to ensure delivery even months or years after the letter was written, independently of the user's active session.

## Capabilities and Constraints
Confirmed functionality: 
- Create future emails with precise scheduling and timezone support.
- Dashboard tracking Scheduled, Sent, Failed, and Cancelled emails.
- Automatic backend scheduling without relying on in-memory jobs (SQLite + node-cron).
- Direct email delivery via Resend.
Technical constraints:
- No authentication or user accounts.
- Strict technology stack (React, Node, Express, SQLite).
- No additional infrastructure (Redis, Kafka, etc.) permitted.

## Brand Commitments
The application must feel like "A personal digital time capsule".
Visual direction: Minimal, clean, modern, calm, responsive, with good typography and generous whitespace. Do not turn the UI into a generic admin dashboard.

## Evidence on Hand
- Frontend (Vite/React) and backend (Node/Express) implementations are fully complete and functional.
- SQLite database schema (`ScheduledEmail`) is established and integrated.
- Design System (`DESIGN.md`) capturing the minimalist aesthetic is present.

## Product Principles
1. **Focus on the content:** The interface must recede to let the user's letter take precedence.
2. **Reliability is paramount:** A letter to the future must not be lost to a server restart or race condition.
3. **Simplicity over features:** Provide only the pure utility of sending a message forward in time without unnecessary bloat.

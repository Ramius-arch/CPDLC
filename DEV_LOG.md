# CPDLC Developer Log & Audit Trail

This log chronicles the professional code review, bug discovery, and standardization refactoring implemented to transform a generic chat script into an industry-compliant CPDLC simulator.

---

## 1. Initial Assessment & Bug Log

### Bug 1: Recipient Lookup 404 Disconnect
* **Finding:** The UI hardcoded `"ATC"` and `"PILOT"` as receiver values inside dropdown selectors, whereas the backend performed a strict Mongo query against specific username strings.
* **Impact:** Any message sent resulted in a `404 Recipient Not Found` API error.
* **Resolution:** Replaced the hardcoded select options with a dynamic fetch to `/api/messages/users`, filtering out the current session user.

### Bug 2: History Query Address Failure
* **Finding:** The `/api/messages/history` route filtered incoming messages using `{'recipient': user_id}` where `user_id` was the JWT ObjectId string, but the database stored recipients by `username` string.
* **Impact:** Inbound messages were never rendered on the receiver's UI.
* **Resolution:** Refactored the query to resolve the user's username via their ObjectId first, then retrieved chronological messages using matching usernames.

---

## 2. Refactoring & Standard Compliance

### Milestone 1: Aviation Identity schema
* Extended users table to support role-based identifiers:
  * **Pilot:** Active transponder Callsign + 24-bit Mode S Hex Address (automatically generated or custom-inputted during registration).
  * **Controller:** ICAO 4-letter Facility Location Indicator (validated against `^[A-Z]{4}$`).

### Milestone 2: ICAO Message Set Enforcer
* Overhauled the plaintext message box.
* Built contextual dropdowns for ICAO code sets (UM for controllers, DM for pilots).
* Standardized template values so selecting `UM19` automatically prefills `'CLIMB TO FL'`, and selecting `DM0 (WILCO)` displays a parent reference selector (`ref_seq_num`) to link response messages.

### Milestone 3: Real-Time Radar & Handover Simulation
* Developed an animated SVG radar grid modeling longitude and latitude flight vectors.
* Built coordinate telemetry tracks which simulate transponder readouts.
* Simulated sector boundary crossings: when crossed, it coordinates a CDA (Current Data Authority) to NDA (Next Data Authority) handover loop. If the controller sends `UM117: CONTACT`, the system successfully transitions authority to the new sector.

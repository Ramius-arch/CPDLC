# Professional CPDLC System Simulator

A standard-compliant, web-based simulation of a Controller-Pilot Data Link Communications (CPDLC) system designed as an interactive portfolio demonstration. 

This application simulates air-ground digital telecommunications under ICAO Doc 9705, Doc 10037 (GOLD), and Link 2000+ specifications, demonstrating structured message handshakes, automated sector handovers, and Mode S transponder telemetry.

---

## Key Features

1. **ICAO Structured Message Sets (UM/DM Codes)**
   * **Uplink Clearances (ATC):** Send standardized clearances like `UM19: CLIMB TO [Altitude]`, `UM20: DESCEND TO [Altitude]`, `UM74: PROCEED DIRECT TO [Position]`, and `UM117: CONTACT [Next ATC]`.
   * **Downlink Requests & Responses (Pilot):** Enforce matching responses like `DM0: WILCO` (Will Comply), `DM1: UNABLE`, and `DM2: STANDBY` referencing their parent clearance sequence numbers.

2. **Sequence Number Tracking & Rollover (0–63)**
   * Maintains message sequence counters local to each aircraft-ground facility link, supporting sequence-specific references and rollover limits matching real-world 3GPP/ARINC protocols.

3. **Current/Next Data Authority Handovers (CDA/NDA)**
   * Simulates sector boundaries. When the aircraft crosses a boundary on the live SVG radar monitor, it triggers a handover warning. Completing the handover shifts the Current Data Authority (CDA).

4. **Dynamic Active User Discovery**
   * Exposes a dynamic list of online facilities and active flights, completely eliminating hardcoded recipient bugs and allowing real-time cross-client message routing.

---

## Architectural Breakdown

```
CPDLC/
├── src/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── models/        # Python data validation models (User, Message)
│   │   │   ├── routes/        # Auth and standard ICAO message endpoints
│   │   │   └── __init__.py    # Flask & MongoDB startup configuration
│   │   ├── run.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Airspace_Display/  # Animated SVG Radar Screen
│       │   │   ├── Message_History/   # Chronological message threads
│       │   │   └── Message_Input_Form/# Standard ICAO template composer
│       │   ├── services/      # REST API handlers
│       │   └── index.js       # App orchestrator
│       └── index.html
└── README.md
```

---

## Getting Started

### Prerequisites
* Python 3.x
* Node.js & npm
* MongoDB (running locally on port `27017`)

### Installation & Run

1. **Start the Database:**
   Ensure your local MongoDB daemon is running (`mongod`).

2. **Backend Setup:**
   ```bash
   cd src/backend
   pip install -r requirements.txt
   # Create .env with MONGODB_URI=mongodb://localhost:27017/cpdlc
   python run.py
   ```

3. **Frontend Setup:**
   ```bash
   cd src/frontend
   npm install
   npm start
   ```

4. **Running Unit Tests:**
   ```bash
   cd src/backend
   python -m pytest ../../tests/test_cpdlc_backend.py
   ```

---

## Verification & Compliance
* **Unit Tested:** Pytest suite covers Mode S Hex format checks, ICAO 4-letter facility designators, and validation limits.
* **Standards Mapped:** Evaluated against ARINC 622, Link 2000+, and ICAO Doc 9705.

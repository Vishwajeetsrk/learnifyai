# 🖥️ Original Exported macOS Portfolio

<div align="center">

![Original Portfolio Live Animated Screen Recording](assets/demo-recording.svg)

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react&logoColor=black)](#)
[![Alloy](https://img.shields.io/badge/Alloy-Architecture-8b5cf6?style=for-the-badge)](#)
[![Status: Tests Passed](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen?style=for-the-badge)](#)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white)](#)

<p align="center">
  <strong>The complete, production-bundled macOS web portfolio edition.</strong>
  <br />
  Features clean, human-readable file organization with redundant duplicate folders eliminated.
</p>

</div>

---

## 🧪 Automated Testing Report

- **Execution Script**: [`test_suite.ps1`](file:///c:/Users/Vishwajeet/Downloads/Macos_Portfolio--main/test_suite.ps1)
- **Target Host**: `http://localhost:3001/`
- **Result**: `3 / 3 Tests Passed (100%)`

| Check | Target File | Status | Size / Details |
| :--- | :--- | :---: | :--- |
| **Index Route** | `GET /` | ✅ PASS | `200 OK` (Loads DOM `#root` container) |
| **Main JS Bundle** | `GET /script.js` | ✅ PASS | `200 OK (12.7 MB)` |
| **Main CSS Bundle** | `GET /style.css` | ✅ PASS | `200 OK (151.5 KB)` |

---

## 📂 Managed File Structure

```
Original-Exported-Portfolio/
├── index.html                # Clean root entrypoint with standardized links
├── landscape.html            # Mobile landscape orientation advisory
├── script.js                 # Production bundle (renamed from index-CQYfIT_X.js)
├── style.css                 # Core stylesheet (renamed from index-B2SGymsH.css)
├── docker-compose.alloy.yaml # Alloy Docker configuration
├── package.json              # Package metadata and build scripts
├── README.md                 # Documentation, test report & demo preview
└── assets/
    ├── demo-recording.svg    # 60fps dynamic animated screen recording
    └── demo-preview.svg      # Vector architecture preview banner
```

---

## 🚀 How to Run

### Method 1: Local HTTP Server (Python)
```bash
cd Original-Exported-Portfolio
python -m http.server 3001
```
Open: **`http://localhost:3001`**

### Method 2: Docker Alloy Deployment
```bash
docker compose -f docker-compose.alloy.yaml up -d
```

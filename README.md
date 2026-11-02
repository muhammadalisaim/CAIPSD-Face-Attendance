# CAIPSD Face Attendance System

A modern, fast, and secure AI-powered Face Attendance web application designed for **CAIPSD** (Centre of AI & Professional Skills Development), The Islamia University of Bahawalpur.

This application runs client-side face detection, recognition, and liveness verification directly in the browser with offline PWA support and automated cloud synchronization.

---

## 🚀 Key Features

- **⚡ Real-Time Face Detection & Recognition:** High-performance facial landmark and feature recognition using `@vladmandic/face-api` and Google MediaPipe.
- **👁️ Anti-Spoofing & Liveness Verification:** Interactive blink detection to ensure human presence before marking attendance.
- **🔒 Passcode-Protected Student Enrollment:** Secure onboarding and deletion of student profiles guarded by PBKDF2 (SHA-256) encryption.
- **📊 Attendance Dashboard & Statistics:** 
  - Daily check-in tracking
  - Weekly attendance percentage, streaks, and progress rings
  - One-click CSV export
- **📱 Progressive Web App (PWA):** Installable on desktop and mobile devices with Service Worker offline caching.
- **🛠️ Dedicated Admin Portal (`admin.html`):** Keypad-protected administration dashboard integrated with Google Sheets / Google Apps Script for cloud records.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, Modern CSS3 (Glassmorphism UI, Responsive Design), Modern JavaScript (ES6+)
- **AI / Computer Vision:**
  - `@vladmandic/face-api` (Tiny Face Detector, 68 Landmarks, Face Recognition Embeddings)
  - Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
  - TensorFlow.js WASM Backend (`@tensorflow/tfjs-backend-wasm`)
- **Storage & Sync:**
  - Browser `localStorage` / `IndexedDB` for local profiles and offline logs
  - Google Apps Script & Google Sheets backend API for centralized cloud sync
- **Security:** Web Crypto API (PBKDF2 with 150,000 iterations for passcode hashing)

---

## 📁 Project Structure

```text
CAIPSD-Face-Attendance/
├── index.html              # Main attendance and student check-in interface
├── app.js                  # Core application logic, AI models, and camera handling
├── admin.html              # Administrative portal with PIN keypad
├── admin.js                # Admin dashboard management and cloud synchronization
├── sw.js                   # Service Worker for offline asset caching and PWA
├── manifest.webmanifest    # Web app manifest for PWA installation
├── assets/                 # Logos, background images, and UI icons
│   ├── admin-logo.png
│   ├── report-logo.jpg
│   └── office-bg/
├── icon-192.png            # 192x192 PWA app icon
├── icon-512.png            # 512x512 PWA app icon
└── README.md               # Project documentation
```

---

## 💻 Getting Started (Run Locally)

Because the project accesses the camera (`navigator.mediaDevices.getUserMedia`) and registers a Service Worker, modern browsers require it to be served over `http://localhost` (or HTTPS).

### Option 1: Using Python (Recommended)

1. Open your terminal in the project directory:
   ```bash
   cd /home/manager/Documents/CAIPSD-Face-Attendance--main
   ```
2. Start the local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and navigate to:
   - **Main Attendance App:** [http://localhost:8000/](http://localhost:8000/)
   - **Admin Portal:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

### Option 2: Using Node.js

```bash
npx serve .
# or
npx http-server -p 8000
```

---

## 🔑 Passcode & Enrollment

- To enroll a new student profile or manage roster records, click the **"Enroll student"** tab on the main screen.
- A passcode modal will appear to prevent unauthorized profile modifications.
- Default enrollment passcode: **`2375`**
- Authorized users can also change the enrollment passcode through the in-app settings.

---

## ⚙️ Cloud Configuration & Google Sheets

The application syncs attendance and roster data with Google Sheets:
- **Connected Google Spreadsheet:** [View Spreadsheet](https://docs.google.com/spreadsheets/d/1o9Efz9w0-nt6JZABujOIgtmLQgWHxkj4reOVkGpWtqs/edit?usp=sharing)
- **Spreadsheet ID:** `1o9Efz9w0-nt6JZABujOIgtmLQgWHxkj4reOVkGpWtqs`
- **Backend Script:** `google-apps-script.js` (included in this repository)

### How to Deploy the Google Apps Script Backend:
1. Open the Google Spreadsheet in your browser.
2. Click **Extensions > Apps Script** in the top menu.
3. Paste the contents of `google-apps-script.js` into the code editor and save.
4. Click **Deploy > New deployment**.
5. Select **Web app** as the deployment type:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
6. Click **Deploy** and copy your **Web app URL** (`https://script.google.com/macros/s/.../exec`).
7. Paste this URL into `index.html` (`sheetUrl`) and `admin.html` (`apiUrl`).

---

## 🏫 Institution

**Centre of AI & Professional Skills Development (CAIPSD)**  
The Islamia University of Bahawalpur  
Official Portal: [CAIPSD Portal](https://ayanarsam.github.io/CAIPSD-PORTAL/)

---

## 📄 License

This project is developed for educational and organizational use at CAIPSD.

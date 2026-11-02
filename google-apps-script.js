/**
 * CAIPSD Face Attendance - Google Sheets Sync Backend
 * Linked to Google Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1o9Efz9w0-nt6JZABujOIgtmLQgWHxkj4reOVkGpWtqs/edit
 */

const SPREADSHEET_ID = "1o9Efz9w0-nt6JZABujOIgtmLQgWHxkj4reOVkGpWtqs";
const DEFAULT_ADMIN_PASSCODE = "2375";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
}

function getAttendanceSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Attendance");
  if (!sheet) {
    sheet = ss.insertSheet("Attendance");
    sheet.appendRow([
      "Timestamp",
      "Date",
      "Time",
      "Student Name",
      "Section / Dept",
      "Status",
      "Sync Time"
    ]);
    sheet.getRange(1, 1, 1, 7)
      .setFontWeight("bold")
      .setBackground("#0B1F4B")
      .setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// RUN THIS FUNCTION ONCE IN APPS SCRIPT EDITOR TO GRANT PERMISSIONS
function testSetup() {
  const sheet = getAttendanceSheet();
  Logger.log("Successfully connected to sheet: " + sheet.getName());
}

function doGet(e) {
  return ContentService.createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "No data received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);

    // 1. Admin Actions (login, data, logout, changePasscode)
    if (data.action) {
      return handleAdminAction(data);
    }

    // 2. Attendance Check-in Record from app.js
    if (data.name) {
      const sheet = getAttendanceSheet();
      const ts = data.ts || new Date().getTime();
      const date = data.date || Utilities.formatDate(new Date(), "GMT+5", "yyyy-MM-dd");
      const time = data.time || Utilities.formatDate(new Date(), "GMT+5", "hh:mm:ss a");
      const name = data.name || "";
      const section = data.section || "";
      const status = data.status || "Present";
      const syncTime = Utilities.formatDate(new Date(), "GMT+5", "yyyy-MM-dd hh:mm:ss a");

      sheet.appendRow([ts, date, time, name, section, status, syncTime]);

      return ContentService.createTextOutput(JSON.stringify({
        result: "ok",
        success: true
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleAdminAction(data) {
  const props = PropertiesService.getScriptProperties();
  let adminPass = props.getProperty("ADMIN_PASSCODE") || DEFAULT_ADMIN_PASSCODE;

  // Login
  if (data.action === "login") {
    if (data.passcode === adminPass) {
      const session = Utilities.getUuid();
      props.setProperty("SESSION_" + session, new Date().getTime().toString());
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        session: session
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: "Invalid admin passcode"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Logout
  if (data.action === "logout") {
    if (data.session) {
      props.deleteProperty("SESSION_" + data.session);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Fetch Attendance Records
  if (data.action === "data") {
    const sheet = getAttendanceSheet();
    const rows = sheet.getDataRange().getValues();
    const records = [];
    for (let i = 1; i < rows.length; i++) {
      records.push({
        ts: rows[i][0],
        date: String(rows[i][1]),
        time: String(rows[i][2]),
        name: String(rows[i][3]),
        section: String(rows[i][4]),
        status: String(rows[i][5]),
        receivedAt: rows[i][0]
      });
    }
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      records: records,
      roster: []
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Change Admin Passcode
  if (data.action === "changePasscode") {
    if (data.current === adminPass) {
      props.setProperty("ADMIN_PASSCODE", data.next);
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: "Current passcode is incorrect"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

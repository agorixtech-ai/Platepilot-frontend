/**
 * PlatePilot — Demo form → Google Sheet
 *
 * WHERE ROWS APPEAR: Google Spreadsheet tabs (bottom), especially "Demo"
 * NOT in the Apps Script code editor.
 *
 * If testWrite fails: Apps Script → left sidebar → Executions → open the red run
 */

var SPREADSHEET_ID = "1viel__HqJ3BbzPidcmAQgBditSKrwR5Ntz7npLqYMCk";
var SHEET_NAME = "Demo";
var HEADERS = [
  "First Name",
  "Last Name",
  "Email",
  "Restaurant",
  "Phone",
  "POS System",
  "Message",
  "Submitted At",
];

function doGet(e) {
  // Allow ?email=...&firstName=... query writes (useful for quick browser tests)
  try {
    if (e && e.parameter && (e.parameter.email || e.parameter.firstName)) {
      appendDemoRow_(e.parameter);
      return json_({ success: true, via: "doGet" });
    }
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
  return json_({ success: true, message: "Demo form endpoint is live" });
}

function doPost(e) {
  try {
    appendDemoRow_(readPayload_(e));
    return json_({ success: true, via: "doPost" });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function appendDemoRow_(data) {
  var sheet = getOrCreateDemoSheet_();
  sheet.appendRow([
    data.firstName || "",
    data.lastName || "",
    data.email || "",
    data.restaurant || "",
    data.phone || "",
    data.posSystem || "",
    data.message || "",
    data.submittedAt || new Date().toISOString(),
  ]);
  SpreadsheetApp.flush();
}

function readPayload_(e) {
  if (!e) {
    throw new Error("Empty request");
  }
  if (e.parameter && (e.parameter.email || e.parameter.firstName)) {
    return e.parameter;
  }
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  throw new Error("No POST data received");
}

function getSpreadsheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (!ss) {
    throw new Error("Could not open spreadsheet ID: " + SPREADSHEET_ID);
  }
  return ss;
}

function getOrCreateDemoSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Run this first. Writes to tab "Demo" AND to the first tab so you can't miss it.
 * After Run: open the spreadsheet URL, look at bottom tabs.
 * Also check: View → Logs (or Executions) for the message.
 */
function testWrite() {
  try {
    var ss = getSpreadsheet_();
    var sheetName = ss.getName();
    var url = ss.getUrl();

    // 1) Write on first tab (whatever it's called — Sheet1 / DemoRequests / etc.)
    var first = ss.getSheets()[0];
    first.appendRow([
      "TEST WRITE OK",
      new Date().toISOString(),
      "If you see this, Apps Script can write to this file",
    ]);

    // 2) Write on Demo tab
    var demo = getOrCreateDemoSheet_();
    demo.appendRow([
      "Test",
      "User",
      "test@example.com",
      "Demo Cafe",
      "123",
      "Tally",
      "hello from testWrite",
      new Date().toISOString(),
    ]);

    SpreadsheetApp.flush();

    var msg =
      "SUCCESS\n\n" +
      "Spreadsheet: " +
      sheetName +
      "\n" +
      "First tab: " +
      first.getName() +
      " (row added)\n" +
      "Demo tab: " +
      demo.getName() +
      " (row added)\n\n" +
      "Open:\n" +
      url;

    Logger.log(msg);

    try {
      SpreadsheetApp.getUi().alert(msg);
    } catch (uiErr) {
      // Standalone editor has no Sheet UI — that's fine; check Logger / Executions
    }
  } catch (err) {
    Logger.log("FAILED: " + err);
    try {
      SpreadsheetApp.getUi().alert("FAILED: " + err);
    } catch (uiErr) {
      // ignore
    }
    throw err;
  }
}

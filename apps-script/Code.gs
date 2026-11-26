/**
 * pimavn.com contact form backend.
 *
 * A Google Apps Script web app bound to the "pimavn.com – Liên hệ" Sheet.
 * Deploy: Execute as "Me", Who has access "Anyone". After any change, publish a
 * new version of the SAME deployment (Deploy > Manage deployments > Edit >
 * Version: New version) so the web app URL in src/data/site.ts stays valid.
 *
 * The site's ContactForm POSTs a form-urlencoded body (a CORS simple request):
 *   page, name, email, phone, organization, message, website (honeypot).
 * The answer is JSON: { "ok": true } or { "ok": false }.
 */

var HEADER = ["Thời điểm", "Trang", "Họ và tên", "Email", "Số điện thoại", "Đơn vị/Tổ chức", "Nội dung"];

// Same caps as the form's maxlength attributes.
var MAX_LENGTH = { page: 256, name: 256, email: 256, phone: 256, organization: 256, message: 5000 };

var HONEYPOT = "website";

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  var params = (e && e.parameter) || {};

  // Bots that fill the hidden field get the same answer as people, but nothing is stored.
  if (clean(params[HONEYPOT], 256) !== "") return json({ ok: true });

  var row = {
    page: clean(params.page, MAX_LENGTH.page),
    name: clean(params.name, MAX_LENGTH.name),
    email: clean(params.email, MAX_LENGTH.email),
    phone: clean(params.phone, MAX_LENGTH.phone),
    organization: clean(params.organization, MAX_LENGTH.organization),
    message: clean(params.message, MAX_LENGTH.message),
  };

  if (row.name === "" || row.message === "" || !EMAIL_PATTERN.test(row.email)) {
    return json({ ok: false });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);
    sheet.appendRow([
      new Date(),
      asText(row.page),
      asText(row.name),
      asText(row.email),
      asText(row.phone),
      asText(row.organization),
      asText(row.message),
    ]);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

/** Trimmed string, capped at `max` characters; "" for a missing value. */
function clean(value, max) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, max);
}

/**
 * Guards against formula injection: a cell value starting with = + - @ (or a
 * tab / carriage return) gets a leading apostrophe, so the Sheet stores it as
 * text. The apostrophe is not shown in the cell.
 */
function asText(value) {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

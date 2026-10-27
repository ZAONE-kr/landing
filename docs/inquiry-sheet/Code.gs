/**
 * ZAONE 홈페이지 기록 시트.
 * 홈페이지 문의 폼(zaone.org/contact)에 문의가 접수되거나 홈 아래 뉴스레터 구독 칸에 이메일이 들어올 때마다
 * 이 시트에 한 줄씩 더한다.
 * 붙이는 법은 같은 폴더의 README.md에 있다. 이 파일을 고치면 웹 앱을 "새 버전"으로 다시 배포해야 반영된다.
 *
 * - 네 종류의 문의가 "문의" 탭 하나에 시간순으로 쌓이고, "문의 종류" 열로 나뉜다.
 *   뉴스레터 구독 이메일은 "뉴스레터 구독" 탭에 쌓인다. 탭이 없으면 처음 접수될 때 만든다.
 *   탭 이름과 열 이름·순서는 홈페이지 서버가 보낸다(src/app/api/inquiry/sheet.ts, src/app/api/newsletter/route.ts).
 * - 뉴스레터는 같은 이메일이 이미 탭에 있으면 줄을 더하지 않는다(대소문자는 가리지 않는다).
 * - 개발·미리보기 사이트에서 보낸 시험 접수는 "[테스트] 문의"·"[테스트] 뉴스레터 구독" 탭에 따로 쌓인다.
 *   필요 없으면 탭째 지워도 된다.
 * - 첫 줄(머리줄)의 이름으로 칸을 찾아 넣는다. 열을 더하거나(처리 상태, 담당자 메모 등) 순서를 바꿔도 된다.
 *   머리줄 이름을 바꾸면 그 칸은 새 열로 다시 생긴다.
 */

// 개발·미리보기 사이트에서 보낸 시험 문의의 탭 이름 앞에 붙는다.
var TEST_PREFIX = "[테스트] ";

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || body.secret !== secret) {
      return reply({ ok: false, error: "unauthorized" });
    }
    // 동시에 두 접수가 오면 같은 줄에 겹쳐 쓰지 않도록 차례로 넣는다.
    lock.waitLock(10000);
    var appended = appendRow(body);
    return reply({ ok: true, duplicate: !appended });
  } catch (error) {
    return reply({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// 한 줄 더한다. unique 열에 같은 값이 이미 있어 더하지 않았으면 false다.
function appendRow(body) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var name = (body.test ? TEST_PREFIX : "") + body.sheet;
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);

  var lastColumn = sheet.getLastColumn();
  var headers =
    lastColumn > 0
      ? sheet
          .getRange(1, 1, 1, lastColumn)
          .getValues()[0]
          .map(function (value) {
            return String(value);
          })
      : [];
  var added = false;
  body.columns.forEach(function (column) {
    if (headers.indexOf(column.label) === -1) {
      headers.push(column.label);
      added = true;
    }
  });
  if (added) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  var unique = body.unique ? valueOf(body, body.unique) : "";
  if (unique && hasValue(sheet, headers.indexOf(body.unique) + 1, unique)) return false;

  var row = headers.map(function (header) {
    return asText(valueOf(body, header));
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
  return true;
}

// 서버가 보낸 칸 중 이 머리줄 이름의 값. 없으면 빈 글자다.
function valueOf(body, label) {
  for (var i = 0; i < body.columns.length; i++) {
    if (body.columns[i].label === label) return String(body.columns[i].value);
  }
  return "";
}

// 머리줄 아래에서 이 열(1부터)에 칸 전체가 value와 같은(대소문자 무시) 칸이 있는지.
function hasValue(sheet, column, value) {
  var lastRow = sheet.getLastRow();
  if (column < 1 || lastRow < 2) return false;
  return (
    sheet
      .getRange(2, column, lastRow - 1, 1)
      .createTextFinder(value)
      .matchCase(false)
      .matchEntireCell(true)
      .findNext() !== null
  );
}

/*
 * 글자 그대로 넣는다. 앞에 작은따옴표(')를 붙이면 시트가 글자로 받고 따옴표는 보이지 않는다.
 * 그러지 않으면 01012345678이 숫자(1012345678)로, "="로 시작하는 글이 수식으로 바뀐다.
 */
function asText(value) {
  var text = String(value);
  return text === "" ? "" : "'" + text;
}

function reply(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * ZAONE 문의 기록 시트.
 * 홈페이지 문의 폼(zaone.org/contact)에 문의가 접수될 때마다 이 시트에 한 줄씩 더한다.
 * 붙이는 법은 같은 폴더의 README.md에 있다. 이 파일을 고치면 웹 앱을 "새 버전"으로 다시 배포해야 반영된다.
 *
 * - 네 종류의 문의가 "문의" 탭 하나에 시간순으로 쌓이고, "문의 종류" 열로 나뉜다. 탭이 없으면 처음 접수될 때 만든다.
 *   탭 이름과 열 이름·순서는 홈페이지 서버가 보낸다(src/app/api/inquiry/sheet.ts).
 * - 개발·미리보기 사이트에서 보낸 시험 문의는 "[테스트] 문의" 탭에 따로 쌓인다. 필요 없으면 탭째 지워도 된다.
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
    // 동시에 두 문의가 오면 같은 줄에 겹쳐 쓰지 않도록 차례로 넣는다.
    lock.waitLock(10000);
    appendInquiry(body);
    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function appendInquiry(body) {
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

  var row = headers.map(function (header) {
    for (var i = 0; i < body.columns.length; i++) {
      if (body.columns[i].label === header) return asText(body.columns[i].value);
    }
    return "";
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
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

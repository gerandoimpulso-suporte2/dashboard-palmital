// ═══════════════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — Proxy para o Dashboard Palmital
// ═══════════════════════════════════════════════════════════
// COMO USAR:
//   1. Acesse script.google.com
//   2. Crie um novo projeto
//   3. Cole este código
//   4. Clique em "Implantar" → "Nova implantação"
//   5. Tipo: Aplicativo da Web
//   6. Executar como: Eu mesmo
//   7. Quem tem acesso: Qualquer pessoa
//   8. Copie a URL gerada e cole no dashboard.html (variável GAS_URL)
// ═══════════════════════════════════════════════════════════

var SHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA';
// O ID está na URL da planilha:
// docs.google.com/spreadsheets/d/ESTE_É_O_ID/edit

var GID = '1142053990'; // ID da aba "Campanhas 2026"

function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheets = ss.getSheets();
    var sheet = null;
    for (var i = 0; i < sheets.length; i++) {
      if (String(sheets[i].getSheetId()) === String(GID)) {
        sheet = sheets[i]; break;
      }
    }
    if (!sheet) sheet = ss.getActiveSheet();

    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return respond({ok: false, error: 'Planilha vazia'});
    }

    var headers = data[0].map(function(h){ return String(h).trim(); });
    var rows = [];
    for (var r = 1; r < data.length; r++) {
      var obj = {}, hasVal = false;
      for (var c = 0; c < headers.length; c++) {
        var v = data[r][c];
        if (v instanceof Date) {
          v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy');
        } else {
          v = String(v === null || v === undefined ? '' : v).trim();
        }
        obj[headers[c]] = v;
        if (v) hasVal = true;
      }
      if (hasVal) rows.push(obj);
    }
    return respond({ok: true, rows: rows, total: rows.length,
                    updated: new Date().toISOString()});
  } catch(err) {
    return respond({ok: false, error: err.message});
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

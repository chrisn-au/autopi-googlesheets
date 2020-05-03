const RPM = "rpm"
const BBM = "bbm"
const ALL = "allpids"

let pidList = [RPM,BBM]

function onOpen(){
  SpreadsheetApp.getUi()
  .createMenu("Refresh Data from AutoPi")
  .addItem("Refresh RPM data", "retrieveRPM")
  .addItem("Refresh BBM data", "retrieveBBM")
  .addItem("Refresh ALL data", "retrieveALL")
  .addToUi();
}

function retrieveRPM(){
     retrieveAutoPi(RPM);
}  

function retrieveBBM(){
     retrieveAutoPi(BBM);
}

function retrieveALL(){
     retrieveAutoPi(ALL)
}

function retrieveAutoPi(pid) {
    let authData = retrieveToken();
    if (authData){
      if (pid != ALL) {pidList = []; pidList.push(pid)};
      for (i =0; i< pidList.length; i++)
      {  
          let current = pidList[i];
          let data = retrieveData(authData.token,authData.user.devices[0].id,"obd."+current+".value")
          insertData(data,current);
       }  
    }
}

function retrieveToken()
{
    let data = {"email":"redacted_email","password":"redacted_password"}
    let url = "https://api.autopi.io/auth/login/"
    let options = {
    "method": "post",
    "payload": data
    };
    let response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() == 200){
        return JSON.parse(response.getContentText());
    } else
    {
        return null;
    }
}

function retrieveData(token, device_id, field){
    var now = new Date().toISOString();
    var yesterday = new Date()
//yesterday.setHours(yesterday.getHours()-5)
    yesterday.setDate(yesterday.getDate()-1)
    yesterday = yesterday.toISOString()

    var options = {
        "method": "get",
        "headers": {
            "Authorization": "bearer " + token
        },
    };
    var url = "https://api.autopi.io/logbook/storage/read/"+
    "?from_utc="+yesterday+
    "&device_id="+device_id+
    "&field_type=primitive"+
    "&interval=5m"+
    "&field="+field+
    "&page_num=0"
    var response = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(response.getContentText())
return(data)
}

function insertData(data, sheetName){
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) { 
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName)
    }  
    sheet.getLast
    sheet.clear();
    var sheetRows = []
    for(j = 0; j < data.length; j++){
        row = []
        row[0] = data[j].ts;
        row[1] = data[j].value
        sheetRows.push(row)
    }
    if (data.length != 0){
        range = sheet.getRange(1, 1, sheetRows.length, sheetRows[0].length).setValues(sheetRows);
    } 
    range.activate();
    range.sort({column: 1, ascending: false});
}

function retrieveAutoPI() {
let authData = retrieveToken();
if (authData){
let bbmData = retrieveData(authData.token,authData.user.devices[0].id,"obd.rpm.value")
insertData(bbmData);
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

function insertData(data){
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("test");
sheet.getLast
sheet.clear();
var sheetRows = []

for(i = 0; i < data.length; i++){
row = []
row[0] = data[i].ts;
row[1] = data[i].value
sheetRows.push(row)
}
range = sheet.getRange(1, 1, sheetRows.length, sheetRows[0].length).setValues(sheetRows);
range.activate();
range.sort({column: 1, ascending: false});
}

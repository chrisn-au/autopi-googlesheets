# autopi-googlesheets
Extract Autopi data into google sheets

## Setup

In tools/script editor paste the code from autopi.js (you will need to change email and password)

### Change/add/remove PIDs

Chang/add/remove defintions const RPM = "rpm". If you dont not need the RPM PID remove this line. If oyu want to change the name chasnge both the RPM and lower case (which should reflect the pid)

You can duplicate this line as often as you need.

To add the new/changed/deleted items in the array to be processed on process ALL add/change/remove from the array

let pidList = [RPM,BBM]


###  Change/add/remove menu items

If you would like to change/add/remove menu items adjist the code in the follwing block

``SpreadsheetApp.getUi()
  .createMenu("Refresh Data from AutoPi")
  .addItem("Refresh RPM data", "retrieveRPM")
  .addItem("Refresh BBM data", "retrieveBBM")
  .addItem("Refresh ALL data", "retrieveALL")
  .addToUi();``
  
 Add / remove functions like retrieveRPM 
 
 ### Save your changes
 Save changesc in tghe google sheet
 
 ## Display menu item

Reload the page the spreadsheet is one (close it/reopen , reload the page)

You should see the Refresh Data from AutoPi menu item

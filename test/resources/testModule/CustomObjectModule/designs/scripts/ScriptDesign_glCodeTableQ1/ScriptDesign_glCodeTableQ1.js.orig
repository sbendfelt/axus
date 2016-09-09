/**
 *   C H A N G E    L  O G
 * 
 *  (B)ug/(E)nh/(I)DB #    Date      Who  Description
 *  -------------------  ----------  ---  ---------------------------------------------------------------
 *   ENH-8013				 11/11/2013  SjB  New, validations for required fields
 */

var REQUIRED = true;
var NOT_REQUIRED = false;
var IS_KEY = true;
var IS_VALUE = false;

/**
 * Validates the object
 */
function validateObject(customObject, eventName, params) {
   
   var hasErrors = false;
   var entries = customObject.glCodeEntries;
   var result = "noErrors";
   var i = 0;
   
   if (entries != undefined && entries != null) {
      for (i = 0; i < entries.length; i++) {
         var entry = entries[i];
         var entryRowIndex = i + 1;
         if (entry != undefined && entry != null) {
            
            if (isEmptyOrNull(entry.PurchaseGroup) == true) {
               Providers.getMessageProvider().error(customObject, "Table Entry Row ["+entryRowIndex+"]: Purchase Group is required.");
               hasErrors = true;
            }
            
            if (isEmptyOrNull(entry.ProfitCenter) == true) {
               Providers.getMessageProvider().error(customObject, "Table Entry Row ["+entryRowIndex+"]: Profit Center is required.");
               hasErrors = true;
            }
         }
      } //end loop through entries
   }
   
   //get global object type
   var globalObjectType = customObject.type;
   if (globalObjectType != undefined && globalObjectType != null) {
   
      if (hasActiveTable(customObject, globalObjectType)) {
         Providers.getMessageProvider().error(customObject, "There is already an Active table. Please deactivate it before proceeding or use a different Custom Object ID.");
         hasErrors = true;
      }
   }
   
   if(hasErrors == true) {
      result = "errors";
   } 
   return result;
}

/**
 * Runs on save
 */
function validateOnSave(customObject, eventName, params) {
   //Run Validations
   if ("Active" == customObject.Status && "errors" == validateObject(customObject, eventName, params)) {
      customObject.Status = "FailedValidate";
      Providers.getPersistenceProvider().save(customObject);
   }
}


/**************** UTILITY FUNCTIONS ****************/

function isEmptyOrNull(initValue) {
   return (initValue == undefined || initValue == null || initValue == "");
}

/**
 * Checks if there's an existing Active Custom Table
 */
function hasActiveTable(customObject, tableName) {
   var tableStatus = customObject.Status;
   var uniqueId = customObject.uniqueId;
   var result = false;
   
   if ( (tableStatus != undefined && tableStatus != null) && (tableName != undefined && tableName != null) ) {
      //Look for other Active tables
      var query = Providers.getQueryProvider().createQuery(tableName);
      query.setOQL("Status = 'Active' AND uniqueId != '" + uniqueId + "'");
      var otherActiveTable = Providers.getQueryProvider().execute(query);
      
      if (otherActiveTable != undefined && otherActiveTable.length != undefined && otherActiveTable.length > 0) {
         result = true;
      }
   }
   
   return result;
}



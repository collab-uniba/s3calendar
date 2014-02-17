var self = require("sdk/self");
var data = require("sdk/self").data;
var pageMod1 = require("sdk/page-mod");
var pref = require('sdk/simple-prefs');



pageMod1.PageMod({
  include: "*.ict.uniba.it",
  contentScriptFile: data.url("calendar.js"),
  contentScriptOptions: {
    img: data.url("calendar.png"),
	calendar: pref.prefs['calendarName']
  }
});
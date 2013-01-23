var OWF;
var Ozone;
if (!OWF) { OWF = {};}
if (!Ozone) {Ozone={};}

;(function () {
	// Set up to catch all OWF.ready() registrations, since the scripts will likely load last
	var readyCallbacks=[];
	OWF.ready=function(fn) {
		readyCallbacks.push(fn);
	};
		
	// Parse out OWF context path. 
	var apiPath = '/js-min/owf-widget-debug.js';      //LOAD WIDGITMIN FOR SERVER
	if(!window.name) {
		// No window name, probably not in OWF.  
		// Fake the isInContainer, isRunningInOWF() type calls, then exit
		Ozone.util={
				isRunningInOWF: function() { return false;},
				isInContainer: function() { return false;}
		};
		OWF.Util=Ozone.util;
		return;
	}
	
	var owfWindowName = JSON.parse(window.name); 
	var owfPreferences = owfWindowName.preferenceLocation; 
	var owfServer = owfPreferences.substring(0, owfPreferences.indexOf('/owf') + 4); 
	
	// find the blank.html link, if it exists
	// <link rel="owf.blank.html" hrev="js/dojo-1.5.0-windowname-only/dojo/resources/blank.html"/>
	var headNode=document.getElementsByTagName('head')[0];
	var links=headNode.getElementsByTagName('link');
	var blankHtml=null;
	// find blank.html link
	for(var i=0; i < links.length && blankHtml === null; ++i) {
		var rel=links[i].getAttribute('rel');
		if(rel && rel.match("owf.blank.html")) {
			blankHtml=rel.getAttribute('href');
			break;
		}
	}	
		
	// Attach OWF API to head. 
	var api = document.createElement('script'); 
	api.setAttribute('type', 'text/javascript'); 
	api.setAttribute('src', owfServer + apiPath);
	var onReady=function() {
		if(blankHtml !=null) {
			owfdojo.config.dojoBlankHtmlUrl=blankHtml;
		}
		OWF.ready(function() {
			for(var i=0; i< readyCallbacks.length; ++i) {
				readyCallbacks[i]();
			}
			// clear the list in case of double firing
			readyCallbacks=[];
		});
	};

	// IE doesn't play nice with the load event, ready state change catches it
	api.onreadystatechange=function() {
		if(this.readyState === 'complete') {
			onReady();
		};
	};
	// Real browsers call this
	api.onload=onReady;
	
	headNode.appendChild(api);
	
	// Add the css file
	// <link type="text/css" rel="stylesheet" href="dragAndDrop.css">
	var link=document.createElement('link');
	link.setAttribute('type','text/css');
	link.setAttribute('rel','stylesheet');
	link.setAttribute('href',owfServer + "/css/dragAndDrop.css");
	headNode.appendChild(link);
	
	
})();

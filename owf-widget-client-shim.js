// stub out the global OWF and Ozone namespaces, since we'll be monkey patching some functionality
// until the real ones get loaded
var OWF;
var Ozone;
if (!OWF) { OWF = {};}
if (!Ozone) {Ozone={};}

;(function () {
	var headNode=document.getElementsByTagName('head')[0];

	var parseOwfLinkElements=function(prefix) {
		if(!prefix) prefix="";
		var links=headNode.getElementsByTagName('link');
		for(var i=0; i < links.length; ++i) {
			var rel=links[i].getAttribute('rel');
			if(rel) {
				if(rel.match(prefix+"owf.blank.html")) {
					owfdojo.config.dojoBlankHtmlUrl=links[i].getAttribute('href');
				} else if (rel.match(prefix+"owf.onLoad.stylesheet")) {
					var link=document.createElement('link');
					link.setAttribute('type','text/css');
					link.setAttribute('rel','stylesheet');
					link.setAttribute('href',links[i].getAttribute('href'));
					headNode.appendChild(link);
				} else if (rel.match(prefix+"owf.onLoad.javascript")) {
					var script = document.createElement('script'); 
					script.setAttribute('type', 'text/javascript'); 
					script.setAttribute('src', links[i].getAttribute('href'));
					headNode.appendChild(script);
				}
			}
		}
	};
	var notInOWF=function() {
		// Fake the isInContainer, isRunningInOWF() type calls, then exit
		Ozone.util={
				isRunningInOWF: function() { return false;},
				isInContainer: function() { return false;}
		};
		OWF.Util=Ozone.util;
		parseOwfLinkElements("not.");
		return;
	};
	
	// Set up to catch all OWF.ready() registrations, since the scripts will likely load last
	var readyCallbacks=[];
	OWF.ready=function(fn) {
		readyCallbacks.push(fn);
	};

	// prevent multiple calls
	var onOwfScriptReadyCalled=false;
	
	var onOwfScriptReady=function() {
		if(!onOwfScriptReadyCalled) {
			onOwfScriptReadyCalled=true;
			parseOwfLinkElements();
			OWF.ready(function() {
				for(var i=0; i< readyCallbacks.length; ++i) {
					readyCallbacks[i]();
				}
				readyCallbacks=[];
			});
		}
	};
	
	// Parse out OWF context path. 
	if(!window.name) { notInOWF(); }
	var owfWindowName=null;
	try {
		owfWindowName = JSON.parse(window.name);
	} catch(e) {
		// failed to parse, probably not OWF
		notInOWF();
		return;
	}
	if(!owfWindowName || !owfWindowName.preferenceLocation) { notInOWF(); return;}
	var owfPreferences = owfWindowName.preferenceLocation;
	var owfServer = owfPreferences.substring(0, owfPreferences.indexOf('/owf') + 4); 
	if(!owfServer) { notInOWF(); return; }
	
	// Attach OWF API to head. 
	var api = document.createElement('script'); 
	api.setAttribute('type', 'text/javascript'); 
	if(window.location.search && window.location.search.match("owf.debug")) {
		api.setAttribute('src', owfServer + '/js-min/owf-widget-debug.js');
	} else {
		api.setAttribute('src', owfServer + '/js-min/owf-widget-min.js');
	}
	// IE doesn't play nice with the load event, ready state change catches it
	api.onreadystatechange=function() {
		if(this.readyState === 'complete') {
			onOwfScriptReady();
		};
	};
	// Real browsers call this
	api.onload=onOwfScriptReady;
	
	headNode.appendChild(api);
	
	// Add the css file
	// <link type="text/css" rel="stylesheet" href="dragAndDrop.css">
	var link=document.createElement('link');
	link.setAttribute('type','text/css');
	link.setAttribute('rel','stylesheet');
	link.setAttribute('href',owfServer + "/css/dragAndDrop.css");
	headNode.appendChild(link);
	
	
})();

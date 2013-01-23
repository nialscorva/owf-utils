owf-widget-client-shim.js
=========
Loads the owf-widget-min.js and dragdrop.css from the server that the widget is being run in.  To use this, you need two files, owf-widget-client-shim.js and the blank.html from the ozone distro.  In the .html, add the following (changing paths as appropriate):

    <script type="text/javascript" src="owf-widget-client-shim.js"></script>
    <link rel="owf.blank.html" href="dojo-1.5.0-windowname-only/dojo/resources/blank.html"/>

Note that due to the dynamic loading of the javascript, you can't count on OWF being defined for other scripts.  The client shim bootstraps OWF.ready() so that it's available for subsequent scripts and properly registeres those handlers when the script is loaded.  If the page is loaded outside of an OWF container, the OWF.ready() handlers will NOT fire.  The shim DOES stub out isRunningInOwf() and isInContainer() to return false in that case, so that you can trust those functions.
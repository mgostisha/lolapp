/**
 * Global Alloy Configuration File
 */

// setup global loading
Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");

// Set App Wide constants
Alloy.Globals.settings = {
  ga: "UA-XXXXXXXX-X",
  iconLovation: "/images/icons/",
  tabs: {
    moreIcon: "more.png"
  },
  colors: {
    primary: "#333",
    secondary: "#999",
    text: "#FFF",
    menuText: "#FFF"
  },
  useMenu: false
};

// Get Device specifics
Alloy.Globals.device = {
    isHandheld: Alloy.isHandheld,
		isTablet: Alloy.isTablet,
		type: Alloy.isHandheld ? "handheld" : "tablet",
		os: null,
		name: null,
		version: Ti.Platform.version,
		versionMajor: parseInt(Ti.Platform.version.split(".")[0], 10),
		versionMinor: parseInt(Ti.Platform.version.split(".")[1], 10),
		width: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
		height: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
		dpi: Ti.Platform.displayCaps.dpi,
		orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "LANDSCAPE" : "PORTRAIT",
		statusBarOrientation: null
};
if(OS_IOS) {
		Alloy.Globals.device.os = "IOS";

			if(Ti.Platform.osname.toUpperCase() == "IPHONE") {
				Alloy.Globals.device.name = "IPHONE";
			} else if(Ti.Platform.osname.toUpperCase() == "IPAD") {
				Alloy.Globals.device.name = "IPAD";
			}
		} else if(OS_ANDROID) {
			Alloy.Globals.device.os = "ANDROID";

			Alloy.Globals.device.name = Ti.Platform.model.toUpperCase();

			// Fix the display values
			Alloy.Globals.device.width = (Alloy.Globals.device.width / (Alloy.Globals.device.dpi / 160));
			Alloy.Globals.device.height = (Alloy.Globals.device.height / (Alloy.Globals.device.dpi / 160));
		};

// Custom Query Styles
Alloy.Globals.isIOS7Plus = (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 7);
Alloy.Globals.isIOS8Plus = (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 8);
Alloy.Globals.isAndroid4 = (OS_ANDROID && parseInt(Ti.Platform.version.split(".")[0]) === 4);

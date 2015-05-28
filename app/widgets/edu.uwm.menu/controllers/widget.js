/**
 * The slide menu widget
 *
 * @class Widgets.com.mcongrove.slideMenu
 */
var sections = [],
	items = [],
	isOpen = false,
	color,
	slideOut = Ti.UI.createAnimation(),
	slideIn = Ti.UI.createAnimation();

// setup animations
slideOut.curve = Ti.UI.ANIMATION_CURVE_EASE_OUT;
slideOut.left = "-"+ Alloy.Globals.device.width;
slideOut.duration = 500;

slideIn.curve = Ti.UI.ANIMATION_CURVE_EASE_IN;
slideIn.left = 0;
slideIn.duration = 500;

/**
 * Initializes the slide menu
 * @param {Object} _params
 * @param {Array} _params.items The items (menu items) to show in the side menu as defined by the JSON configuration file
 * @param {Object} _params.color The colors for the menu
 * @param {String} _params.color.headingBackground The background color for menu headers
 * @param {String} _params.color.headingText The text color for menu headers
 */
$.init = function(_params) {
	$.wrapper.left = "-"+ Alloy.Globals.device.width;

	sections = [];
	items = [];
	color = typeof _params.color !== "undefined" ? _params.color : null;
	// Creates a TableViewSection for each tab with a menuHeader property
	buildSections(_params.items);

	if(sections.length > 0) {
		var currentSection = -1;
	}

	for(var i = 0; i < _params.items.length; i++) {
		// Iterates through the created sections
		if(_params.items[i].menuHeader) {
			currentSection++;
		}
		var tab = Widget.createController('item', _params.items[i]).getView();

		if(sections.length > 0) {
			sections[currentSection].add(tab);

			// If the last tab has been created and added to a section or
			// the next tab is a new header, append the current section to the TableView
			if(i + 1 !== _params.items.length) {
				if(_params.items[i + 1].menuHeader) {
					$.nodes.appendSection(sections[currentSection]);
				}
			} else {
				$.nodes.appendSection(sections[currentSection]);
			}
		} else {
			items.push(tab);
		}
	}

	if(items.length > 0) {
		$.nodes.setData(items);
	}

	// We have to remove before adding to make sure we're not duplicating
	$.nodes.removeEventListener("click", handleClick);
	$.nodes.addEventListener("click", handleClick);
};

/**
 * Handles a click event on the items container
 * @param {Object} _event The event
 */
function handleClick(_event) {
	if(typeof _event.index !== "undefined") {
		$.setActive(_event.index);
	}
};

/**
 * Builds out the table sections
 * @param {Object} _items The tab items to show in the side menu
 * @private
 */
function buildSections(_items) {
	for(var i = 0; i < _items.length; i++) {
		// Assigns special menuHeader styling
		if(_items[i].menuHeader) {
			var header = Ti.UI.createView({
				top: "0dp",
				height: "20dp",
				width: Ti.UI.FILL,
				backgroundColor: color.headingBackground
			});

			var headerText = Ti.UI.createLabel({
				text: _items[i].menuHeader,
				top: "2dp",
				left: "13dp",
				font: {
					fontSize: "12dp",
					fontWeight: "HelveticaNeue-Light"
				},
				color: color.headingText,
				touchEnabled: false,
				verticalAlignment: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				isHeader: true
			});

			header.add(headerText);

			var section = Ti.UI.createTableViewSection({
				headerView: header
			});

			sections.push(section);
		}
	}
};

/**
 * Sets the indexed item as active
 * @param {Object} _index The index of the item to show as active
 */
$.setActive = function(_index) {
	$.nodes.selectRow(_index);
};


$.toggleMenu = function() {

	if (isOpen) {
		$.background.opacity = 0.0;
		$.wrapper.animate(slideOut);
		isOpen = false;
	} else {
		$.wrapper.animate(slideIn);
		isOpen = true;
		setTimeout(function(){
			$.background.opacity = 0.7;
		},500);
	}
}


$.close.addEventListener("click", $.toggleMenu);

// Move the UI down if iOS7+
if(OS_IOS && parseInt(Ti.Platform.version.split(".")[0], 10) >= 7) {
	$.wrapper.top = "20dp";
}

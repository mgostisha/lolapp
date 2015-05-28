/// <reference path="../../typings/tsd.d.ts" />
/**
* A Tabs and Slidemenu Navigtion controller
* Required due to the lack of window stacks on Android tabs
* a heavily modified version of the ChariTi Navigation controller
*
* @class navController
* @uses Alloy
*
*/

var Alloy = require("alloy");

var nav = {

  currentStack: -1,

  previousScreen: null,

  controllerStacks:[],

  mainWindow: null,

  globalContainer: null,

  contentContainer: null,

  nodes: null,

  tabs: null,

  menu: null,

  menuOpen: false,
  /**
   * @method nav.buildTabs
   * Renders a cross-platform tab menu system
   * @param {Object} _options an object of tab options
   */
  buildTabs: function(_options) {
    var tabs = [];
    var imageFolder = Alloy.Globals.settings.iconLocation;
    for(var i=0, x = _options.length; i< x; i++) {
      tabs.push({
        id: i,
        title: _options[i].title,
        image: imageFolder + _options[i].image + ".png",
        controller: _options[i].controller,
      });
    }
    nav.nodes = tabs;
    nav.tabs.init({
      nodes: tabs,
      more: imageFolder + Alloy.Globals.settings.tabs.moreIcon,
      color: {
        background: Alloy.Globals.settings.colors.primary,
        active: Alloy.Globals.settings.colors.secondary,
        text: Alloy.Globals.settings.colors.text
      }
    });
    // add and remove the event listener to ensure we have the right one intialized
    nav.tabs.Wrapper.removeEventListener("click", nav.handleTabClick);
    nav.tabs.Wrapper.addEventListener("click", nav.handleTabClick);
  },
  /**
   * @method buildMenu
   * Renders a cross-platform slide menu system
   * @param {Object} _options an object of slide menu options
   */
  buildMenu: function(_options) {

    var items = [];
    var imageFolder = Alloy.Globals.settings.iconLocation;
    for(var i=0, x = _options.length; i< x; i++) {
      items.push({
        id: i,
        title: _options[i].title,
        image: imageFolder + _options[i].image + ".png",
        controller: _options[i].controller,
        menuHeader: _options[i].menuHeader
      });
    }
    nav.nodes = items;

    nav.menu.init({
      items:items,
      color: {
        headingBackground: Alloy.Globals.settings.colors.primary,
        headingText: Alloy.Globals.settings.colors.menuText
      }
    });

    // add and remove the event listener to ensure we have the right one intialized
    nav.menu.nodes.removeEventListener("click", nav.handleMenuClick);
    nav.menu.nodes.addEventListener("click", nav.handleMenuClick);
  },
  /**
   * @method handleTabClick
   * Event handler for Tab click events
   * @param {Object} _event the passed event
   */
  handleTabClick: function(_event) {
    if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
      nav.handleNavigation(_event.source.id);
    }
  },
  /**
   * @method handleMenuClick
   * @param {Object} _event the passed event
   */
  handleMenuClick: function(_event) {
    if(typeof _event.row.id !== "undefined" && typeof _event.row.id == "number") {
      nav.handleNavigation(_event.row.id);
    }
    nav.menu.toggleMenu();
  },
  /**
   * @method handleNavigation
   * @param {Integer} _id the id of the navigation item to navigate to
   */
  handleNavigation: function(_id) {
    if(_id == nav.currentStack) {
      return;
    } else {
      if(Alloy.Globals.settings.useMenu) {
        nav.menu.setActive(_id);
      } else {
        nav.tabs.setIndex(_id);
      }
      // close any loading screens
      Alloy.Globals.loading.hide();

      nav.currentStack = _id;

      if(typeof nav.controllerStacks[_id] === "undefined") {
        nav.controllerStacks[_id] = [];
      }

      var controllerStack = nav.controllerStacks[_id];
      var screen;

      if(controllerStack.length > 0) {
        screen = controllerStack[controllerStack.length -1];
      } else {
        var controller = nav.nodes[_id].controller.toLowerCase();

        screen = Alloy.createController(controller, nav.nodes[_id]).getView();

        // Add screen to the controller stack
        controllerStack.push(screen);
      }

      nav.addScreen(screen);
    }
  },
  /**
   * @method addChild
   * @param {String} _controller the name of the controller to open
   * @param {Object} _params     the params to pass to the conntrollers creation
   */
  addChild: function(_controller, _params) {
    var stack = nav.controllerStacks[nav.currentStack],
    screen = Alloy.createController(_controller, _params).getView();

    stack.push(screen);
    nav.addScreen(screen);
    // clear out our reference
    screen = null;
  },
  /**
   * @method removeChild
   */
  removeChild: function() {
    var stack = nav.controllerStacks[nav.currentStack],
    previousStack,
    previousScreen;

    stack.pop();

    if(stack.length === 0) {
      previousStack = nav.controllerStacks[nav.currentStack];

      previousScreen = previousStack[previousStack.length - 1];

      nav.addScreen(previousScreen);

    } else {
      previousScreen = stack[stack.length -1];
      nav.addScreen(previousScreen);
    }
  },

  removeAllChildren: function() {
    var stack = nav.controllerStacks[nav.currentStack];

    for(var i = stack.length -1; i > 0; i--) {
      stack.pop();
    }

    nav.addScreen(stack[0]);
  },

  addScreen: function(_screen) {
    if(_screen) {
      nav.contentContainer.add(_screen);

      if(nav.previousScreen) {
        nav.removeScreen(nav.previousScreen);
      }

      nav.previousScreen = _screen;
    }
  },
  /**
  * Function to remove a screen
  * @param {Object} _screen  The view to remove
  */
  removeScreen: function(_screen) {
    if(_screen) {
      nav.contentContainer.remove(_screen);
      nav.previousScreen = null;
    }
  }
};

module.exports = nav;

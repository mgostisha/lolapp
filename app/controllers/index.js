/// <reference path="../../typings/tsd.d.ts" />

/**
 * Single Window Application template
 * @class index
 */

/**
 * Variables
 */
var dispatcher = require('dispatcher'),
    ga = require('ti.ga');
    // tracker = ga.createTracker({
    //   trackingId:Alloy.Globals.settings.ga,
    //   useSecure:true,
    //   debug:true
    // });



/**
 * Bootstrap method
 * @method $.init
 *
 */
$.init = function() {
  //GA pageview
  // tracker.addScreenView('my-cool-view2');

  $.navBar.setBackgroundColor("#ccc");
  $.navBar.setTitle('SixPack');

  //this array will hold window stack for ho home functionality
  Alloy.Globals.stack = [];
};


/**
 * A garbage collection function on window close
 * @method $.cleanup
 */
$.cleanup = function() {

  $.destroy();

  $.off();

  dispatcher.off(null, null, $);

};

/**
 * Events
 */
//Hide Android action bar.
if(OS_ANDROID) {
	$.index.addEventListener('open', function() {
		$.index.activity.actionBar.hide();
	});
}


$.index.addEventListener('close', $.cleanup);

$.start.addEventListener('click', function() {


  var win = Alloy.createController('example').getView();
  Alloy.Globals.stack.push(win);
  win.open();
  win = null;
});


$.index.open();
$.init();
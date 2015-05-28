/// <reference path="../../typings/tsd.d.ts" />

/**
 * Single Window Application template
 * @class index
 */

/**
 * Variables
 */
var dispatcher = require('dispatcher');


/**
 * Bootstrap method
 * @method $.init
 */
$.init = function() {
  $.navBar.setBackgroundColor("#fff");
  $.navBar.setTitle('League of Legends');
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
  Alloy.createController('summoner_info').getView().open();
});


$.index.open();
$.init();
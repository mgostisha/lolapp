/// <reference path="../../typings/tsd.d.ts" />

var dispatcher = require('dispatcher'),
    args = arguments[0] || {};
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
  $.navBar.showBack(function(){
    $.summoner_info.close();
  });
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
$.summoner_info.addEventListener('close', $.cleanup);

$.init();

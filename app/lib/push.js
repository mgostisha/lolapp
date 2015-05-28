/// <reference path="../../typings/tsd.d.ts" />
/**
 * @class Push
 * Makes working with ACS Push notifications easier
 * for remote push notifications only
 */

var ACS = require('ti.cloud');

exports.deviceToken = null;

/**
 * register a device
 * @param {Function} _callback the callback
 * @param {Object} _params iOS specific params for interactive
 */
exports.registerDevice = function(_callback, _params) {

  /**
   * Registers an iOS device for push notifications
   * @platform iOS
   */
  if(OS_IOS) {
		// test for iOS 8+ interactive notification suport
    if (Alloy.Globals.isIOS8Plus) {
      Ti.App.iOS.registerUserNotificationSettings({
        types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT , Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE , Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND],
        categories: _params.categories
      });

      Ti.Network.registerForPushNotifications({
        success: function(_data) {
          // console.log(_data.deviceToken);

          exports.deviceToken = _data.deviceToken;
          Ti.App.Properties.setString("PUSH_DEVICETOKEN", _data.deviceToken);

          _callback();
        },
        error: function(_data) {
          console.log(JSON.stringify(_data));
        },
        callback: function(_data) {
          pushRecieved(_data);

        }
      });

    } else {
      Ti.Network.registerForPushNotifications({
        types: [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
        success: function(_data) {
          // console.log(_data.deviceToken);

          exports.deviceToken = _data.deviceToken;
          Ti.App.Properties.setString("PUSH_DEVICETOKEN", _data.deviceToken);

          _callback();
        },
        error: function(_data) {
          console.log(JSON.stringify(_data));
        },
        callback: function(_data) {
          pushRecieved(_data);

        }
      });
    }



	} else if(OS_ANDROID) {
    /**
     * Registers an Android device for push notifications
     * @platform Android
     */
		var CloudPush = require('ti.cloudpush');

    CloudPush.retrieveDeviceToken({
      success: function(_data) {

        exports.deviceToken = _data.deviceToken;

        Ti.App.Properties.setString("PUSH_DEVICETOKEN", _data.deviceToken);

        CloudPush.addEventListener('callback', function(evt) {
          pushRecieved(evt);
          //console.log(JSON.stringify(evt));
        });

        _callback();
      },
      error: function(_data) {
        console.log(JSON.stringify(_data));
      }
    });
	}
};

/**
 * Subscribes a device to a push notification channel
 * @param {Object} _args  Mixed params to initalize a new channel
 * @param {String} _args.channel  Channel to subscribe to
 * @param {Function} _args.success  callback function on subscribe success
 * @param {Funcxtion} _args.failure callback function on subscribe error
 *
 */
exports.subscribeChannel = function(_args) {
  if (exports.deviceToken !== null && _args.channel) {
    ACS.PushNotifications.subscribeToken({
      device_token: exports.deviceToken,
      channel: _args.channel,
      type: OS_IOS ? 'ios' : 'android'
    }, function(e) {
      if (e.success) {
        if (_args.success) {
          _args.success(e);
        } else {
          // basic success msg
          console.log("channel " + _args.channel +" subscription successful");
        }

      } else {
        if (_args.failure) {
          _args.failure(e);
        } else {
          //basic error msg
          console.log("channel " + _args.channel +" subscription failed");
        }
      }
    });
  }
};

/**
 * Subscribes a device to a push notification channel
 * @param {Object} _args  Mixed params to initalize a new channel
 * @param {String} _args.channel  Channel to subscribe to
 * @param {Function} _args.success  callback function on subscribe success
 * @param {Funcxtion} _args.failure callback function on subscribe error
 *
 */
exports.unsubscribeChannel = function(_args) {
  if (exports.deviceToken !== null && _args.channel) {
    ACS.PushNotifications.unsubscribeToken({
      device_token: exports.deviceToken,
      channel: _args.channel
    }, function(e) {
      if (e.success) {
        if (_args.success) {
          _args.success(e);
        } else {
          // basic success msg
          console.log("channel " + _args.channel +" subscription removal successful");
        }

      } else {
        if (_args.failure) {
          _args.failure(e);
        } else {
          //basic error msg
          console.log("channel " + _args.channel +" subscription removal failed");
        }
      }
    });
  }
};


/**
 * The function to run after a push has been received
 * @param {Object} _data The push data received
 */
var pushRecieved = function(_data) {

	var payload = null;

	if (_data.data) {
		payload = _data.data;
	} else if(_data.payload) {
		payload = JSON.parse(_data.payload);
		payload.alert = payload.android.alert;
	} else {
		return;
	}
  /**
   * here's where you could do something custom
   * We've just included a standard dialog box
   */


	var dialog = Ti.UI.createAlertDialog({
		title: "Push Notification",
		message: payload.alert,
		buttonNames: ["OK", "Cancel"],
		cancel: 1
	});

	dialog.show();
};

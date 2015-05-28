/**
 * Dispatcher
 * a Global JS-only event dipatcher
 * extends Backbone events to our own devises
 */

/**
 * Usage
 *
 * var dispatcher = require('dispatcher');
 *
 * dispatcher.on('event', function onEvent(e){
 *     // do stuff
 *
 *     // GC
 *     dispatcher.off('event', event);
 * })
 *
 *
 * in another file
 *
 * var dispatcher = require('dispatcher');
 *
 * function doEvent(e){
 *     dispatcher.trigger('event');
 * }
 *
 */

module.exports = _.clone(Backbone.Events);

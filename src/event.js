/**
 * pubfood
 *
 * Events live here..
 */

'use strict';

var util = require('./util');
var logger = require('./logger');
var EventEmitter = require('eventemitter3');

/**
 * Pubfood event class
 * @class
 * @property {string} auctionId The auction identifier
 * @example AuctionId Format - <random string>:<auction count index>
 * iis9xx46a6v2x58e1b:3
 * @return {PubfoodEvent}
 * @extends EventEmitter
 * @see https://github.com/primus/eventemitter3
 */
function PubfoodEvent() {
  this.auctionId = 'pubfood:' + Date.now();
  /**
   * Map of emitted events without registered handlers.
   *
   * @private
   */
  this.observeImmediate_ = {};
  // PubfoodEvent constructor
}

/**
 * Set the pubfood auctionId
 * @param {string|number} auctionId the auction identifier
 * @private
*/
PubfoodEvent.prototype.setAuctionId = function(auctionId) {
  var type = util.asType(auctionId);
  if (type === 'string' || type === 'number') {
    this.auctionId = auctionId;
  }
  return this.auctionId;
};

/**
 * @description Available event types
 */
PubfoodEvent.prototype.EVENT_TYPE = {
  /**
   * Api library load
   * @event PubfoodEvent.PUBFOOD_API_LOAD
   * @private
   */
  PUBFOOD_API_LOAD: 'PUBFOOD_API_LOAD',
  /**
   * Api library start
   * @event PubfoodEvent.PUBFOOD_API_START
   * @property {number} data api start timestamp
   * @private
   */
  PUBFOOD_API_START: 'PUBFOOD_API_START',
  /**
   * Api library refresh
   * @event PubfoodEvent.PUBFOOD_API_REFRESH
   * @property {number} data api refresh timestamp
   * @private
   */
  PUBFOOD_API_REFRESH: 'PUBFOOD_API_REFRESH',
  /**
   * Bid provider library load started
   * @event PubfoodEvent.BID_LIB_START
   * @private
   */
  BID_LIB_START: 'BID_LIB_START',
  BID_LIB_LOAD: 'BID_LIB_LOAD',
  /**
   * Bid provider library loaded
   * @event PubfoodEvent.BID_LIB_LOADED
   * @property {string} data [BidProvider.name]{@link pubfood#provider.BidProvider}
   * @private
   */
  BID_LIB_LOADED: 'BID_LIB_LOADED',
  /**
   * Action started.<br>e.g [BidProvider.init]{@link pubfood/provider.BidProvider#init}
   * @event PubfoodEvent.BID_START
   * @property {string} data [BidProvider.name]{@link pubfood#provider.BidProvider}
   */
  BID_START: 'BID_START',
  /**
   *  Next item in data stream ready.
   *
   * @event PubfoodEvent.BID_PUSH_NEXT
   * @property {object} data @see [Bid]{@link pubfood#model.Bid}
   * @property {string} data.id
   * @property {array.<number, number>} data.sizes
   * @property {string} data.value
   * @property {object} data.targeting
   * @private
   */
  BID_PUSH_NEXT: 'BID_PUSH_NEXT',
  /**
   *  Next item in data stream was late meeting the auction timeout.
   *
   * @event PubfoodEvent.BID_PUSH_NEXT_LATE
   * @property {object} data @see [Bid]{@link pubfood#model.Bid}
   * @property {string} data.id
   * @property {array.<number, number>} data.sizes
   * @property {string} data.value
   * @property {object} data.targeting
   * @private
   */
  BID_PUSH_NEXT_LATE: 'BID_PUSH_NEXT_LATE',
  /**
   * Action is complete
   * @event PubfoodEvent.BID_COMPLETE
   * @property {string} data [BidProvider.name]{@link pubfood#provider.BidProvider}
   * @property {object} annotations event metadata
   * @property {string} [annotations.forcedDone] flag to indicate completion was forced
   * @example
   * annotations.forcedDone && annotations.forcedDone === 'timeout'
   */
  BID_COMPLETE: 'BID_COMPLETE',
  /**
   * Start bid assembler
   * @event PubfoodEvent.BID_ASSEMBLER
   * @property {Bid[]} data bid objects with potentially custom properties.
   * See also [TransformOperator]{@link pubfood#assembler.TransformOperator}
   * @private
   */
  BID_ASSEMBLER: 'BID_ASSEMBLER',
  /**
   * Auction provider library load started
   * @event PubfoodEvent.AUCTION_LIB_START
   * @property {string} data [AuctionProvider.name]{@link pubfood#provider.AuctionProvider}
   * @private
   */
  AUCTION_LIB_START: 'AUCTION_LIB_START',
  AUCTION_LIB_LOAD: 'AUCTION_LIB_LOAD',
  /**
   * Auction provider library loaded
   * @event PubfoodEvent.AUCTION_LIB_LOADED
   * @property {string} data [AuctionProvider.name]{@link pubfood#provider.AuctionProvider}
   * @private
   */
  AUCTION_LIB_LOADED: 'AUCTION_LIB_LOADED',
  /**
   * Start the publisher auction
   * @event PubfoodEvent.AUCTION_GO
   * @property {string} data [AuctionProvider.name]{@link pubfood#provider.AuctionProvider}
   */
  AUCTION_GO: 'AUCTION_GO',
  AUCTION_START: 'AUCTION_START',
  /**
   * Start the publisher auction from a business rule.
   * e.g. a bidder timeout
   * @event PubfoodEvent.AUCTION_TRIGGER
   * @property {string} data [AuctionProvider.name]{@link pubfood#provider.AuctionProvider}
   * @private
   */
  AUCTION_TRIGGER: 'AUCTION_TRIGGER',
  /**
   * The auction was refreshed
   * @event PubfoodEvent.AUCTION_REFRESH
   * @property {string} data [AuctionProvider.name]{@link pubfood#provider.AuctionProvider}
   */
  AUCTION_REFRESH: 'AUCTION_REFRESH',
  /**
   * The auction has finished running
   * @event PubfoodEvent.AUCTION_COMPLETE
   * @property {object} data
   * @property {string} data.name the [AuctionProvider.name]{@link pubfood#provider.AuctionProvider} property value
   * @property {array.<TargetingObject>} data.targeting targeting data used in the auction
   */
  AUCTION_COMPLETE: 'AUCTION_COMPLETE',
  /**
   * Functions dependent on the completed auction can be called
   * @event PubfoodEvent.AUCTION_POST_RUN
   * @property {string} data [AuctionProvider.name]{@link pubfood#provider.AuctionProvider}
   */
  AUCTION_POST_RUN: 'AUCTION_POST_RUN',
  /**
   * Error event raised
   * @event PubfoodEvent.ERROR
   * @property {PubfoodError} data
   * @property {string} data.message
   * @property {string} data.stack
   */
  ERROR: 'ERROR',
  /**
   * Warn event raised
   * @event PubfoodEvent.WARN
   * @property {string} data the warning message
   */
  WARN: 'WARN',
  /**
   * Invalid operation or data event raise
   * @event PubfoodEvent.INVALID
   * @property {string} data description message
   */
  INVALID: 'INVALID'
};

/**
 * publish an event
 * @param {string} eventType The event type
 * @param {*} data the event data
 * @param {object} annotations Contextual metadata for the event
 * @return {boolean} Indication if we've emitted an event.
 */
PubfoodEvent.prototype.publish = function(eventType, data, annotations) {
  var ts = (+new Date());

  if (eventType === this.EVENT_TYPE.PUBFOOD_API_START && data) {
    ts = data;
  }

  var event = {
    auctionId: this.auctionId,
    ts: ts,
    type: eventType,
    annotations: annotations || {},
    data: data || ''
  };
  logger.logEvent(eventType, this.auctionId, event);

  return this.emit(eventType, event);
};

util.extends(PubfoodEvent, EventEmitter);

/**
 * Emit event, but keep events without a registered listener.
 *
 * Emitted events without a listener are stored as events to
 * be immediately observed by listeners; if a listener is added
 * subsequently.
 *
 * @see https://github.com/primus/eventemitter3
 *
 * @param {string} event the event type
 * @return {boolean} - true if the event was emitted. false otherwise.
 * @extends EventEmitter
 * @private
 */
PubfoodEvent.prototype.emit = function(event) {
  var ret = EventEmitter.prototype.emit.apply(this, arguments);

  if (!ret || this.EVENT_TYPE.AUCTION_POST_RUN === event) {
    ret = true;
    this.observeImmediate_[event] = this.observeImmediate_[event] || [];
    this.observeImmediate_[event].push(Array.prototype.slice.call(arguments, 1));
  }
  return ret;
};

/**
 * Register an event listener.
 *
 * Registeres a listener for the event type. If events for the specified type
 * have already been emitted, the registered handler function is invoked immediately.
 *
 * @see https://github.com/primus/eventemitter3
 *
 * @param {string} event the event type
 * @param {function} fn the event handler function
 * @return {PubfoodEvent} - this
 * @extends EventEmitter
 * @private
 */
PubfoodEvent.prototype.on = function(event, fn) {
  var emitted = this.observeImmediate_[event] || null;
  if (emitted) {
    for (var i = 0; i < emitted.length; i++) {
      fn.apply(this, emitted[i]);
    }
    return this;
  }
  return EventEmitter.prototype.on.apply(this, arguments);
};

/**
 * Remove all event listeners.
 *
 * Removes both extended EventEmitter listeners and internal
 * {@link pubfood#PubfoodEvent.emit} immediate listeners.
 *
 * @see https://github.com/primus/eventemitter3
 *
 * @return {PubfoodEvent} - this
 * @extends EventEmitter
 * @private
 */
PubfoodEvent.prototype.removeAllListeners = function() {
  EventEmitter.prototype.removeAllListeners.call(this);

  this.observeImmediate_ = {};

  return this;
};

module.exports = new PubfoodEvent();

'use strict';

/**
 * @constructor
 */
var Conditions = function(options) {
    var defaults = {
        date: new Date(),
        distanceFromPole: 0,
        temperature: 0, // celsius
        wind: 0 // m/s
    };
    objectUtil.initWithDefaults(this, defaults, options);
};

/** 
 * @return {number} kcal used to stay warm and generally alive in these conditions for an hour.
 */
Conditions.prototype.getEnergyUsedInHour = function(userWeight) {
    return Math.sqrt(userWeight) * 10 * (100 - this.temperature) / 100;
};

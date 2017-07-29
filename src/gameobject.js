'use strict';

/**
 * @constructor
 */
var GameObject = function() {
};

GameObject.prototype.initGameObject = function(options) {
    var defaults = {
        width: 1, // tiles
        height: 1, // tiles
        weight: 1, // kg
        kcal: 0,
        dead: true
    };
    objectUtil.initWithDefaults(this, defaults, options);
};

/**
 * @constructor
 */
var Hauler = function(options) {
    this.initGameObject({
        weight: 80,
        kcal: 140000,
        minKcal: 80000, // The hauler's energy can never drop below this - otherwise they'll die.
        dead: false
    });
    var defaults = {
        reasonOfDeath: ''
    };
    objectUtil.initWithDefaults(this, defaults, options);
};

Hauler.prototype = new GameObject();

Hauler.prototype.useEnergy = function(usedKcal) {
    
};

Hauler.prototype.getUsableEnergyPerHour = function() {
    var usableEnergy = (this.kcal - this.minKcal);
    return (usableEnergy * 0.001 + this.weight * 0.6) * 5 * (1 - 1/(usableEnergy * 1000 + 1));
};

Hauler.prototype.updateHour = function(conditions, kcalUsedForWork) {
    var usableKcal = this.getUsableEnergyPerHour();
    var usedKcal = conditions.getEnergyUsedInHour(this.weight) + kcalUsedForWork;
    if (usedKcal > usableKcal) {
        usedKcal = usableKcal;
        this.dead = true;
        this.reasonOfDeath = 'Died by exhaustion.';
    }
    this.kcal -= usedKcal;
};

/**
 * @return {number} Distance travelled per hour
 */
Hauler.prototype.getTotalHaulingEnergyPerHour = function(conditions) {
    var usableEnergyPerHour = this.getUsableEnergyPerHour();
    var energyUsedByBeingOutside = conditions.getEnergyUsedInHour(this.weight);
    return Math.max(0, usableEnergyPerHour - energyUsedByBeingOutside);
};

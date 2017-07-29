'use strict';

/**
 * @constructor
 * A unit that moves as one object.
 */
var Team = function() {
    this.haulers = []; // Haulers in front
    this.sleds = []; // Can be multiple sleds connected to each other.
};

Team.prototype.getTotalSledWeight = function() {
    var totalSledWeight = 0;
    for (var i = 0; i < this.sleds.length; ++i) {
        totalSledWeight += this.sleds[i].getWeight();
    }
    return totalSledWeight;
};

Team.prototype.getTotalHaulingEnergyPerHour = function() {
    var totalHaulerEnergy = 0;
    for (var i = 0; i < this.haulers.length; ++i) {
        totalHaulerEnergy += this.haulers[i].getHaulingEnergyPerHour();
    }
    return totalHaulerEnergy;
};

/**
 * @return {number} Distance in km
 */
Team.prototype.getDistanceTravelledPerHour = function(conditions) {
    var maxSpeed = 100;
    for (var i = 0; i < this.haulers.length; ++i) {
        maxSpeed = Math.min(maxSpeed, this.haulers[i].maxSpeed);
    }
    for (var i = 0; i < this.sleds.length; ++i) {
        maxSpeed = Math.min(maxSpeed, this.sleds[i].maxSpeed);
    }
    // Pulling a 1 kg load 1 km in normal conditions will burn 1 kcal.
    var pulledWeight = this.getTotalSledWeight();
    var totalHaulerEnergy = this.getTotalHaulingEnergyPerHour();
    var maxFromEnergy = totalHaulerEnergy / pulledWeight;
    return Math.min(maxSpeed, maxFromEnergy);
};

Team.prototype.calculateHaulingEnergy = function(distanceTravelled, conditions) {
    var pulledWeight = this.getTotalSledWeight();
    var totalEnergyUsed = pulledWeight * distanceTravelled;
    var totalHaulerEnergy = this.getTotalHaulingEnergyPerHour();

    // Save used energy first and apply it later. Having less energy in store can cause hauler to be able to haul less.
    this.usedHaulingEnergy = [];
    for (var i = 0; i < this.haulers.length; ++i) {
        var energyRatio = this.haulers[i].getHaulingEnergyPerHour() / totalHaulerEnergy;
        this.usedHaulingEnergy.push(energyRatio * totalEnergyUsed);
    }
};

Team.prototype.updateHour = function(conditions, distanceTravelled) {
    if (distanceTravelled > 0) {
        this.calculateHaulingEnergy(distanceTravelled, conditions);
        for (var i = 0; i < this.haulers.length; ++i) {
            this.haulers[i].updateHour(conditions, this.usedHaulingEnergy[i]);
        }
    } else {
        for (var i = 0; i < this.haulers.length; ++i) {
            this.haulers[i].updateHour(conditions, 0);
        }
    }
};

Team.prototype.canMove = function() {
    for (var i = 0; i < this.haulers.length; ++i) {
        if (!this.haulers[i].dead) {
            return false;
        }
    }
    return this.haulers.length > 0;
};


/**
 * @constructor
 * An expedition party made out of several Teams.
 */
var Party = function() {
    this.teams = [];
    this.goingTowardsPole = true;
    this.travelling = true;
};

Party.prototype.dropImmobileTeams = function() {
    for (var i = 0; i < this.teams.length;) {
        if (this.teams[i].canMove()) {
            ++i;
        } else {
            this.teams.splice(i, 1);
        }
    }
};

Party.prototype.getDistanceTravelledPerHour = function(conditions) {
    var minDistance = 1000;
    for (var i = 0; i < this.teams.length; ++i) {
        var distance = this.teams[i].getDistanceTravelledPerHour(conditions);
        minDistance = Math.min(distance, minDistance);
    }
    return minDistance;
};

/**
 * Called once per hour
 */
Party.prototype.updateHour = function(outsideConditions) {
    outsideConditions.updateHour();
    if (this.travelling) {
        var distanceTravelled = this.getDistanceTravelledPerHour(outsideConditions);
        this.teams[i].updateHour(outsideConditions, distanceTravelled);
        if (this.goingTowardsPole) {
            outsideConditions.distanceFromPole -= distanceTravelled;
            if (outsideConditions.distanceFromPole < 0) {
                outsideConditions.distanceFromPole = 0;
            }
        } else {
            outsideConditions.distanceFromPole += distanceTravelled;
        }
    } else {
        this.teams[i].updateHour(insideConditions, 0);
    }
};

Party.prototype.update = function(deltaTime) {
    outsideConditions
};

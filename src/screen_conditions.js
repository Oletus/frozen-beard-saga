'use strict';

var formatDay = function(day) {
    if (day % 10 === 1) {
        return day + 'st';
    } else if (day % 10 === 2) {
        return day + 'nd';
    } else if (day % 10 === 3) {
        return day + 'rd';
    } else {
        return day + 'th';
    }
};

var formatDate = function(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return formatDay(day) + ' of ' + monthNames[monthIndex] + ' ' + year;
};

/**
 * @constructor
 */
var ConditionsUI = function(conditions) {
    this.conditions = conditions;
};

ConditionsUI.prototype.render = function(ctx) {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.2;

    var lineCount = 8;
    var thermometerBottom = 2;
    var thermometerTop = thermometerBottom - lineCount;
    ctx.beginPath();
    ctx.moveTo(1, thermometerBottom);
    ctx.arc(0, thermometerBottom + 1, Math.sqrt(2), -Math.PI * 0.25, Math.PI * 1.25, false);
    ctx.lineTo(-1, thermometerTop);
    ctx.arc(0, thermometerTop, 1, Math.PI, 0, false);
    ctx.closePath();
    for (var i = 0; i < lineCount; ++i) {
        var lineY = thermometerBottom - i - 1;
        ctx.moveTo(1.3, lineY);
        ctx.lineTo(2.0, lineY);
    }
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var lineTemp = -40;
    for (var i = 0; i < lineCount; ++i) {
        var lineY = thermometerBottom - i - 1;
        ctx.font = '1px sans-serif';
        ctx.fillText(lineTemp, 2.2, lineY);
        lineTemp += 10;
    }

    ctx.fillStyle = '#8af';
    ctx.beginPath();
    ctx.arc(0, thermometerBottom + 1, 1, 0, Math.PI * 2, false);
    ctx.fill();
    var tempY = thermometerBottom - 5 - this.conditions.temperature * 0.1;
    ctx.fillRect(-0.5, tempY, 1, thermometerBottom + 1 - tempY);

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '2px sans-serif';
    ctx.fillText(formatDate(this.conditions.date), 0, thermometerTop - 4);
};

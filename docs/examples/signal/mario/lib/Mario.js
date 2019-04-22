"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Functional_1 = require("../../../../src/Functional");
var Activity;
(function (Activity) {
    Activity["Walking"] = "walk";
    Activity["Standing"] = "stand";
    Activity["Jumping"] = "jump";
})(Activity = exports.Activity || (exports.Activity = {}));
var Direction;
(function (Direction) {
    Direction["Left"] = "left";
    Direction["Right"] = "right";
})(Direction = exports.Direction || (exports.Direction = {}));
var gravity = 0.15; // px / frame^2
var maxMoveSpeed = 2.5; // px / frame
var groundAccel = 0.06; // px / frame^2
var airAccel = 0.04; // px / frame^2
var groundFriction = 0.1; // px / frame^2
var airFriction = 0.02; // px / frame^2
var jumpCoefficient = 0.8; // px / frame^3
var minJumpSpeed = 4.0; // px / frame
var isAirborne = function (c) { return c.y > 0.0; };
var isStanding = function (c) { return c.dx === 0.0; };
var currentActivity = function (c) {
    if (isAirborne(c)) {
        return Activity.Jumping;
    }
    if (isStanding(c)) {
        return Activity.Jumping;
    }
    return Activity.Walking;
};
exports.charSpriteDescriptor = function (c) {
    return "character " + currentActivity(c) + " " + c.dir;
};
var accel = function (c) { return isAirborne(c) ? airAccel : groundAccel; };
var friction = function (c) { return isAirborne(c) ? airFriction : groundFriction; };
/**
 * When Mario is in motion, his position changes
 */
var velocity = function (c) { return (__assign({}, c, { x: c.x + c.dx, y: c.y + c.dy })); };
/**
 * When Mario is above the ground, he is continuously pulled downward
 */
var applyGravity = function (c) {
    if (c.y <= -c.dy) {
        return __assign({}, c, { y: 0, dy: 0 });
    }
    return __assign({}, c, { dy: c.dy - gravity });
};
var applyFriction = function (c) {
    if (c.dx === 0.0) {
        return c;
    }
    if (Math.abs(c.dx) <= friction(c)) {
        return __assign({}, c, { dx: 0.0 });
    }
    if (c.dx > 0.0) {
        return __assign({}, c, { dx: c.dx - friction(c) });
    }
    return __assign({}, c, { dx: c.dx + friction(c) });
};
/**
 * Mario can move himself left/right with a fixed acceleration
 */
var walk = function (left, right) { return function (c) {
    if (left && !right) {
        return __assign({}, c, { dx: Math.max(-maxMoveSpeed, c.dx - accel(c)), dir: Direction.Left });
    }
    if (right && !left) {
        return __assign({}, c, { dx: Math.min(maxMoveSpeed, c.dx + accel(c)), dir: Direction.Right });
    }
    return applyFriction(c);
}; };
var jump = function (jmp) { return function (c) {
    if (jmp && !isAirborne(c)) {
        return __assign({}, c, { dy: minJumpSpeed + (jumpCoefficient * Math.abs(c.dx)) });
    }
    if (!jmp && isAirborne(c) && c.dy > 0.0) {
        return __assign({}, c, { dy: c.dy - gravity });
    }
    return c;
}; };
exports.marioLogic = function (inputs) { return Functional_1.compose(velocity, applyGravity, walk(inputs.left, inputs.right), jump(inputs.jump)); };
//# sourceMappingURL=Mario.js.map
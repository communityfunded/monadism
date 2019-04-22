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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Signal_1 = __importDefault(require("../../../../src/signal/Signal"));
var SignalDOM_1 = require("../../../../src/signal/SignalDOM");
var MarioDOM_1 = require("./MarioDOM");
var Mario_1 = require("./Mario");
var KeyCodes = {
    left: 37,
    right: 39,
    jump: 32,
};
var gameLogic = function (inputs) { return function (state) { return (__assign({}, state, { mario: Mario_1.marioLogic(inputs)(state.mario) })); }; };
var render = function (state) { return function () { return MarioDOM_1.updateSprite(MarioDOM_1.updatePosition(state.mario)); }; };
var getInputs = function (left) { return function (right) { return function (jump) { return ({ left: left, right: right, jump: jump }); }; }; };
exports.main = function () {
    MarioDOM_1.onDOMContentLoaded(function () {
        var frames = SignalDOM_1.animationFrame();
        var initialState = {
            mario: {
                node: MarioDOM_1.getMarioNode(),
                x: -50,
                y: 0,
                dx: 3,
                dy: 6,
                dir: Mario_1.Direction.Right,
            },
        };
        var leftInputs = SignalDOM_1.keyPressed(KeyCodes.left);
        var rightInputs = SignalDOM_1.keyPressed(KeyCodes.right);
        var jumpInputs = SignalDOM_1.keyPressed(KeyCodes.jump);
        var inputs = jumpInputs.apply(rightInputs.apply(leftInputs.map(getInputs)));
        var game = frames.sampleOn(inputs).foldp(gameLogic, initialState).map(render);
        Signal_1.default.run(game);
    });
};
if (require.main === module) {
    exports.main();
}
//# sourceMappingURL=Main.js.map
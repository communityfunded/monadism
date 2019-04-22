"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mario_1 = require("./Mario");
var groundHeight = 40; // px
exports.updatePosition = function (c) {
    c.node.style.left = c.x + "px";
    c.node.style.bottom = c.y + groundHeight + "px";
    return c;
};
exports.updateSprite = function (c) {
    c.node.className = Mario_1.charSpriteDescriptor(c);
    return c;
};
exports.onDOMContentLoaded = function (action) {
    if (document.readyState === 'interactive') {
        action();
    }
    else {
        document.addEventListener('DOMContentLoaded', action);
    }
};
exports.getMarioNode = function () { return document.getElementById('mario') || document.body; };
//# sourceMappingURL=MarioDOM.js.map
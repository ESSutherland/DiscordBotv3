"use strict";
/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleColor = void 0;
// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
const canvacord_1 = require("canvacord");
class RoleColor extends canvacord_1.Builder {
    constructor() {
        super(100, 100);
        this.bootstrap({
            color: "",
        });
    }
    setColor(value) {
        this.options.set("color", value);
        return this;
    }
    async render() {
        const { color } = this.options.getOptions();
        console.log(color);
        return (canvacord_1.JSX.createElement("div", { style: { backgroundColor: `#${color}` }, className: "w-full h-full flex" }));
    }
}
exports.RoleColor = RoleColor;

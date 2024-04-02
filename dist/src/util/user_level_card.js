"use strict";
/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelCard = void 0;
// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
const canvacord_1 = require("canvacord");
const cn_1 = require("./cn");
class UserLevelCard extends canvacord_1.Builder {
    constructor() {
        super(800, 300);
        this.bootstrap({
            displayName: "",
            avatar: "",
            userStatus: "",
            rank: 0,
            level: 0,
            xp: 0,
            xpToNextLevel: 0,
            xpPercentage: 0,
        });
    }
    setDisplayName(value) {
        this.options.set("displayName", value);
        return this;
    }
    setAvatar(value) {
        this.options.set("avatar", value);
        return this;
    }
    setUserStatus(value) {
        this.options.set("userStatus", value);
        return this;
    }
    setRank(value) {
        this.options.set("rank", value);
        return this;
    }
    setLevel(value) {
        this.options.set("level", value);
        return this;
    }
    setXp(value) {
        this.options.set("xp", value);
        return this;
    }
    setXpToNextLevel(value) {
        this.options.set("xpToNextLevel", value);
        return this;
    }
    setXpPercentage(value) {
        this.options.set("xpPercentage", value);
        return this;
    }
    async render() {
        const { displayName, userStatus, avatar, level, rank, xp, xpPercentage, xpToNextLevel, } = this.options.getOptions();
        let statusBgColor = "bg-gray-600";
        switch (userStatus) {
            case "online":
                statusBgColor = "bg-green-600";
                break;
            case "idle":
                statusBgColor = "bg-yellow-600";
                break;
            case "dnd":
                statusBgColor = "bg-red-600";
                break;
            case "offline":
                statusBgColor = "bg-gray-600";
                break;
            default:
                statusBgColor = "bg-gray-600";
                break;
        }
        let statusBorderColor = "border-gray-600";
        switch (userStatus) {
            case "online":
                statusBorderColor = "border-green-600";
                break;
            case "idle":
                statusBorderColor = "border-yellow-600";
                break;
            case "dnd":
                statusBorderColor = "border-red-600";
                break;
            case "offline":
                statusBorderColor = "border-gray-600";
                break;
            default:
                statusBorderColor = "border-gray-600";
                break;
        }
        const image = await (0, canvacord_1.loadImage)("https://raw.githubusercontent.com/ESSutherland/Pengwin/main/public/BG.png");
        return (canvacord_1.JSX.createElement("div", { style: {
                backgroundImage: `url(${image.toDataURL()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }, className: "p-0 m-0 flex h-full w-full rounded-xl items-center justify-center text-gray-300" },
            canvacord_1.JSX.createElement("div", { className: "m-0 p-0 py-6 w-[95%] h-[86%] bg-black/60 flex flex-col items-center justify-between rounded-xl" },
                canvacord_1.JSX.createElement("div", { className: "m-0 p-0 flex w-[80%] items-center justify-between relative" },
                    canvacord_1.JSX.createElement("img", { src: avatar, className: (0, cn_1.cn)(`p-0 m-0 w-28 h-28 rounded-full border-2`, statusBorderColor) }),
                    canvacord_1.JSX.createElement("div", { className: (0, cn_1.cn)(`p-0 m-0 absolute w-8 h-8 rounded-full border-2 border-black/20 bottom-0 flex`, statusBgColor) }),
                    canvacord_1.JSX.createElement("h1", { className: "m-0 p-0 mx-10 flex items-center text-5xl overflow-hidden h-full" }, displayName),
                    canvacord_1.JSX.createElement("h2", { className: "m-0 p-0 text-3xl flex items-center justify-center" },
                        "Rank:",
                        " ",
                        canvacord_1.JSX.createElement("span", { className: "p-0 m-0 text-4xl text-sky-400 ml-2" },
                            "#",
                            rank))),
                canvacord_1.JSX.createElement("div", { className: "p-5 m-0 w-full mx-10 flex items-center justify-center" },
                    canvacord_1.JSX.createElement("h3", { className: "text-3xl m-0 p-0" },
                        "Level:",
                        canvacord_1.JSX.createElement("span", { className: "m-0 p-0 text-sky-400 ml-2" }, level)),
                    canvacord_1.JSX.createElement("div", { className: "m-0 p-0 mx-5 flex w-[400px] h-4 bg-gray-300 rounded-xl overflow-hidden" },
                        canvacord_1.JSX.createElement("div", { style: {
                                backgroundImage: `linear-gradient(to right, #38bdf8, #0284c7)`,
                                width: `${xpPercentage}%`,
                            }, className: "m-0 p-0 flex h-full" })),
                    canvacord_1.JSX.createElement("h4", { className: "m-0 p-0" },
                        xp,
                        "/",
                        xpToNextLevel,
                        " XP")))));
    }
}
exports.UserLevelCard = UserLevelCard;

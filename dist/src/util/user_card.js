"use strict";
/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCard = void 0;
const canvacord_1 = require("canvacord");
const cn_1 = require("./cn");
class UserCard extends canvacord_1.Builder {
    constructor() {
        super(930, 600);
        this.bootstrap({
            displayName: "",
            userName: "",
            guildName: "",
            guildIcon: "",
            joinedAt: "",
            registeredAt: "",
            roles: [],
            avatar: "",
            displayHexColor: "",
            userStatus: "",
        });
    }
    setDisplayName(value) {
        this.options.set("displayName", value);
        return this;
    }
    setUserName(value) {
        this.options.set("userName", value);
        return this;
    }
    setGuildName(value) {
        this.options.set("guildName", value);
        return this;
    }
    setGuildIcon(value) {
        this.options.set("guildIcon", value);
        return this;
    }
    setAvatar(value) {
        this.options.set("avatar", value);
        return this;
    }
    setJoinedAt(value) {
        this.options.set("joinedAt", value);
        return this;
    }
    setRegisteredAt(value) {
        this.options.set("registeredAt", value);
        return this;
    }
    setRoles(value) {
        this.options.set("roles", value);
        return this;
    }
    setDisplayHexColor(value) {
        this.options.set("displayHexColor", value);
        return this;
    }
    setUserStatus(value) {
        this.options.set("userStatus", value);
        return this;
    }
    async render() {
        const { displayName, userName, guildName, guildIcon, joinedAt, registeredAt, roles, avatar, displayHexColor, userStatus, } = this.options.getOptions();
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
        return (canvacord_1.JSX.createElement("div", { className: "m-0 p-0 h-full w-full flex flex-col items-center justify-between rounded-xl border-4 border-sky-200 text-gray-300 relative overflow-hidden" },
            canvacord_1.JSX.createElement("img", { src: image.toDataURL(), className: "m-0 p-0 w-[930px] h-[600px] absolute " }),
            canvacord_1.JSX.createElement("div", { className: "m-0 p-0 py-3 w-full bg-sky-200 flex items-center justify-center relative" },
                canvacord_1.JSX.createElement("img", { src: guildIcon, className: "m-0 p-0 absolute w-16 h-16 bg-sky-400 rounded-full left-5 border-2 border-black/30" }),
                canvacord_1.JSX.createElement("h1", { style: {
                        backgroundImage: "linear-gradient(to top, #38bdf8, #0284c7)",
                        backgroundClip: "text",
                    }, className: "p-0 m-0 text-5xl text-transparent" }, guildName)),
            canvacord_1.JSX.createElement("div", { className: "m-0 my-auto h-[84%] w-[96%] bg-black/40 rounded-lg flex flex-col p-6 pt-2 justify-between" },
                canvacord_1.JSX.createElement("div", { className: "m-0 p-0 py-5 flex w-full items-center justify-between" },
                    canvacord_1.JSX.createElement("div", { className: "p-0 m-0 w-1/2 flex justify-center items-center relative" },
                        canvacord_1.JSX.createElement("img", { src: avatar, className: (0, cn_1.cn)(`m-0 p-0 flex rounded-2xl w-48 h-48 bg-sky-200 border-4`, statusBorderColor) }),
                        canvacord_1.JSX.createElement("div", { className: (0, cn_1.cn)(`m-0 p-0 w-10 h-10 rounded-full absolute -bottom-2 right-[24%] border-2 border-black/30 flex`, statusBgColor) })),
                    canvacord_1.JSX.createElement("div", { className: "m-0 p-0 flex flex-col w-1/2 justify-center border-2 border-sky-200 rounded-xl overflow-hidden" },
                        canvacord_1.JSX.createElement("h2", { className: "m-0 p-0 py-1 text-2xl w-full bg-sky-200 flex items-center justify-center text-gray-300" },
                            canvacord_1.JSX.createElement("span", { style: {
                                    backgroundImage: "linear-gradient(to top, #38bdf8, #0284c7)",
                                    backgroundClip: "text",
                                }, className: "m-0 p-0 text-transparent" }, "Info")),
                        canvacord_1.JSX.createElement("div", { className: "m-0 p-0 w-full flex flex-col py-3 px-10 bg-black/40" },
                            canvacord_1.JSX.createElement("h4", { className: "m-0 p-0 text-2xl w-full flex items-center justify-between" },
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 mr-3" }, "Display:"),
                                canvacord_1.JSX.createElement("span", { style: { color: displayHexColor }, className: `m-0 p-0 text-3xl` }, displayName)),
                            canvacord_1.JSX.createElement("h4", { className: "m-0 p-0 my-1 text-2xl w-full flex items-center justify-between" },
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 mr-3" }, "Username:"),
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 text-xl " }, userName)),
                            canvacord_1.JSX.createElement("h4", { className: "m-0 p-0 my-1 text-2xl w-full flex items-center justify-between" },
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 mr-3" }, "Registered:"),
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 text-xl " }, registeredAt)),
                            canvacord_1.JSX.createElement("h4", { className: "m-0 p-0 my-1 text-2xl w-full flex items-center justify-between" },
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 mr-3" }, "Joined:"),
                                canvacord_1.JSX.createElement("span", { className: "m-0 p-0 text-xl " }, joinedAt))))),
                canvacord_1.JSX.createElement("div", { className: "m-0 p-0 w-full flex flex-col items-center rounded-xl border-2 bg-black/40 border-sky-200 overflow-hidden" },
                    canvacord_1.JSX.createElement("h2", { className: "m-0 p-0 py-2 text-2xl w-full bg-sky-200 flex items-center justify-center text-gray-300" },
                        canvacord_1.JSX.createElement("span", { style: {
                                backgroundImage: "linear-gradient(to top, #38bdf8, #0284c7)",
                                backgroundClip: "text",
                            }, className: "m-0 p-0 text-transparent" },
                            "Roles (",
                            roles.length,
                            ")")),
                    canvacord_1.JSX.createElement("ul", { className: "m-0 flex flex-wrap items-center p-3" }, roles.map((role) => (canvacord_1.JSX.createElement("li", { className: "m-2 p-0", key: role.name },
                        canvacord_1.JSX.createElement("p", { style: {
                                backgroundColor: `${role.hexColor}88`,
                                borderColor: role.hexColor,
                            }, className: `m-0 p-0 text-xl px-3 py-1 rounded-xl min-w-[80px] flex items-center justify-center border-2` }, role.name)))))))));
    }
}
exports.UserCard = UserCard;

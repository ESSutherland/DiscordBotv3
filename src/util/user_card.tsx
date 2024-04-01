/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

import { JSX, Builder, loadImage } from "canvacord";
import { Role } from "discord.js";
import { cn } from "./cn";

interface Props {
  displayName: string;
  userName: string;
  guildName: string;
  guildIcon: string;
  joinedAt: string;
  registeredAt: string;
  roles: Role[];
  avatar: string;
  displayHexColor: string;
  userStatus: string;
}

export class UserCard extends Builder<Props> {
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

  setDisplayName(value: string) {
    this.options.set("displayName", value);
    return this;
  }

  setUserName(value: string) {
    this.options.set("userName", value);
    return this;
  }

  setGuildName(value: string) {
    this.options.set("guildName", value);
    return this;
  }

  setGuildIcon(value: string) {
    this.options.set("guildIcon", value);
    return this;
  }

  setAvatar(value: string) {
    this.options.set("avatar", value);
    return this;
  }

  setJoinedAt(value: string) {
    this.options.set("joinedAt", value);
    return this;
  }

  setRegisteredAt(value: string) {
    this.options.set("registeredAt", value);
    return this;
  }

  setRoles(value: Role[]) {
    this.options.set("roles", value);
    return this;
  }

  setDisplayHexColor(value: string) {
    this.options.set("displayHexColor", value);
    return this;
  }

  setUserStatus(value: string) {
    this.options.set("userStatus", value);
    return this;
  }

  async render() {
    const {
      displayName,
      userName,
      guildName,
      guildIcon,
      joinedAt,
      registeredAt,
      roles,
      avatar,
      displayHexColor,
      userStatus,
    } = this.options.getOptions();

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

    const image = await loadImage(
      "https://raw.githubusercontent.com/ESSutherland/Pengwin/main/public/BG.png"
    );

    return (
      <div className="m-0 p-0 h-full w-full flex flex-col items-center justify-between rounded-xl border-4 border-sky-200 text-gray-300 relative overflow-hidden">
        <img
          src={image.toDataURL()}
          className="m-0 p-0 w-[930px] h-[600px] absolute "
        />
        <div className="m-0 p-0 py-3 w-full bg-sky-200 flex items-center justify-center relative">
          <img
            src={guildIcon}
            className="m-0 p-0 absolute w-16 h-16 bg-sky-400 rounded-full left-5 border-2 border-black/30"
          />
          <h1
            style={{
              backgroundImage: "linear-gradient(to top, #38bdf8, #0284c7)",
              backgroundClip: "text",
            }}
            className="p-0 m-0 text-5xl text-transparent"
          >
            {guildName}
          </h1>
        </div>
        <div className="m-0 my-auto h-[84%] w-[96%] bg-black/40 rounded-lg flex flex-col p-6 pt-2 justify-between">
          <div className="m-0 p-0 py-5 flex w-full items-center justify-between">
            <div className="p-0 m-0 w-1/2 flex justify-center items-center relative">
              <img
                src={avatar}
                className={cn(
                  `m-0 p-0 flex rounded-2xl w-48 h-48 bg-sky-200 border-4`,
                  statusBorderColor
                )}
              />
              <div
                className={cn(
                  `m-0 p-0 w-10 h-10 rounded-full absolute -bottom-2 right-[24%] border-2 border-black/30 flex`,
                  statusBgColor
                )}
              />
            </div>
            <div className="m-0 p-0 flex flex-col w-1/2 justify-center border-2 border-sky-200 rounded-xl overflow-hidden">
              <h2 className="m-0 p-0 py-1 text-2xl w-full bg-sky-200 flex items-center justify-center text-gray-300">
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, #38bdf8, #0284c7)",
                    backgroundClip: "text",
                  }}
                  className="m-0 p-0 text-transparent"
                >
                  Info
                </span>
              </h2>
              <div className="m-0 p-0 w-full flex flex-col py-3 px-10 bg-black/40">
                <h4 className="m-0 p-0 text-2xl w-full flex items-center justify-between">
                  <span className="m-0 p-0 mr-3">Display:</span>
                  <span
                    style={{ color: displayHexColor }}
                    className={`m-0 p-0 text-3xl`}
                  >
                    {displayName}
                  </span>
                </h4>
                <h4 className="m-0 p-0 my-1 text-2xl w-full flex items-center justify-between">
                  <span className="m-0 p-0 mr-3">Username:</span>
                  <span className="m-0 p-0 text-xl ">{userName}</span>
                </h4>
                <h4 className="m-0 p-0 my-1 text-2xl w-full flex items-center justify-between">
                  <span className="m-0 p-0 mr-3">Registered:</span>
                  <span className="m-0 p-0 text-xl ">{registeredAt}</span>
                </h4>
                <h4 className="m-0 p-0 my-1 text-2xl w-full flex items-center justify-between">
                  <span className="m-0 p-0 mr-3">Joined:</span>
                  <span className="m-0 p-0 text-xl ">{joinedAt}</span>
                </h4>
              </div>
            </div>
          </div>

          <div className="m-0 p-0 w-full flex flex-col items-center rounded-xl border-2 bg-black/40 border-sky-200 overflow-hidden">
            <h2 className="m-0 p-0 py-2 text-2xl w-full bg-sky-200 flex items-center justify-center text-gray-300">
              <span
                style={{
                  backgroundImage: "linear-gradient(to top, #38bdf8, #0284c7)",
                  backgroundClip: "text",
                }}
                className="m-0 p-0 text-transparent"
              >
                Roles ({roles.length})
              </span>
            </h2>
            <ul className="m-0 flex flex-wrap items-center p-3">
              {roles.map((role) => (
                <li className="m-2 p-0" key={role.name}>
                  <p
                    style={{
                      backgroundColor: `${role.hexColor}88`,
                      borderColor: role.hexColor,
                    }}
                    className={`m-0 p-0 text-xl px-3 py-1 rounded-xl min-w-[80px] flex items-center justify-center border-2`}
                  >
                    {role.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
import { JSX, Builder, loadImage } from "canvacord";
import { GuildMember, User } from "discord.js";

interface Props {
  users: GuildMember[];
  levels: any[];
}

export class Leaderboard extends Builder<Props> {
  constructor() {
    super(800, 800);
    this.bootstrap({
      users: [],
      levels: [],
    });
  }

  setUsers(value: GuildMember[]) {
    this.options.set("users", value);
    return this;
  }

  setLevels(value: any[]) {
    this.options.set("levels", value);
    return this;
  }

  async render() {
    const { users, levels } = this.options.getOptions();

    const image = await loadImage(
      "https://raw.githubusercontent.com/ESSutherland/Pengwin/main/public/BG.png"
    );

    return (
      <div
        style={{
          backgroundImage: `url(${image.toDataURL()})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "",
          backgroundRepeat: "no-repeat",
        }}
        className="m-0 p-0 w-full h-full flex items-center justify-center text-gray-300 rounded-xl"
      >
        <div className="m-0 p-0 flex w-[95%] h-[95%] bg-black/60 rounded-xl flex-col items-center">
          <h1
            style={{
              backgroundImage: "linear-gradient(to top, #38bdf8, #0284c7)",
              backgroundClip: "text",
            }}
            className="h-[60px] text-7xl text-transparent my-5"
          >
            LEADERBOARD
          </h1>
          {users.length >= 1 && (
            <div
              style={{
                backgroundImage: "linear-gradient(to right, #38bdf8, #0284c7)",
              }}
              className="m-0 p-0 w-[95%] h-[20%] flex items-center justify-between rounded-xl border-4 border-yellow-500 my-2 relative"
            >
              <div className="m-0 p-0 flex absolute -top-9 -left-3 text-4xl">
                <span className="m-0 p-0">👑</span>
              </div>
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <h2 className="m-0 p-0 text-6xl text-yellow-500">#1</h2>
              </div>
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <img
                  src={users[0].displayAvatarURL({
                    extension: "png",
                    forceStatic: true,
                    size: 512,
                  })}
                  className="m-0 p-0 w-32 h-32 rounded-full mx-10 border-2 border-black/30"
                />
              </div>
              <div className="m-0 p-0 flex flex-col items-center justify-center px-20 w-1/2 overflow-hidden">
                <h3 className="m-0 p-0 text-4xl">{users[0].displayName}</h3>
                <h4 className="m-0 p-0 text-2xl">Level {levels[0].level}</h4>
              </div>
            </div>
          )}

          {users.length >= 2 && (
            <div
              style={{
                backgroundImage: "linear-gradient(to right, #38bdf8, #0284c7)",
              }}
              className="m-0 p-0 w-[92%] h-[17%] flex items-center justify-between rounded-xl border-2 border-sky-300 my-2"
            >
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <h2 className="m-0 p-0 text-5xl text-gray-300">#2</h2>
              </div>
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <img
                  src={users[1].displayAvatarURL({
                    extension: "png",
                    forceStatic: true,
                    size: 512,
                  })}
                  className="m-0 p-0 w-28 h-28 rounded-full mx-10 border-2 border-black/30"
                />
              </div>
              <div className="m-0 p-0 flex flex-col items-center justify-center px-20 w-1/2 overflow-hidden">
                <h3 className="m-0 p-0 text-4xl">{users[1].displayName}</h3>
                <h4 className="m-0 p-0 text-2xl">Level {levels[1]}</h4>
              </div>
            </div>
          )}

          {users.length >= 3 && (
            <div
              style={{
                backgroundImage: "linear-gradient(to right, #38bdf8, #0284c7)",
              }}
              className="m-0 p-0 w-[90%] h-[15%] flex items-center justify-between rounded-xl border-2 border-sky-300 my-2"
            >
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <h2 className="m-0 p-0 text-5xl text-yellow-600">#3</h2>
              </div>
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <img
                  src={users[2].displayAvatarURL({
                    extension: "png",
                    forceStatic: true,
                    size: 512,
                  })}
                  className="m-0 p-0 w-24 h-24 rounded-full mx-10 border-2 border-black/30"
                />
              </div>
              <div className="m-0 p-0 flex flex-col items-center justify-center px-20 w-1/2 overflow-hidden">
                <h3 className="m-0 p-0 text-4xl">{users[2].displayName}</h3>
                <h4 className="m-0 p-0 text-2xl">Level {levels[2]}</h4>
              </div>
            </div>
          )}

          {users.length >= 4 && (
            <div
              style={{
                backgroundImage: "linear-gradient(to right, #38bdf8, #0284c7)",
              }}
              className="m-0 p-0 w-[85%] h-[12%] flex items-center justify-between rounded-xl border-2 border-sky-300 my-1"
            >
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <h2 className="m-0 p-0 text-5xl text-white">#4</h2>
              </div>
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <img
                  src={users[3].displayAvatarURL({
                    extension: "png",
                    forceStatic: true,
                    size: 512,
                  })}
                  className="m-0 p-0 w-20 h-20 rounded-full mx-10 border-2 border-black/30"
                />
              </div>
              <div className="m-0 p-0 flex flex-col items-center justify-center px-20 w-1/2 overflow-hidden">
                <h3 className="m-0 p-0 text-4xl">{users[3].displayName}</h3>
                <h4 className="m-0 p-0 text-2xl">Level {levels[3]}</h4>
              </div>
            </div>
          )}

          {users.length >= 5 && (
            <div
              style={{
                backgroundImage: "linear-gradient(to right, #38bdf8, #0284c7)",
              }}
              className="m-0 p-0 w-[85%] h-[12%] flex items-center justify-between rounded-xl border-2 border-sky-300 my-1"
            >
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <h2 className="m-0 p-0 text-5xl text-white">#5</h2>
              </div>
              <div className="m-0 p-0 flex items-center justify-center w-1/4">
                <img
                  src={users[4].displayAvatarURL({
                    extension: "png",
                    forceStatic: true,
                    size: 512,
                  })}
                  className="m-0 p-0 w-20 h-20 rounded-full mx-10 border-2 border-black/30"
                />
              </div>
              <div className="m-0 p-0 flex flex-col items-center justify-center px-20 w-1/2 overflow-hidden">
                <h3 className="m-0 p-0 text-4xl">{users[4].displayName}</h3>
                <h4 className="m-0 p-0 text-2xl">Level {levels[4]}</h4>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

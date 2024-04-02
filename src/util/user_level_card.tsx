/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
import { JSX, Builder, loadImage } from "canvacord";
import { cn } from "./cn";

interface Props {
  displayName: string;
  userStatus: string;
  rank: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpPercentage: number;
  avatar: string;
  isPremium: boolean;
}

export class UserLevelCard extends Builder<Props> {
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
      isPremium: false,
    });
  }

  setDisplayName(value: string) {
    this.options.set("displayName", value);
    return this;
  }

  setAvatar(value: string) {
    this.options.set("avatar", value);
    return this;
  }

  setUserStatus(value: string) {
    this.options.set("userStatus", value);
    return this;
  }

  setRank(value: number) {
    this.options.set("rank", value);
    return this;
  }

  setLevel(value: number) {
    this.options.set("level", value);
    return this;
  }

  setXp(value: number) {
    this.options.set("xp", value);
    return this;
  }

  setXpToNextLevel(value: number) {
    this.options.set("xpToNextLevel", value);
    return this;
  }

  setXpPercentage(value: number) {
    this.options.set("xpPercentage", value);
    return this;
  }

  setIsPremium(value: boolean) {
    this.options.set("isPremium", value);
    return this;
  }

  async render() {
    const {
      displayName,
      userStatus,
      avatar,
      level,
      rank,
      xp,
      xpPercentage,
      xpToNextLevel,
      isPremium,
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
      <div
        style={{
          backgroundImage: `url(${image.toDataURL()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="p-0 m-0 flex h-full w-full rounded-xl items-center justify-center text-gray-300"
      >
        <div className="m-0 p-0 py-6 w-[95%] h-[86%] bg-black/60 flex flex-col items-center justify-between rounded-xl">
          <div className="m-0 p-0 flex w-[80%] items-center justify-between relative">
            <img
              src={avatar}
              className={cn(
                `p-0 m-0 w-28 h-28 rounded-full border-2`,
                statusBorderColor
              )}
            />
            <div
              className={cn(
                `p-0 m-0 absolute w-8 h-8 rounded-full border-2 border-black/20 bottom-0 flex`,
                statusBgColor
              )}
            />
            <div className="m-0 p-0 flex flex-col items-center justify-center">
              <h1 className="m-0 p-0 mx-10 flex items-center text-5xl overflow-hidden h-[80px]">
                {displayName}
              </h1>
              {isPremium && (
                <h2 className="m-0 p-0 text-3xl text-fuchsia-500">
                  2x XP Boost
                </h2>
              )}
            </div>
            <h2 className="m-0 p-0 text-3xl flex items-center justify-center">
              Rank:{" "}
              <span className="p-0 m-0 text-4xl text-sky-400 ml-2">
                #{rank}
              </span>
            </h2>
          </div>
          <div className="p-5 m-0 w-full mx-10 flex items-center justify-center">
            <h3 className="text-3xl m-0 p-0">
              Level:<span className="m-0 p-0 text-sky-400 ml-2">{level}</span>
            </h3>
            <div className="m-0 p-0 mx-5 flex w-[400px] h-4 bg-gray-300 rounded-xl overflow-hidden">
              <div
                style={{
                  backgroundImage: `linear-gradient(to right, #38bdf8, #0284c7)`,
                  width: `${xpPercentage}%`,
                }}
                className="m-0 p-0 flex h-full"
              ></div>
            </div>
            <h4 className="m-0 p-0">
              {xp}/{xpToNextLevel} XP
            </h4>
          </div>
        </div>
      </div>
    );
  }
}

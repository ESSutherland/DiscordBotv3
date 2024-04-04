/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */

// JSX import is required if you want to use JSX syntax
// Builder is a base class to create your own builders
// loadImage is a helper function to load images from url or path
import { JSX, Builder, loadImage } from "canvacord";

interface Props {
  color: string;
}

export class RoleColor extends Builder<Props> {
  constructor() {
    super(100, 100);
    this.bootstrap({
      color: "",
    });
  }

  setColor(value: string) {
    this.options.set("color", value);
    return this;
  }

  async render() {
    const { color } = this.options.getOptions();

    return (
      <div
        style={{ backgroundColor: `#${color}` }}
        className="w-full h-full flex"
      ></div>
    );
  }
}

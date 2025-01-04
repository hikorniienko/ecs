import { Graphics } from "pixi.js";
import { Component } from "../Component";

export class GraphicsComponent extends Component {
  graphics: Graphics;

  constructor() {
    super();
    this.graphics = new Graphics();
  }
}

import { Group } from "@tweenjs/tween.js";
import { Component } from "../Component";

export class TweenComponent extends Component {
  public tweens: Group = new Group();

  constructor() {
    super();
  }
}

import { Container } from "pixi.js";
import { Component } from "../Component";

export class ContainerComponent extends Component {
  container: Container;

  constructor(public parentEntityId?: string) {
    super();
    this.container = new Container();
  }
}

import type { ECS } from "./ECS";
import type { Entity } from "./Entity";

export abstract class System {
  protected _destroyed = false;

  constructor(public ecs: ECS) {}

  public update(entities: Map<string, Entity>) {}

  public destroy() {
    this._destroyed = true;
  }

  public isDestroyed() {
    return this._destroyed;
  }
}

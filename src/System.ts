import type { ECS } from "./ECS";
import type { Entity } from "./Entity";

export abstract class System {
  protected destroyed = false;

  constructor(public ecs: ECS) {}

  public update(entities: Map<string, Entity>) {}

  public destroy() {
    this.destroyed = true;
  }

  public isDestroyed() {
    return this.destroyed;
  }
}

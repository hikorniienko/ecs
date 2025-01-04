import { Application } from "pixi.js";
import { Entity } from "./Entity";
import type { System } from "./System";

export class ECS {
  public app: Application = new Application();
  public entities: Map<string, Entity> = new Map();
  public systems: Map<string, System> = new Map();
  public settings = {
    root: document.body,
  };

  protected _nextEntityId = 0;
  protected _destroyedEntityIds: string[] = [];

  constructor(settings?: Partial<ECS["settings"]>) {
    this.setSettings(settings);
    this.execute();
  }

  protected async execute() {
    const root = this.settings.root;
    await this.app.init({
      width: root.clientWidth,
      height: root.clientHeight,
      resizeTo: root,
    });
    root.appendChild(this.app.canvas);

    this.app.ticker.add(() => {
      this.systems.forEach((system) => {
        system.update(this.entities);
        system.isDestroyed() && this.systems.delete(system.constructor.name);
      });

      this._destroyedEntityIds.forEach((id) => {
        this.entities.delete(id);
      });
      this._destroyedEntityIds = [];
    });
  }

  public setSettings(settings?: Partial<ECS["settings"]>) {
    this.settings = { ...this.settings, ...settings };
  }

  public createEntity() {
    this._nextEntityId += 1;
    const id = `entity-${this._nextEntityId}`;
    const onDestory = () => {
      this._destroyedEntityIds.push(id);
    };
    const entity = new Entity(id, onDestory);
    this.entities.set(id, entity);
    return entity;
  }

  public destroyEntity(id: string) {
    this.entities.get(id)?.destroy();
  }

  public addSystem(system: System) {
    this.systems.set(system.constructor.name, system);
  }

  public removeSystem(name: string) {
    this.systems.get(name)?.destroy();
  }
}

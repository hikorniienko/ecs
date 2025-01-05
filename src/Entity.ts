export class Entity {
  protected destroyed = false;
  protected components: Map<string, { constructor: Function }> = new Map();

  constructor(
    public id: string,
    protected onDestroy: () => void,
  ) {}

  public addComponent(component: { constructor: Function }) {
    this.components.set(component.constructor.name, component);
  }

  public getComponent<T>(name: string): T | undefined {
    return this.components.get(name) as T;
  }

  public destroy() {
    this.destroyed = true;
    this.onDestroy();
  }

  public isDestroyed() {
    return this.destroyed;
  }
}

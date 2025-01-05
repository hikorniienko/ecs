export class Entity {
  protected _destroyed = false;
  protected _components: Map<string, { constructor: Function }> = new Map();

  constructor(
    public id: string,
    protected _onDestroy: () => void,
  ) {}

  public addComponent(component: { constructor: Function }) {
    this._components.set(component.constructor.name, component);
  }

  public getComponent<T>(name: string): T | undefined {
    return this._components.get(name) as T;
  }

  public destroy() {
    this._destroyed = true;
    this._onDestroy();
  }

  public isDestroyed() {
    return this._destroyed;
  }
}

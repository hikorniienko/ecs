export abstract class System {
  protected _isActive = true;

  public get isActive() {
    return this._isActive;
  }

  public set isActive(value) {
    this._isActive = value;
  }

  public execute(deltaTime: number, elapsedMS: number) {}
}

export class EventManager {
  protected _events: Record<string, Set<{ listener: Function; once: boolean }>> = {};

  public on<T extends any>(event: string, listener: (data: T) => void, once: boolean = false) {
    if (!this._events[event]) {
      this._events[event] = new Set();
    }
    this._events[event].add({ listener, once });
  }

  public off(event: string, listener: Function, once: boolean = false) {
    if (this._events[event]) {
      this._events[event].delete({ listener, once });
    }
  }

  public emit(name: string, data?: any) {
    if (this._events[name]) {
      this._events[name].forEach((listener) => {
        listener.listener(data);
        if (listener.once) {
          this._events[name].delete(listener);
        }
      });
    }
  }

  public async take<T extends any>(event: string) {
    return new Promise<T>((resolve) => {
      const listener = (data: T) => {
        resolve(data);
      };

      this.on<T>(event, listener, true);
    });
  }

  public list: Record<string, string> = {};
}

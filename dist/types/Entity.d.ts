export declare class Entity {
    id: string;
    protected _onDestroy: () => void;
    protected _destroyed: boolean;
    protected _components: Map<string, {
        constructor: Function;
    }>;
    constructor(id: string, _onDestroy: () => void);
    addComponent(component: {
        constructor: Function;
    }): void;
    getComponent<T>(name: string): T | undefined;
    destroy(): void;
    isDestroyed(): boolean;
}

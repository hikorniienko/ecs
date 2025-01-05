import { Application } from "pixi.js";
import { Entity } from "./Entity";
import type { System } from "./System";
export declare class ECS {
    app: Application;
    entities: Map<string, Entity>;
    systems: Map<string, System>;
    settings: {
        root: HTMLElement;
    };
    protected _nextEntityId: number;
    protected _destroyedEntityIds: string[];
    constructor(settings?: Partial<ECS["settings"]>);
    protected execute(): Promise<void>;
    setSettings(settings?: Partial<ECS["settings"]>): void;
    createEntity(): Entity;
    destroyEntity(id: string): void;
    addSystem(system: System): void;
    removeSystem(name: string): void;
}

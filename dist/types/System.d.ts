import type { ECS } from "./ECS";
import type { Entity } from "./Entity";
export declare abstract class System {
    ecs: ECS;
    protected _destroyed: boolean;
    constructor(ecs: ECS);
    update(entities: Map<string, Entity>): void;
    destroy(): void;
    isDestroyed(): boolean;
}

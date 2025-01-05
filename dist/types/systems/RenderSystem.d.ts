import { System } from "../System";
import type { Entity } from "../Entity";
import type { ContainerComponent } from "../components/ContainerComponent";
export declare class RenderSystem extends System {
    getChildrenLabels(container: ContainerComponent): string[];
    update(entities: Map<string, Entity>): void;
}

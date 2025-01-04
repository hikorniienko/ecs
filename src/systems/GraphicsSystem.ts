import { System } from "../System";
import type { Entity } from "../Entity";
import type { ContainerComponent } from "../components/ContainerComponent";
import type { GraphicsComponent } from "../components/GraphicsComponent";

export class GraphicsSystem extends System {
  update(entities: Map<string, Entity>) {
    entities.forEach((entity) => {
      const container = entity.getComponent<ContainerComponent>("ContainerComponent");
      const graphics = entity.getComponent<GraphicsComponent>("GraphicsComponent");

      if (container && graphics && !graphics.graphics.parent) {
        container.container.addChild(graphics.graphics);
      }
    });
  }
}

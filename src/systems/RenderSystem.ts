import { System } from "../System";
import type { Container } from "pixi.js";
import type { Entity } from "../Entity";
import type { ContainerComponent } from "../components/ContainerComponent";
import type { GraphicsComponent } from "../components/GraphicsComponent";
import type { TweenComponent } from "../components/TweenComponent";

export class RenderSystem extends System {
  getChildrenLabels(container: Container): string[] {
    const labels: string[] = [];
    container.children.forEach((child) => {
      labels.push(child.label);
      labels.push(...this.getChildrenLabels(child));
    });
    return labels;
  }

  update(entities: Map<string, Entity>) {
    entities.forEach((entity) => {
      const container = entity.getComponent<ContainerComponent>("ContainerComponent");
      const graphics = entity.getComponent<GraphicsComponent>("GraphicsComponent");
      const tween = entity.getComponent<TweenComponent>("TweenComponent");

      // ContainerComponent
      if (container && entity.isDestroyed()) {
        const entityIds = this.getChildrenLabels(container.container);

        if (container.container.parent) {
          container.container.parent.removeChild(container.container);
        }

        container.container.destroy({
          children: true,
          context: true,
          texture: true,
          style: true,
        });

        this.ecs.destroyEntity(container.container.label);
        entityIds.forEach((id) => {
          this.ecs.destroyEntity(id);
        });
        return;
      }

      if (container && !container.container.parent) {
        container.container.label = entity.id;

        const parent =
          container.parentEntityId &&
          entities.get(container.parentEntityId)?.getComponent<ContainerComponent>("ContainerComponent");

        if (parent) {
          parent.container.addChild(container.container);
        } else {
          this.ecs.app.stage.addChild(container.container);
        }
      }

      // GraphicsComponent
      if (container && graphics && !graphics.graphics.parent) {
        container.container.addChild(graphics.graphics);
      }

      // TweenComponent
      if (entity.isDestroyed() && tween) {
        tween.tweens.removeAll();
      }

      if (tween) {
        tween.tweens.update();
      }
    });
  }
}

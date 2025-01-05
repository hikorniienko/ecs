import { System } from "../System";
import type { Entity } from "../Entity";
import type { ContainerComponent } from "../components/ContainerComponent";
import type { GraphicsComponent } from "../components/GraphicsComponent";
import type { ParentComponent } from "../components/ParentComponent";
import type { TweenComponent } from "../components/TweenComponent";

export class RenderSystem extends System {
  getChildrenLabels(container: ContainerComponent): string[] {
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
      const parent = entity.getComponent<ParentComponent>("ParentComponent");
      const tween = entity.getComponent<TweenComponent>("TweenComponent");

      // ContainerComponent
      if (container && !container.label) {
        container.label = entity.id;
      }

      if (container && entity.isDestroyed()) {
        const entityIds = this.getChildrenLabels(container);

        if (container.parent) {
          container.parent.removeChild(container);
        }

        container.destroy({
          children: true,
          context: true,
          texture: true,
          style: true,
        });

        this.ecs.destroyEntity(container.label);
        entityIds.forEach((id) => {
          this.ecs.destroyEntity(id);
        });
        return;
      }

      if (container && !container.parent) {
        const parentEntity =
          parent &&
          parent.parentEntityId &&
          entities.get(parent.parentEntityId)?.getComponent<ContainerComponent>("ContainerComponent");

        if (parentEntity) {
          parentEntity.addChild(container);
        } else {
          this.ecs.app.stage.addChild(container);
        }
      }

      // GraphicsComponent
      if (container && graphics && !graphics.parent) {
        container.addChild(graphics);
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

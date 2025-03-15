import { System } from "../System";

import type { ECS } from "../ECS";
import type { Parent } from "../components/Parent";
import type { Graphics, Container } from "pixi.js";
import type { TweenComponent } from "../components/TweenComponent";

export class RenderSystem extends System {
  queryStages = [["Stage", "Container"], []];
  queryContainers = [["Container"], ["Stage"]];
  queryQraphics = [["Graphics", "Container"], []];
  queryTweens = [["TweenComponent"], []];

  constructor(public ecs: ECS) {
    super();
    ecs.addQuery(this.queryStages);
    ecs.addQuery(this.queryContainers);
    ecs.addQuery(this.queryQraphics);
    ecs.addQuery(this.queryTweens);
  }

  getChildrenLabels(container: Container): string[] {
    const labels: string[] = [];
    const stack: Container[] = [container];

    while (stack.length > 0) {
      const current = stack.pop();
      if (current) {
        labels.push(current.label);
        stack.push(...current.children);
      }
    }

    return labels;
  }

  execute() {
    this.ecs.getQueryNew(this.queryContainers)?.forEach((entity) => {
      const container = this.ecs.getComponent<Container>(entity, "Container");
      const parent = this.ecs.getComponent<Parent>(entity, "Parent");

      if (container) {
        container.label = entity;
      }

      if (parent) {
        const parentContainer = this.ecs.getComponent<Container>(parent.parentEntity, "Container");
        if (parentContainer && container) {
          parentContainer.addChild(container);
          return;
        } else {
          throw new Error("RenderSystem: Parent component not found");
        }
      }

      this.ecs.getQuery(this.queryStages)?.forEach((entity) => {
        console.log("queryStages", entity);
        const stage = this.ecs.getComponent<Container>(entity, "Container");
        if (stage && container) {
          stage.addChild(container);
        }
      });

      if (this.ecs.getQuery(this.queryStages)?.size === 0) {
        throw new Error("RenderSystem: Stage component not found");
      }
    });

    this.ecs.getQueryRemove(this.queryContainers)?.forEach((entity) => {
      const container = this.ecs.getComponent<Container>(entity, "Container");

      if (container) {
        const entities = this.getChildrenLabels(container);

        if (container.parent) {
          container.parent.removeChild(container);
        }

        container.destroy({
          children: true,
          context: true,
          texture: true,
          style: true,
        });

        entities.forEach((entity) => {
          this.ecs.removeEntity(entity);
        });
      }
    });

    this.ecs.getQueryNew(this.queryQraphics)?.forEach((entity) => {
      const graphics = this.ecs.getComponent<Graphics>(entity, "Graphics");
      const container = this.ecs.getComponent<Container>(entity, "Container");

      if (graphics && container) {
        container.addChild(graphics);
      }
    });

    this.ecs.getQuery(this.queryTweens)?.forEach((entity) => {
      const tween = this.ecs.getComponent<TweenComponent>(entity, "TweenComponent");
      if (tween) {
        tween.tweens.update();
      }
    });

    this.ecs.getQueryRemove(this.queryTweens)?.forEach((entity) => {
      const tween = this.ecs.getComponent<TweenComponent>(entity, "TweenComponent");
      if (tween) {
        tween.tweens.removeAll();
      }
    });
  }
}

import { Tween } from "@tweenjs/tween.js";
import { System } from "../System";

import type { ECS } from "../ECS";
import type { Parent } from "../components/Parent";
import { Graphics, Container } from "pixi.js";
import { TweenComponent } from "../components/TweenComponent";

export class TestSystem extends System {
  queryContainers = [["Container", "TweenComponent"], ["Stage"]];
  constructor(public ecs: ECS) {
    super();
    this.ecs.addQuery(this.queryContainers);

    setTimeout(() => {
      this.ramdomRemove();
    }, 1000);
  }

  ramdomRemove() {
    this.ecs.getQuery(this.queryContainers)?.forEach((entity) => {
      if (Math.random() > 0.75) {
        this.ecs.removeEntity(entity);
      }
    });

    setTimeout(() => {
      this.ramdomRemove();
      this.randomAdd();
    }, 2000);
  }

  randomAdd() {
    for (let i = 0; i < 250; i++) {
      const player = this.ecs.createEntity();
      this.ecs.addComponent(
        player,
        new Container({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }),
      );

      const playerGraphics = new Graphics();
      playerGraphics.rect(0, 0, 20, 20);
      playerGraphics.fill(Math.floor(Math.random() * 16777215));
      this.ecs.addComponent(player, playerGraphics);
      this.ecs.addComponent(player, new TweenComponent());
    }
  }

  execute() {
    this.ecs.getQueryNew(this.queryContainers)?.forEach((entity) => {
      const container = this.ecs.getComponent<Container>(entity, "Container");
      const tweenComponent = this.ecs.getComponent<TweenComponent>(entity, "TweenComponent");

      if (container && tweenComponent) {
        const tween = new Tween(container)
          .to({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          })
          .duration(2000)
          .repeat(Infinity)
          .yoyo(true)
          .delay(100)
          .start();

        tweenComponent.tweens.add(tween);
      }
    });
  }
}

import { ECS } from "./ECS";
import { System } from "./System";
import { Container, Graphics } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { ContainerComponent } from "./components/ContainerComponent";
import { GraphicsComponent } from "./components/GraphicsComponent";
import { ParentComponent } from "./components/ParentComponent";
import { TweenComponent } from "./components/TweenComponent";

import { RenderSystem } from "./systems/RenderSystem";

// export { ECS } from "./ECS";
// export { Entity } from "./Entity";
// export { Component } from "./Component";
// export { System } from "./System";

document.body.style.width = "100vw";
document.body.style.height = "100vh";
document.body.style.margin = "0";

const ecs = new ECS();
ecs.addSystem(new RenderSystem(ecs));

const player = ecs.createEntity();

player.addComponent(new ContainerComponent());
player.addComponent(new GraphicsComponent());
player.addComponent(new TweenComponent());

const playerContainer = player.getComponent<ContainerComponent>("ContainerComponent");
const playerTween = player.getComponent<TweenComponent>("TweenComponent");
const playerGraphics = player.getComponent<GraphicsComponent>("GraphicsComponent");
playerGraphics?.rect(0, 0, 50, 50);
playerGraphics?.fill("red");

if (playerContainer && playerTween) {
  const tween = new Tween(playerContainer)
    .to({ x: 100, y: 100 }, 1000)
    .easing(Easing.Quadratic.InOut)
    .repeat(Infinity)
    .yoyo(true)
    .delay(100)
    .start();

  playerTween.tweens.add(tween);
}

const friend = ecs.createEntity();
friend.addComponent(new ContainerComponent());
friend.addComponent(new ParentComponent(player.id));

const subfriend = ecs.createEntity();
subfriend.addComponent(new ContainerComponent());
subfriend.addComponent(new ParentComponent(player.id));

// setTimeout(() => {
//   player.destroy();
//   console.log("ecs", ecs);
// }, 5000);

for (let i = 0; i < 10000; i++) {
  const entity = ecs.createEntity();

  entity.addComponent(new ContainerComponent());
  entity.addComponent(new GraphicsComponent());
  entity.addComponent(new TweenComponent());

  const entityContainer = entity.getComponent<ContainerComponent>("ContainerComponent");
  const entityTween = entity.getComponent<TweenComponent>("TweenComponent");
  const entityGraphics = entity.getComponent<GraphicsComponent>("GraphicsComponent");
  entityGraphics?.rect(0, 0, 50, 50);
  entityGraphics?.fill(Math.floor(Math.random() * 16777215));

  if (entityContainer && entityTween) {
    entityContainer.x = Math.random() * window.innerWidth;
    entityContainer.y = Math.random() * window.innerHeight;

    const tween = new Tween(entityContainer)
      .to({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }, 1000)
      .easing(Easing.Quadratic.InOut)
      .repeat(Infinity)
      .yoyo(true)
      .delay(100)
      .start();

    entityTween.tweens.add(tween);
  }
}

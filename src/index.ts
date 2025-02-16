import { Application, Container, Graphics } from "pixi.js";
import { Tween } from "@tweenjs/tween.js";

import { ECS } from "./ECS";

import { Parent } from "./components/Parent";
import { TweenComponent } from "./components/TweenComponent";

import { RenderSystem } from "./systems/RenderSystem";
import { TestSystem } from "./systems/TestSystem";

const main = async () => {
  const root = document.body;
  root.style.position = "absolute";
  root.style.top = "0";
  root.style.left = "0";
  root.style.width = "100%";
  root.style.height = "100%";
  root.style.margin = "0%";
  root.style.padding = "0%";

  const app = new Application();
  await app.init({
    width: root.clientWidth,
    height: root.clientHeight,
    resizeTo: root,
  });
  root.appendChild(app.canvas);

  const ecs = new ECS();
  ecs.addSystem(new RenderSystem(ecs));
  ecs.addSystem(new TestSystem(ecs));

  app.ticker.add((ticker) => {
    ecs.execute(ticker.deltaTime, ticker.elapsedMS);
  });

  const stage = ecs.createEntity();
  ecs.addComponent(stage, app.stage);
  ecs.addComponent(stage, "Stage");

  const player = ecs.createEntity();
  ecs.addComponent(player, new Container());
  ecs.addComponent(player, new Parent(stage));

  const playerGraphics = new Graphics();
  playerGraphics.rect(0, 0, 100, 100);
  playerGraphics.fill("red");
  ecs.addComponent(player, playerGraphics);
  ecs.addComponent(player, new TweenComponent());

  for (let i = 0; i < 1000; i++) {
    const player = ecs.createEntity();
    ecs.addComponent(
      player,
      new Container({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }),
    );

    const playerGraphics = new Graphics();
    playerGraphics.rect(0, 0, 20, 20);
    playerGraphics.fill(Math.floor(Math.random() * 16777215));
    ecs.addComponent(player, playerGraphics);
    ecs.addComponent(player, new TweenComponent());
  }

  console.log("ecs", ecs);

  // setTimeout(() => {
  //   ecs.removeEntity(player);
  //   console.log("ecs2", ecs);
  // }, 2000);

  // setTimeout(() => {
  //   ecs.removeEntity(stage);
  //   console.log("ecs2", ecs);
  // }, 4000);
};

main();

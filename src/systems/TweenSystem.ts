import { System } from "../System";
import type { Entity } from "../Entity";
import type { TweenComponent } from "../components/TweenComponent";

export class TweenSystem extends System {
  update(entities: Map<string, Entity>) {
    entities.forEach((entity) => {
      const tween = entity.getComponent<TweenComponent>("TweenComponent");

      if (entity.isDestroyed() && tween) {
        tween.tweens.removeAll();
        return;
      }

      if (tween) {
        tween.tweens.update();
      }
    });
  }
}

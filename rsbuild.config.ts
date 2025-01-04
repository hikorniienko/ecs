import { defineConfig } from "@rsbuild/core";
import { pluginUmd } from "@rsbuild/plugin-umd";

export default defineConfig(({ env }) => ({
  plugins: [env === "production" && pluginUmd({ name: "ecs" })],
  ...(env === "production" && {
    output: {
      externals: {
        "pixi.js": "pixi.js",
        "@tweenjs/tween.js": "@tweenjs/tween.js",
      },
    },
  }),
}));

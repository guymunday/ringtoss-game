import Phaser from "phaser"
import Preloader from "./phaser/ring-toss/Preloader"
import Game from "./phaser/ring-toss/Game"
import Practise from "./phaser/ring-toss/Practise"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  parent: "game__wrapper",
  canvas: document.getElementById("game__canvas") as HTMLCanvasElement,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 400 },
      debug: process.env.NODE_ENV === "development",
    },
  },
  scene: [Preloader, Practise, Game],
}

new Phaser.Game(config)

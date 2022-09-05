import Phaser from "phaser"
import { SceneKeys, TextureKeys } from "./keys"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(TextureKeys.Pole, "assets/pole.png")
    this.load.image(TextureKeys.Ring, "assets/ring.png")
  }

  update() {
    if (sessionStorage.getItem("played")) {
      this.scene.start(SceneKeys.Game)
    } else {
      this.scene.start(SceneKeys.Practise)
    }
  }
}

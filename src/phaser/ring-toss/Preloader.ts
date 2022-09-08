import Phaser from "phaser"
import { AnimationKeys, SceneKeys, TextureKeys } from "./keys"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.atlas(
      TextureKeys.WoodPole,
      "assets/sprites/wood.png",
      "assets/sprites/wood.json"
    )

    this.load.image(TextureKeys.Ring, "assets/ring.png")
  }

  create() {
    this.anims.create({
      key: AnimationKeys.WoodPole,
      frames: this.anims.generateFrameNames(TextureKeys.WoodPole, {
        start: 3,
        end: 9,
        prefix: "wood-",
        suffix: ".png",
      }),
      frameRate: 12,
      delay: 175,
    })
  }

  update() {
    if (sessionStorage.getItem("played")) {
      this.scene.start(SceneKeys.Game)
    } else {
      this.scene.start(SceneKeys.Practise)
    }
  }
}

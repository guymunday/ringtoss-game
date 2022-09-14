import Phaser from "phaser"
import { AnimationKeys, SceneKeys, TextureKeys } from "./keys"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.setBaseURL("assets")
    this.load.image(TextureKeys.Shelf, "shelf.png")
    this.load.image(TextureKeys.Ring, "ring.png")
    this.load.atlas(
      TextureKeys.WoodPole,
      "sprites/wood.png",
      "sprites/wood.json"
    )
    this.load.atlas(
      TextureKeys.GoldPole,
      "sprites/gold.png",
      "sprites/gold.json"
    )
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
    this.anims.create({
      key: AnimationKeys.GoldPole,
      frames: this.anims.generateFrameNames(TextureKeys.GoldPole, {
        start: 3,
        end: 9,
        prefix: "gold-",
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

import Phaser from "phaser"
import { AnimationKeys, SceneKeys, TextureKeys } from "../models/keys"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(
      TextureKeys.Background,
      "/game-assets/bg_repeat_320x3137.png"
    )

    this.load.image(TextureKeys.BlackCar, "/game-assets/object_black-car.png")
    this.load.image(TextureKeys.BlueCar, "/game-assets/object_blue-car.png")
    this.load.image(TextureKeys.ChromeCar, "/game-assets/object_chrome-car.png")

    this.load.atlas(
      TextureKeys.LadyRacer,
      "/game-assets/lady.png",
      "/game-assets/lady.json"
    )
  }

  create() {
    this.anims.create({
      key: AnimationKeys.LadyForward,
      frames: this.anims.generateFrameNames(TextureKeys.LadyRacer, {
        start: 1,
        end: 1,
        prefix: "lady-forward-",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.LadyLeft,
      frames: this.anims.generateFrameNames(TextureKeys.LadyRacer, {
        start: 1,
        end: 1,
        prefix: "lady-left-",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.LadyRight,
      frames: this.anims.generateFrameNames(TextureKeys.LadyRacer, {
        start: 1,
        end: 1,
        prefix: "lady-right-",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.start(SceneKeys.Game)
  }
}

import Phaser from "phaser"
import { SceneKeys, TextureKeys, AnimationKeys } from "./key"

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(TextureKeys.Background, "assets/images/background.jpg")
    this.load.image(TextureKeys.Tiles, "assets/tilesets/petra_tiles_v1.png")

    this.load.tilemapTiledJSON(
      TextureKeys.Map,
      "assets/tilemaps/petra_map.json"
    )

    this.load.image(TextureKeys.Jewel, "assets/images/jewel.png")
    this.load.image(TextureKeys.Weed, "assets/images/weeds.png")
    this.load.image(TextureKeys.Temple, "assets/images/temple.png")

    this.load.atlas(
      TextureKeys.Coin,
      "assets/images/coin.png",
      "assets/images/coin.json"
    )

    this.load.atlas(
      TextureKeys.Runner,
      "assets/images/petra_runner.png",
      "assets/images/petra_runner.json"
    )

    this.load.image(TextureKeys.Boulder, "assets/images/boulder.png")
  }

  create() {
    this.anims.create({
      key: AnimationKeys.Coin,
      frames: this.anims.generateFrameNames(TextureKeys.Coin, {
        prefix: "coin-",
        suffix: ".png",
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.Run,
      frames: this.anims.generateFrameNames(TextureKeys.Runner, {
        prefix: "run-run-",
        suffix: ".png",
        start: 1,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: AnimationKeys.Jump,
      frames: [{ key: TextureKeys.Runner, frame: "run-jump-1.png" }],
      frameRate: 10,
    })
  }

  update() {
    this.scene.start(SceneKeys.Game)
  }
}

import * as Phaser from "phaser"
import { SceneKeys } from "./../models/keys"

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver)
  }

  create() {
    const { width, height } = this.scale

    const x = width * 0.5
    const y = height * 0.5

    this.add
      .text(x, y, "Game Over", {
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#000000",
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)

    if (this.input.activePointer.isDown) {
      this.scene.stop(SceneKeys.Game)
      this.scene.start(SceneKeys.Game)
    }

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.stop(SceneKeys.Game)
      this.scene.start(SceneKeys.Game)
    })
  }
}

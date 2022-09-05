import Phaser from "phaser"
import { TextureKeys } from "../models/keys"

export default class Opponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, )

    const opponent = scene.add.image(x, y, key).setOrigin(0, 0)

    this.add(opponent)
    scene.physics.add.existing(this, false)

    const body = this.body as Phaser.Physics.Arcade.Body

    if (key === TextureKeys.BlackCar) {
      body.setSize(body.width - 10, body.height + 70)
      body.setOffset(x + 6, y)
    } else if (key === TextureKeys.BlueCar) {
      body.setSize(body.width, body.height * 2 + 20)
      body.setOffset(x + 2, y)
    } else {
      body.setSize(body.width - 10, body.height * 2 + 30)
      body.setOffset(x + 7, y)
    }
  }
}

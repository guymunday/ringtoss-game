import Phaser from "phaser"

export default class Runner extends Phaser.Physics.Arcade.Sprite {
  public scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)

    this.scene = scene
    this.scene.physics.add.existing(this)
    this.scene.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(40, 85).setOffset(10, 30)
  }

  jump() {
    this.setVelocityY(-250)
  }

  run(speed: number) {
    this.setVelocityX(speed)
  }
}

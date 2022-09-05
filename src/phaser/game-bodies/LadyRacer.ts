import Phaser from "phaser"
import { AnimationKeys, TextureKeys } from "../models/keys"

export default class LadyRacer extends Phaser.GameObjects.Container {
  private ladyRacer: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.ladyRacer = scene.add
      .sprite(0, 0, TextureKeys.LadyRacer, "lady-forward-1.png")
      .setOrigin(0.5, 0.5)

    this.add(this.ladyRacer)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.ladyRacer.width - 20, this.ladyRacer.height)
    body.setOffset(-23, -this.ladyRacer.height / 2)
  }

  enableLeft(enabled: boolean) {
    enabled && this.ladyRacer.play(AnimationKeys.LadyLeft)
  }

  enableRight(enabled: boolean) {
    enabled && this.ladyRacer.play(AnimationKeys.LadyRight)
  }

  enableForward(enabled: boolean) {
    enabled && this.ladyRacer.play(AnimationKeys.LadyForward)
  }

  stopAnimation() {
    this.ladyRacer.anims.remove(AnimationKeys.LadyLeft)
    this.ladyRacer.anims.remove(AnimationKeys.LadyRight)
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.scene.input.activePointer?.isDown) {
      this.scene.physics.moveTo(
        this,
        this.scene.input.activePointer.position.x,
        this.scene.input.activePointer.position.y,
        150,
        400
      )
      if (
        this.scene.input.activePointer?.position.x >
        this.scene.scale.width / 2
      ) {
        this.enableRight(true)
      } else if (
        this.scene.input.activePointer?.position.x <
        this.scene.scale.width / 2
      ) {
        this.enableLeft(true)
      } else {
        this.enableForward(true)
      }
    } else {
      body.setAcceleration(0, 0)
      body.setVelocity(0, 0)
      this.enableForward(true)
    }
  }
}

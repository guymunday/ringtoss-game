import Phaser from "phaser"
import Game from "./Game"
import { TextureKeys } from "./keys"
import Practice from "./Practise"

export default class Ring extends Phaser.GameObjects.Container {
  public ring: Phaser.Physics.Arcade.Image
  private arrow: Phaser.GameObjects.Polygon
  public body: Phaser.Physics.Arcade.Body
  public scene: Game | Practice

  constructor(scene: Game | Practice) {
    super(scene)

    this.scene = scene
    const { width, height } = this.scene.scale

    const arrowData = [0, 20, 84, 20, 84, 0, 120, 50, 84, 100, 84, 80, 0, 80]
    this.arrow = this.scene.add
      .polygon(200, 200, arrowData, 0xffc351)
      .setAngle(-90)
      .setScale(0.2)
      .setVisible(false)
      .setOrigin(0, 0.5)
      .setDepth(98)

    this.ring = scene.physics.add
      .image(width / 2, height - 35, TextureKeys.Ring)
      .setScale(0.5, 0.5)
      .setDepth(99)

    this.body = this.ring.body as Phaser.Physics.Arcade.Body
    this.body.setOffset(0, 0).setSize(100, 90)

    this.moveLeft()
  }

  moveLeft() {
    this.body.setVelocityX(-100)
  }

  moveRight() {
    this.body.setVelocityX(100)
  }

  stop() {
    this.body.setVelocityX(0)
  }

  throw(throwDistance: number) {
    this.stop()
    this.body.setVelocityY(-throwDistance).setDragY(throwDistance)
    this.scene.attempts -= 1

    let timeline = this.scene.tweens.createTimeline()
    timeline
      .add({
        targets: this.ring,
        scale: 0.17,
        onStart: () => {
          this.arrow.alpha = 0
        },
        onComplete: () => {
          this.scene.throwDistance = 0
        },
      })
      .add({
        targets: [this.ring, this.arrow],
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.scene.tweens.killTweensOf(this.ring)
        },
      })
      .play()
  }

  preUpdate() {
    if (this.scene.input.activePointer.isDown) {
      this.arrow.setVisible(true)
      this.scene.tweens.add({ targets: this.arrow, scaleX: 1 })
    } else {
      this.arrow.setVisible(false)
    }

    this.arrow.setPosition(this.ring.x, this.ring.y - 25)
  }
}

import Phaser from "phaser"
import { AnimationKeys, SceneKeys, TextureKeys } from "./keys"
import Ring from "./Ring"

export default class Practise extends Phaser.Scene {
  private pole!: Phaser.Physics.Arcade.Image

  private ring!: Ring
  private rings!: Phaser.Physics.Arcade.Group

  public attempts!: number
  public throwDistance: number = 0
  private score: number = 0

  constructor() {
    super(SceneKeys.Practise)
  }

  preload() {}

  create() {
    const { width } = this.scale
    const halfWidth = width / 2

    this.attempts = 3

    this.pole = this.physics.add.sprite(
      halfWidth,
      120,
      TextureKeys.WoodPole,
      "wood-9.png"
    )
    this.pole.body.setSize(30, 30).setOffset(21, 25)

    this.rings = this.physics.add.group()
    this.ring = this.spawnRing()

    document.addEventListener("pointerup", () => {
      this.ring.throw(this.throwDistance)
      if (this.attempts >= 0) {
        this.ring = this.spawnRing()
      }
    })
  }

  private spawnRing() {
    const ring = new Ring(this)
    this.add.existing(ring)
    this.rings.add(ring, true)
    this.attempts % 2 === 0 ? ring.moveLeft() : ring.moveRight()

    this.physics.add.overlap(
      this.pole,
      this.ring,
      this.handleCollide,
      undefined,
      this
    )

    return ring
  }

  private handleCollide(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const ring = obj2 as Phaser.Physics.Arcade.Image

    if (ring.body.velocity.y > -100) {
      ring.body.enable = false
      this.anims.play(AnimationKeys.WoodPole, obj1)
      this.score += 1
      console.log(this.score)
    }
  }

  update() {
    if (this.ring.body.center.x > this.scale.width) {
      this.ring.moveLeft()
    } else if (this.ring.body.center.x < 0) {
      this.ring.moveRight()
    }

    if (this.input.activePointer.isDown) {
      this.ring.stop()
      this.throwDistance += 15
    }

    if (this.attempts < 0) {
      this.input.on(Phaser.Input.Events.POINTER_UP, () => {
        this.scene.start(SceneKeys.Preloader)
        sessionStorage.setItem("played", "true")
      })
    }
  }
}

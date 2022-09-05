import Phaser from "phaser"
import { SceneKeys, TextureKeys } from "./keys"
import Ring from "./Ring"

export default class Game extends Phaser.Scene {
  private polesBack!: Phaser.Physics.Arcade.Group
  private polesMiddle!: Phaser.Physics.Arcade.Group
  private polesFront!: Phaser.Physics.Arcade.Group

  private ring!: Ring
  private rings!: Phaser.Physics.Arcade.Group

  public attempts!: number
  public throwDistance: number = 0
  private score: number = 0

  constructor() {
    super(SceneKeys.Game)
  }

  preload() {}

  create() {
    const { width } = this.scale

    this.attempts = 10

    this.polesBack = this.physics.add.group()
    this.polesMiddle = this.physics.add.group()
    this.polesFront = this.physics.add.group()

    const polesBackArray = [5, 25, 5, 10, 5, 5]
    const polesMiddleArray = [10, 5, 10, 5]
    const polesFrontArray = [10, 5, 15]

    const halfWidth = width / 2

    // const polesBackPos = [
    //   halfWidth - 130,
    //   halfWidth - 65,
    //   halfWidth,
    //   halfWidth + 65,
    //   halfWidth + 130,
    // ]
    // const polesMiddlePos = [width / 4, (width / 4) * 3]

    const polesBackPos = [0, 75, 150, 225, 300, 375]
    const polesMiddlePos = [-150, 0, 150, 300]

    const polesFrontPos = [40, halfWidth, width - 40]

    polesBackArray.forEach((points, i) => {
      const pole = this.polesBack.create(
        polesBackPos[i],
        60,
        TextureKeys.Pole
      ) as Phaser.Physics.Arcade.Image
      pole.setScale(0.3).setData("points", `${points}`).setVelocityX(30)
      pole.body.setSize(60, 60).setOffset(46, 0)
    })

    polesMiddleArray.forEach((points, i) => {
      const pole = this.polesMiddle.create(
        polesMiddlePos[i],
        120,
        TextureKeys.Pole
      ) as Phaser.Physics.Arcade.Image
      pole
        .setScale(0.4)
        .setData("points", `${points}`)
        .setDepth(1)
        .setVelocityX(-20)
      pole.body.setSize(60, 60).setOffset(46, 0)
    })

    polesFrontArray.forEach((points, i) => {
      const pole = this.polesFront.create(
        polesFrontPos[i],
        180,
        TextureKeys.Pole
      ) as Phaser.Physics.Arcade.Image
      pole.setScale(0.45).setData("points", `${points}`).setDepth(2)
      pole.body.setSize(60, 60).setOffset(46, 0)
    })

    // const polesBackVel = -10
    // const polesMiddleVel = 10
    // const polesFrontVel = -20

    // this.polesBack.setVelocityX(polesBackVel)
    // this.polesMiddle.setVelocityX(polesMiddleVel)
    // this.polesFront.setVelocityX(polesFrontVel)

    // this.yoyoPoles(this.polesBack, polesBackVel, 2500)
    // this.yoyoPoles(this.polesMiddle, polesMiddleVel, 2500)
    // this.yoyoPoles(this.polesFront, polesFrontVel, 3500)

    // TODO: loop poles instead of back and forth

    this.rings = this.physics.add.group()
    this.ring = this.spawnRing()

    // this.input.on(Phaser.Input.Events.POINTER_UP, () => {
    //   this.ring.throw(this.throwDistance)
    //   if (this.attempts >= 0) {
    //     this.ring = this.spawnRing()
    //   }
    // })

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
      [this.polesBack, this.polesMiddle, this.polesFront],
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
    const ring = obj1 as Phaser.Physics.Arcade.Image

    if (ring.body.velocity.y > -100) {
      ring.body.enable = false
      this.score += parseInt(obj2.data.values.points, 10)
      console.log(this.score, obj2.data.values.points)
    }
  }

  private makePointsText(poles: Phaser.Physics.Arcade.Group, depth: number) {
    poles.children.entries.forEach((obj) => {
      const pole = obj as Phaser.Physics.Arcade.Image
      const points = pole.data.values.points

      const text = this.add
        .text(pole.x - 13, pole.y, `${points}`.padStart(2, "0"), {
          color: "#f2f2f2",
          backgroundColor: "brown",
          fontSize: "18px",
          fontFamily: "monospace",
        })
        .setPadding(2)
        .setDepth(depth)

      setTimeout(() => {
        text.destroy(true)
      }, 0.01)
    })
  }

  // private yoyoPoles(
  //   poles: Phaser.Physics.Arcade.Group,
  //   velocityX: number,
  //   duration: number = 5000
  // ) {
  //   let velX = velocityX

  //   poles && poles.setVelocityX(velX)

  //   setInterval(() => {
  //     velX = -velX
  //     poles && poles.setVelocityX(velX)
  //   }, duration)
  // }

  private loopBackPoles(poles: Phaser.Physics.Arcade.Group) {
    poles.children.entries.forEach((p) => {
      const pole = p as Phaser.Physics.Arcade.Image
      if (pole.x >= 375) {
        pole.setPosition(-75, 60)
      }
    })
  }

  private loopMiddlePoles(poles: Phaser.Physics.Arcade.Group) {
    poles.children.entries.forEach((p) => {
      const pole = p as Phaser.Physics.Arcade.Image
      if (pole.x <= -150) {
        pole.setPosition(450, 120)
      }
    })
  }

  update() {
    this.makePointsText(this.polesBack, 0)
    this.makePointsText(this.polesMiddle, 1)
    this.makePointsText(this.polesFront, 2)

    if (this.ring.body.center.x > this.scale.width) {
      this.ring.moveLeft()
    } else if (this.ring.body.center.x < 0) {
      this.ring.moveRight()
    }

    if (this.input.activePointer.isDown) {
      this.ring.stop()
      this.throwDistance += 7.5
    }

    this.loopBackPoles(this.polesBack)
    this.loopMiddlePoles(this.polesMiddle)
  }
}

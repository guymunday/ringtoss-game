import Phaser from "phaser"
import { SceneKeys } from "./../models/keys"
import LadyRacer from "../game-bodies/LadyRacer"
import Opponent from "../game-bodies/Opponent"
import { TextureKeys } from "../models/keys"

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite
  private backgroundSpeed!: number

  private ladyRacer!: LadyRacer
  private ladyRacerBody!: Phaser.Physics.Arcade.Body

  private cars!: Phaser.Physics.Arcade.Group
  private carsArray: Opponent[] = []
  private carsToCreate: number = 3

  private gameOver!: boolean

  constructor() {
    super(SceneKeys.Game)
  }

  preload() {}

  create() {
    this.backgroundSpeed = 1
    this.gameOver = false

    const width = this.scale.width
    const height = this.scale.height

    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0)

    this.ladyRacer = new LadyRacer(this, width * 0.5, height - 160)
    this.add.existing(this.ladyRacer)

    this.ladyRacerBody = this.ladyRacer.body as Phaser.Physics.Arcade.Body
    this.ladyRacerBody.setCollideWorldBounds(true)

    this.cars = this.physics.add.group()

    this.time.addEvent({
      callback: this.createCars,
      callbackScope: this,
      delay: 2500,
      loop: true,
    })

    this.time.addEvent({
      callback: () => (this.carsToCreate += 1),
      callbackScope: this,
      delay: 10000,
      repeat: 1,
    })

    this.physics.world.setBounds(0, 0, width, height)
  }

  private listenToPosition(
    obj1: Phaser.Physics.Arcade.Body,
    obj2: Phaser.Physics.Arcade.Body
  ) {
    let hasPassed = false

    setInterval(() => {
      if (!hasPassed && obj1.position.y < obj2.position.y) {
        !this.gameOver && console.log("passed")
        hasPassed = true
      }
    }, 500)
  }

  private createCars() {
    let carsToCreate = Math.floor(Math.random() * this.carsToCreate)

    const xPos = [0, 31.75, 63.5, 95.25, 127]
    const shuffledXPos = xPos.sort(() => Math.random() - 0.5)
    const y = Phaser.Math.Between(-100, -150)

    for (let i = 0; i < (carsToCreate === 0 ? 1 : carsToCreate); i++) {
      const cars = [
        TextureKeys.BlackCar,
        TextureKeys.BlueCar,
        TextureKeys.ChromeCar,
      ]

      let randomIndexCars = Math.floor(Math.random() * 3)

      const opp = new Opponent(this, shuffledXPos[i], y, cars[randomIndexCars])
      this.add.existing(opp)
      this.cars.add(opp)
      this.carsArray.push(opp)
      const oppBody = opp.body as Phaser.Physics.Arcade.Body
      oppBody
        .setBounce(0.5, 0.5)
        .setVelocity(0, 50 * (this.backgroundSpeed * 2))

      this.physics.add.collider(
        this.ladyRacer,
        opp,
        this.handleCollision,
        undefined,
        this
      )

      this.listenToPosition(this.ladyRacerBody, oppBody)
    }
    this.physics.add.collider(this.cars, this.cars)
  }

  private handleCollision() {
    console.log("game over")

    this.time.removeAllEvents()
    this.gameOver = true

    this.cars.children.each((child) => {
      this.tweens.add({
        targets: child,
        alpha: 0,
        duration: 1000,
        ease: "Power2",
      })
      this.tweens.add({
        targets: this.ladyRacer,
        angle: 1080,
        duration: 1500,
      })
      this.tweens.add({
        targets: [this.background, this.ladyRacer],
        alpha: 0,
        duration: 1500,
        delay: 1000,
        onComplete: () => this.scene.run(SceneKeys.GameOver),
      })
    })
  }

  getFaster() {
    this.backgroundSpeed += 0.01
  }

  // t: number, dt: number
  update() {
    this.getFaster()
    this.background.tilePositionY -= this.backgroundSpeed
  }
}

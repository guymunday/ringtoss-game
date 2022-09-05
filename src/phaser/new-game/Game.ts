import Phaser from "phaser"
import { AnimationKeys, LayerKeys, SceneKeys, TextureKeys } from "./key"
import Runner from "./Runner"

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image

  private coins!: Phaser.Physics.Arcade.Group
  private runner!: Runner
  private boulder!: Phaser.Physics.Arcade.Image

  private score!: number
  private scoreLabel!: Phaser.GameObjects.Text

  private jewels!: Phaser.Physics.Arcade.Group
  private jewelsScore!: number

  private weeds!: Phaser.Physics.Arcade.Group
  private inWeeds: boolean = false

  private temple!: Phaser.Physics.Arcade.Group

  private speed!: number
  private boulderSpeed!: number
  private gameOver!: boolean

  constructor() {
    super(SceneKeys.Game)
  }

  preload() {}

  create() {
    this.score = 0
    this.jewelsScore = 0

    this.speed = 100
    this.boulderSpeed = 100
    this.gameOver = false

    this.background = this.add
      .image(0, 0, TextureKeys.Background)
      .setScrollFactor(0)
      .setOrigin(0)

    const map = this.make.tilemap({ key: TextureKeys.Map })
    const tileset = map.addTilesetImage("petra_tiles_v1", TextureKeys.Tiles) // param 1 same as file name
    map.createLayer(LayerKeys.Decor, tileset, 0, 0)
    const platforms = map.createLayer(LayerKeys.Platforms, tileset, 0, 0)
    map.createLayer(LayerKeys.Decor, tileset, 0, 0)

    platforms.setCollisionByExclusion([-1], true)

    this.coins = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    })

    map.getObjectLayer(LayerKeys.Coins).objects.forEach((coin) => {
      const coinSprite = this.coins.create(
        coin.x && coin.x + 23,
        coin.y && coin.y - 23,
        TextureKeys.Coin
      ) as Phaser.Physics.Arcade.Sprite
      coinSprite.body.setSize(31, 31)

      coinSprite.play(AnimationKeys.Coin, true)
    })

    this.temple = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    })

    map.getObjectLayer(LayerKeys.Temple).objects.forEach((temple) => {
      this.temple.create(
        temple.x && temple.x + 85.5,
        temple.y && temple.y - 100,
        TextureKeys.Temple
      ) as Phaser.Physics.Arcade.Sprite
    })

    this.jewels = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    })

    map.getObjectLayer(LayerKeys.Jewels).objects.forEach((jewel) => {
      const jewelSprite = this.jewels.create(
        jewel.x && jewel.x + 23,
        jewel.y && jewel.y - 23,
        TextureKeys.Jewel
      ) as Phaser.Physics.Arcade.Sprite
      jewelSprite.body.setSize(31, 31)
    })

    this.randomiseJewels()

    this.weeds = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    })

    map.getObjectLayer(LayerKeys.Weeds).objects.forEach((weed) => {
      const weedSprite = this.weeds.create(
        weed.x && weed.x + 24,
        weed.y && weed.y - 24,
        TextureKeys.Weed
      ) as Phaser.Physics.Arcade.Sprite
      weedSprite.body.setSize(48, 20).setOffset(0, 30)
    })

    this.runner = new Runner(this, 0, 800, TextureKeys.Runner)
    this.add.existing(this.runner)

    this.physics.add.collider(this.runner, platforms)

    this.cameras.main.startFollow(this.runner)
    this.cameras.main.setBounds(
      0,
      0,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    )

    this.physics.add.overlap(
      this.runner,
      this.coins,
      this.collectCoins,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.runner,
      this.jewels,
      this.collectJewels,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.runner,
      this.weeds,
      this.weedCollision,
      undefined,
      this
    )

    this.boulder = this.physics.add
      .image(-400, this.runner.y, TextureKeys.Boulder)
      .setScale(1.5)

    const boulderBody = this.boulder.body as Phaser.Physics.Arcade.Body
    boulderBody.setAllowGravity(false).setDrag(150, 0)

    this.tweens.add({
      targets: this.boulder,
      angle: 360,
      repeat: -1,
      duration: 1000,
    })

    this.physics.add.overlap(
      this.runner,
      this.boulder,
      this.boulderCollision,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.runner,
      this.temple,
      this.reachTemple,
      undefined,
      this
    )

    this.scoreLabel = this.add
      .text(500, 10, `Coins: ${this.score}`, {
        fontSize: "20px",
        color: "#080808",
        backgroundColor: "#f8e71c",
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setScrollFactor(0)
  }

  private randomiseJewels() {
    let jewelsToHide = []

    while (jewelsToHide.length < 3) {
      const index = Math.floor(Math.random() * 7)
      if (jewelsToHide.indexOf(index) === -1) jewelsToHide.push(index)
    }

    jewelsToHide.forEach((j) => {
      const jewel = this.jewels.children.entries[j]
        .body as Phaser.Physics.Arcade.Body
      jewel.enable = false
      this.jewels.killAndHide(this.jewels.children.entries[j])
    })
  }

  private collectCoins(
    _obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const coin = obj2 as Phaser.Physics.Arcade.Sprite
    coin.body.enable = false

    this.tweens.add({
      targets: coin,
      x: this.runner.x + 500,
      y: this.runner.y - 180,
      scale: 0,
      duration: 1000,
      onComplete: () => {
        this.coins.killAndHide(coin)
        this.score += 1
        this.scoreLabel.text = `Coins: ${this.score}`
      },
    })
  }

  private collectJewels(
    _obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const jewel = obj2 as Phaser.Physics.Arcade.Sprite
    jewel.body.enable = false

    this.tweens.add({
      targets: jewel,
      x: this.runner.x - 500,
      y: this.runner.y - 180,
      scale: 0,
      duration: 1000,
      onComplete: () => {
        this.jewels.killAndHide(jewel)
        this.jewelsScore += 1
        console.log(this.jewelsScore, this.gameOver)
      },
    })
  }

  private boulderCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.gameOver = true
    console.log("GAME OVER 💀")

    const runner = obj1 as Phaser.Physics.Arcade.Sprite
    const boulder = obj2 as Phaser.Physics.Arcade.Image

    boulder.body.enable = false
    runner.body.enable = false
    this.cameras.main.stopFollow()

    this.tweens.add({ targets: boulder, x: boulder.x + 1000, duration: 3500 })

    let timeline = this.tweens.createTimeline()
    timeline
      .add({ targets: runner, scaleY: 0.1, y: runner.y + 50 })
      .add({ targets: runner, alpha: 0, offset: "-=200" })
      .play()
  }

  private weedCollision(
    _obj1: Phaser.GameObjects.GameObject,
    _obj2: Phaser.GameObjects.GameObject
  ) {
    if (this.inWeeds) {
      return
    } else {
      this.inWeeds = true
      this.speed -= 60

      setTimeout(() => {
        this.inWeeds = false
        this.speed += 60
      }, 1000)
    }
  }

  private reachTemple(
    obj1: Phaser.GameObjects.GameObject,
    _obj2: Phaser.GameObjects.GameObject
  ) {
    this.gameOver = true
    console.log("WINNER! 🥳")

    const runner = obj1 as Phaser.Physics.Arcade.Sprite

    runner.body.enable = false
    this.boulder.body.enable = false

    this.tweens.add({
      targets: runner,
      alpha: 0,
      scale: 0.6,
      x: runner.x + 85,
      duration: 1000,
    })
  }

  update() {
    if (!this.gameOver) {
      this.background.x -= this.runner.body.velocity.x / 150
    }

    const runnerBody = this.runner.body as Phaser.Physics.Arcade.Body

    if (this.input.activePointer?.isDown && runnerBody.onFloor()) {
      this.runner.jump()
    } else {
      this.runner.run(this.speed)
    }

    if (!runnerBody.onFloor()) {
      this.runner.play(AnimationKeys.Jump, true)
    } else {
      this.runner.play(AnimationKeys.Run, true)
    }

    this.physics.moveTo(
      this.boulder,
      this.runner.x,
      this.runner.y,
      this.boulderSpeed
    )
  }
}

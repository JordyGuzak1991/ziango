/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'
import Mushroom from '../sprites/Mushroom'
import Ball from '../sprites/Ball'
import Crosshair from '../sprites/Crosshair'

export default class extends Phaser.State {
  init () {
    this.nrOfBalls = 2
    this.deltaTime = 0
    this.canShoot = true
    this.force = 0
    this.forceIncreaseRate = 5000
    this.maxForce = 5000
    this.maxShootingVelocity = 20
    this.score = 0
    this.scoreText
    this.message
    this.ballsHit = []
  }
  preload () {}

  create () {
    // Enable p2 physics
    this.game.physics.startSystem(Phaser.Physics.P2JS)

    // Enable impact callbacks
    this.game.physics.p2.setImpactEvents(true)

    // Make things a bit more bouncey
    this.game.physics.p2.restitution = 0.8

    // Create collision groups
    let whiteballCollisionGroup = this.game.physics.p2.createCollisionGroup()
    let ballsCollisionGroup = this.game.physics.p2.createCollisionGroup()

    // This part is vital to make objects with their own collision groups still collide with the world bounds
    this.game.physics.p2.updateBoundsCollisionGroup()

    // Create white ball
    this.whiteBall = new Ball({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'white-ball',
      scale: config.scaleRatio / 6
    })

    this.whiteBall.body.setCollisionGroup(whiteballCollisionGroup)
    this.whiteBall.body.collides(ballsCollisionGroup, this.onHitBall, this)

    // Create other balls
    this.ballsGroup = this.game.add.group()

    for(let i = 0; i < this.nrOfBalls; i++)
    {
      let randomPosition = this.getRandomPosition()
      let asset = this.game.math.isEven(i) ? 'red-ball' : 'orange-ball'

      let ball = new Ball({
        game: this.game,
        x: randomPosition.x,
        y: randomPosition.y,
        asset: asset,
        scale: (asset == 'orange-ball') ? config.scaleRatio / 2 : config.scaleRatio
      })
      
      ball.body.setCollisionGroup(ballsCollisionGroup)
      ball.body.collides([ballsCollisionGroup, whiteballCollisionGroup])

      this.ballsGroup.add(ball)
    }

    // Create crosshair
    this.crosshair = new Crosshair({
      game: this.game,
      x: this.game.input.activePointer.x,
      y: this.game.input.activePointer.y,
      asset: 'crosshair'
    })

    // Text to display score
    this.scoreText = this.add.text(this.world.centerX, 50, "Score: 0 ", {
      font: '40px Bangers',
      fill: '#0081a6',
      smoothed: false
    })

    this.scoreText.anchor.setTo(0.5)

    // Text to display message
    this.message = this.add.text(this.world.centerX, this.world.centerY, "", {
      font: '50px Bangers',
      fill: '#0081a6',
      smoothed: false
    })

    this.message.anchor.setTo(0.5)

    this.line = new Phaser.Line(0, 0, 0, 0)

    this.game.input.onDown.add(this.click, this)
    this.game.input.onUp.add(this.release, this)
    this.game.input.addMoveCallback(this.move, this)
  }

  update() {
    this.deltaTime = this.game.time.elapsed / 1000

    // Increase force over time when holding down
    if (this.game.input.activePointer.isDown && this.canShoot) {
      this.increaseForce()
    }

    if (Math.abs(this.whiteBall.body.velocity.x) < this.maxShootingVelocity && Math.abs(this.whiteBall.body.velocity.y) < this.maxShootingVelocity) {
      this.canShoot = true
    }
  }

  render () {
    if (this.canShoot) this.drawLine()
    this.game.debug.text("Force: " + this.force, 50, 50)
    this.game.debug.text("Velocity x: " + this.whiteBall.body.velocity.x, 50, 75)
    this.game.debug.text("Velocity y: " + this.whiteBall.body.velocity.y, 50, 100)
  }

  click(pointer) {
    this.ballsHit = []
  }

  release(pointer) {
    if (this.canShoot) {
      this.shoot()
      this.canShoot = false
    }
  }

  move(pointer, x, y, isDown) {
    this.crosshair.body.x = x
    this.crosshair.body.y = y
  }

  drawLine() {
    this.line.setTo(this.whiteBall.body.x, this.whiteBall.body.y, this.crosshair.body.x, this.crosshair.body.y)
    this.game.debug.geom(this.line, '#0081a6')
  }

  onHitBall(body1, body2) {
    // exit when hitting the same ball
    if (this.ballsHit.includes(body2)) return

    // add ball to array
    this.ballsHit.push(body2)

    // increase score when both balls were hit
    if (this.ballsHit.length == 2) {
      this.addScore()
    }
  }

  shoot() {
    let newVelocity = Phaser.Point.subtract(this.crosshair.position, this.whiteBall.position).normalize().setMagnitude(this.force)
    this.whiteBall.body.velocity.x = newVelocity.x
    this.whiteBall.body.velocity.y = newVelocity.y
    this.force = 0
  }

  increaseForce() {
    if (this.force < this.maxForce) {
      this.force += this.forceIncreaseRate * this.deltaTime
    } else {
      this.force = this.maxForce
    }
  }

  addScore() {
    this.score++
    this.scoreText.text = "Score: " + this.score + " "
    this.message.text = "Nice! "
    this.reset(2000)
  }

  reset(delay) {
    let self = this

    // reset after x milliseconds
    setTimeout(function() {
      // reset position and velocity of white ball
      self.whiteBall.body.reset(self.world.centerX, self.world.centerY)
      // reset position and velocity of other balls
      self.ballsGroup.forEach(function(ball) {
        let randomPosition = self.getRandomPosition()
        ball.body.reset(randomPosition.x, randomPosition.y)
      })

      //reset message text
      self.message.text = ""
    }, delay)
  }

  getRandomPosition() {
    return {x: this.game.rnd.between(50, config.gameWidth -50), y: this.game.rnd.between(50, config.gameHeight -50)}
  }
}

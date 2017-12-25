import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    // load assets
    this.load.image('white-ball', 'assets/images/white-ball.png');
    this.load.image('orange-ball', 'assets/images/orange-ball.png');
    this.load.image('red-ball', 'assets/images/red-ball.png');
    this.load.spritesheet('crosshair', 'assets/images/crosshairs.png', 200, 200)
  }

  create () {
    this.state.start('Game')
  }
}

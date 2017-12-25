import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
    constructor ({game, x, y, asset}) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.scale.setTo(config.scaleRatio(), config.scaleRatio())
        game.physics.p2.enable(this)
        this.body.static = true
        this.body.setCircle(10)
        this.body.data.shapes[0].sensor = true
        game.add.existing(this)
    }
}
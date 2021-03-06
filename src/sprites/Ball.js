import Phaser from 'phaser'

export default class extends Phaser.Sprite {
    constructor ({game, x, y, asset, scale}) {
        super(game, x, y, asset)
        this.anchor.setTo(0.5)
        this.scale.setTo(scale, scale)
        this.game.physics.p2.enable(this)
        console.log(scale)
        this.body.setCircle(this.width / 2);
        this.body.damping = 0.5
        this.game.add.existing(this)
    }
}
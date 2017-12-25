export default {
  gameWidth: window.innerWidth * window.devicePixelRatio,
  gameHeight: window.innerHeight * window.devicePixelRatio,
  aspectRatio: window.innerWidth * window.devicePixelRatio / window.innerHeight * window.devicePixelRatio,
  localStorageName: 'phaseres6webpack',
  scaleRatio: function() {return this.aspectRatio > 1 ? this.gameHeight / 2048 : this.gameWidth / 2048 } 
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1200,
  heigth: 960,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
    },
  }
};

const game = new Phaser.Game(config);

// Load all nedded assets to generate map
function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('tiles', 'assets/platformPack_tilesheet.png');
  this.load.image('spike', 'assets/spike.png');
  this.load.tilemapTiledJSON('map', 'assets/level.json');
  this.load.image('player', 'assets/mario.png');
}

function create() {
  // Setup world
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
  const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
  backgroundImage.setScale(1.5, 0.8);
  const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
  platforms.setCollisionByExclusion(-1, true);

  // Setup player
  this.cursors = this.input.keyboard.createCursorKeys();
  this.player = this.physics.add.sprite(10, 300, 'player');
  this.physics.add.collider(this.player, platforms);
  this.player.setCollideWorldBounds(true);
  
  // Add spikes and collision
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });
  map.getObjectLayer('Spikes').objects.forEach((spike) => {
    const spikeSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
    spikeSprite.body.setSize(spike.width - 10, spike.height - 30).setOffset(10, 30);
  });
  this.physics.add.collider(this.player, this.spikes, collisionPlayer, null, this);

  
}

// Collision -> set player at the beginning
function collisionPlayer(player) {
  player.setVelocity(0, 0);
  player.setX(50);
  player.setY(300);
}

function update() {
  // Go right or left or stay in place
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-150);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(150);  
  } else {
    this.player.setVelocityX(0);
  }

  if (this.cursors.up.isDown && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
  }
}


TASK: Use the following goal to create proposed use cases in `1-USE-CASES-PROPOSED.md`. Then, after review and approval, formalise them into `1-USE-CASES.md` for pipeline delivery.

# Goal

Create a Super Mario Brothers web-based platformer game that faithfully recreates the core gameplay mechanics of the original NES title, while using only legally permissible assets and code. The game should capture the feel of classic Mario platforming — precise jumping, enemy interactions, power-ups, and level progression.

---

## Web-Based 2D Platformer Game Specifications

### **Project Overview**
A faithful recreation of classic platformer mechanics—player movement, jumping, enemy interaction, power-ups, and level progression—built from scratch using JavaScript and open-source tools. The focus is on recreating the *gameplay experience*, not copying copyrighted assets.

---

## **1. Technical Architecture**

### **Core Stack**
- **Game Engine**: [Phaser 3](https://phaser.io/) (open-source HTML5 game framework)
- **Language**: JavaScript (ES6+)
- **Graphics**: Canvas 2D API with custom sprite sheets
- **Physics**: Arcade physics engine (built into Phaser)
- **Audio**: Web Audio API or open-source sound libraries

### **Project Structure**
```
mario-platformer/
├── index.html
├── assets/
│   ├── sprites/          (player, enemies, items, tiles)
│   ├── audio/            (sound effects, background music)
│   └── levels/           (level data in JSON or Tiled format)
├── src/
│   ├── main.js           (game initialization)
│   ├── scenes/
│   │   ├── BootScene.js      (preload assets)
│   │   ├── MenuScene.js      (main menu)
│   │   ├── GameScene.js      (main gameplay)
│   │   └── GameOverScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Item.js
│   │   └── Platform.js
│   ├── managers/
│   │   ├── LevelManager.js
│   │   ├── CollisionManager.js
│   │   └── UIManager.js
│   └── utils/
│       ├── Constants.js
│       └── Helpers.js
├── config.js
└── README.md
```

---

## **2. Core Gameplay Mechanics**

### **Player Character**
- **Movement**: Left/right controls (A/D or Arrow keys)
- **Jumping**: Space bar or W key; variable jump height based on button hold duration
- **States**: Idle, running, jumping, falling, power-up active, invincible, dead
- **Animations**: Walk cycle (4–6 frames), jump, fall, death

### **Physics**
- Gravity: ~500 pixels/sec² (tunable)
- Jump velocity: ~350 pixels/sec
- Max horizontal speed: ~200 pixels/sec
- Acceleration/deceleration for smooth movement

### **Enemy Types** (suggest 2–3 core types)
1. **Basic Goomba-style enemy**
   - Walks left/right, turns at platform edges
   - Can be defeated by jumping on top or using power-ups
   - Speed: ~80 pixels/sec

2. **Koopa Troopa-style enemy**
   - Similar to Goomba but retreats into shell when jumped on
   - Shell can be kicked and becomes a projectile
   - Optional: throws projectiles

3. **Spike/Hazard obstacles**
   - Stationary or moving on tracks
   - Instant damage (can add invincibility frames)

### **Collectibles**
- **Coins**: +10 points, sound effect on collection
- **Star/Invincibility**: 5–10 second invincibility period
- **Mushroom/Size-up**: Increases player size (visual change, collision adjustment)
- **Fire Flower**: Enables projectile attacks for 10–15 seconds

### **Level Progression**
- **8–10 levels** with increasing difficulty
- Each level has a defined goal (e.g., reach the flag/goal)
- Time limit (optional): 300–500 seconds per level
- Lives system: 3–5 lives, lose one on enemy contact or hazard

---

## **3. Level Design**

### **Level Features**
- **Platforms**: Static, moving, breakable, disappearing
- **Gaps**: Require precise jumping to cross
- **Height variation**: Multi-tier design encouraging exploration
- **Hazards**: Pits, spikes, lava (instant death or damage)
- **Secrets**: Hidden blocks or pipes leading to bonus areas

### **Level Editor/Format**
Use **Tiled Map Editor** (free, open-source):
- Export levels as `.tmx` (XML) or `.json`
- Phaser has built-in support for Tiled maps
- Alternatively, manually define levels in JSON arrays

### **Sample JSON Level Structure**
```json
{
  "level": 1,
  "width": 2400,
  "height": 600,
  "timeLimit": 300,
  "playerStart": { "x": 50, "y": 500 },
  "goal": { "x": 2300, "y": 500 },
  "platforms": [
    { "x": 0, "y": 550, "width": 400, "height": 50, "type": "static" },
    { "x": 500, "y": 450, "width": 150, "height": 50, "type": "static" }
  ],
  "enemies": [
    { "x": 600, "y": 500, "type": "goomba", "direction": 1 }
  ],
  "items": [
    { "x": 750, "y": 400, "type": "coin" }
  ]
}
```

---

## **4. Game States & UI**

### **Game States**
- **Boot**: Load assets
- **Menu**: Title screen, level select, options
- **Playing**: Active gameplay
- **Paused**: Game paused, resume/quit options
- **Level Complete**: Victory screen, stats, next level button
- **Game Over**: Game over message, restart or menu option

### **HUD Elements**
- Score (top-left)
- Lives remaining (top-left)
- Time remaining (top-center)
- Current level (top-right)
- Health/power-up indicator (if applicable)
- Mini-map (optional, for larger levels)

---

## **5. Collision & Interaction System**

### **Collision Types**
- **Player ↔ Platform**: Stop downward motion (landing)
- **Player ↔ Enemy**: Damage or defeat enemy (if on top)
- **Player ↔ Projectile**: Take damage or defeat projectile
- **Player ↔ Item**: Collect and apply effect
- **Player ↔ Hazard**: Instant damage or death
- **Enemy ↔ Platform**: Constrain movement
- **Projectile ↔ Platform**: Destroy projectile

### **Collision Manager Pattern**
```javascript
// Pseudo-code structure
class CollisionManager {
  checkPlayerPlatform(player, platforms) { }
  checkPlayerEnemy(player, enemies) { }
  checkProjectileEnemy(projectile, enemies) { }
  checkPlayerItem(player, items) { }
  checkPlayerHazard(player, hazards) { }
}
```

---

## **6. Sound & Audio**

### **Recommended Free Audio Sources**
- [Freesound.org](https://freesound.org/) – CC0/CC-BY licensed sound effects
- [OpenGameArt.org](https://opengameart.org/) – Retro 8-bit/16-bit music and SFX
- [Incompetech](https://incompetech.com/) – Royalty-free music (CC-BY or public domain)
- [Bensound](https://www.bensound.com/) – Royalty-free background music

### **Sound Effects to Implement**
- Jump, landing
- Coin collection
- Enemy defeat
- Power-up activation
- Damage taken
- Level complete/fanfare
- Game over

### **Background Music**
- One track per level or a single loop (2–3 minutes)
- Upbeat, retro chiptune style recommended
- Should loop seamlessly

---

## **7. Asset Creation & Graphics**

### **Sprite Sheet Guidelines**
- **Resolution**: 16×16 or 32×32 pixels per sprite (for retro feel)
- **Tile size**: Match sprite size (e.g., 32×32 for level tiles)
- **Animations**: 4–8 frames per action
- **Color palette**: Limit to 8–16 colors for authentic retro style

### **Free Asset Sources** (Legal & Open)
1. **[Kenney.nl](https://kenney.nl/assets)** – CC0 platformer packs, tilesets, sprites
2. **[OpenGameArt.org](https://opengameart.org/)** – Filter by CC0 license; many retro packs available
3. **[Open Pickle Project](https://www.openpixelproject.com/)** – 2,000+ public domain tiles and sprites
4. **[Screaming Brain Studios](https://screamingbrainstudios.com/)** – 25,000+ CC0 retro assets
5. **[itch.io](https://itch.io/game-assets/free/tag-pixel-art)** – Search "CC0" or "public domain" for pixel art
6. **[Sprite Fusion](https://www.spritefusion.com/tilesets)** – Free retro tileset collections

### **Creating Your Own Sprites**
If you want full control, use free pixel art tools:
- **[Aseprite](https://www.aseprite.org/)** – Paid but powerful ($19.99)
- **[LibreSprite](https://libresprite.github.io/)** – Free, open-source fork of Aseprite
- **[Piskel](https://www.piskelapp.com/)** – Free web-based pixel art editor
- **[Krita](https://krita.org/)** – Free, full-featured digital art tool

---

## **8. Learning Resources**

### **Phaser Tutorials & Documentation**
- [Phaser Official Tutorials](https://phaser.io/tutorials) – Step-by-step guides
- [Phaser API Documentation](https://photonstorm.github.io/phaser3-docs/) – Complete reference
- [Phaser Examples](https://labs.phaser.io/) – Runnable code examples
- [YouTube: Making Your First Phaser 3 Game](https://www.youtube.com/watch?v=ZqMYk-n7NtY) – Video walkthrough

### **Game Development Concepts**
- [Game Programming Patterns](https://gameprogrammingpatterns.com/) – Design patterns for games
- [Red Blob Games](https://www.redblobgames.com/) – Interactive explanations of game dev concepts
- [MDN Web Docs: Game Development](https://developer.mozilla.org/en-US/docs/Games) – Web game development guide

### **Level Design**
- [Tiled Map Editor](https://www.mapeditor.org/) – Free level editor (tutorial on Phaser site)
- [Level Design Theory](https://www.youtube.com/c/ExtraCredits) – Extra Credits video series on game design

### **Pixel Art & Asset Creation**
- [Pixel Art Tutorial](https://www.youtube.com/watch?v=lfR7UHkxKzg) – Introduction to pixel art
- [LibreSprite Documentation](https://libresprite.github.io/docs/) – Free sprite editor guide

---

## **9. Roadmap & Milestones**

### **Phase 1: MVP (Weeks 1–2)**
- [ ] Phaser project setup
- [ ] Player movement and jumping mechanics
- [ ] Basic platform collision
- [ ] One test level (5–6 platforms)
- [ ] Simple score system

### **Phase 2: Enemies & Hazards (Week 2–3)**
- [ ] Implement 2 enemy types
- [ ] Enemy-player collision (defeat/damage)
- [ ] Hazards (pits, spikes)
- [ ] Player lives system
- [ ] Game over state

### **Phase 3: Items & Power-ups (Week 3–4)**
- [ ] Coin collection
- [ ] Star (invincibility)
- [ ] Mushroom (size-up)
- [ ] Fire Flower (projectiles)
- [ ] HUD updates

### **Phase 4: Level Design (Week 4–5)**
- [ ] Create 5–8 full levels
- [ ] Level progression system
- [ ] Level editor setup (Tiled or JSON)
- [ ] Win/complete level state

### **Phase 5: Polish & Audio (Week 5–6)**
- [ ] Sound effects integration
- [ ] Background music
- [ ] Menu system
- [ ] Animations (smoke, effects)
- [ ] Performance optimization

### **Phase 6: Expansion (Week 6+)**
- [ ] Additional levels
- [ ] Boss fights
- [ ] New enemy types
- [ ] Alternate game modes
- [ ] Leaderboard (local storage or backend)

---

## **10. Important Legal & Ethical Notes**

### **What You CAN Do**
✅ Create original sprites and graphics inspired by the retro platformer style  
✅ Use freely-licensed assets (CC0, MIT, open source)  
✅ Recreate core gameplay mechanics (jumping, platforms, enemies)  
✅ Name your game something original (not "Super Mario Bros")  
✅ Distribute your game for free or profit (if using only legal assets)

### **What You CANNOT Do**
❌ Use Nintendo's Mario sprites, textures, or character designs  
❌ Use Nintendo's copyrighted music or sound effects  
❌ Copy Nintendo's code or proprietary algorithms  
❌ Use the official "Mario" name or branding  
❌ Reproduce or adapt copyrighted content without permission

---

## **Quick Start Example**

Here's a minimal Phaser 3 platformer to get you started:

```javascript
// main.js
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let player, platforms, cursors;

function preload() {
  // Load your free assets here
  // this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');

  player = this.physics.add.sprite(100, 450, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
```

---

## **Summary**

This spec provides a comprehensive blueprint for building a web-based 2D platformer inspired by classic Mario gameplay, while maintaining full legal and ethical compliance. The recommended tech stack (Phaser 3, open-source assets, standard web APIs) is well-documented and beginner-friendly, making it perfect for learning game development.

**Key Resources:**
- Game Engine: [Phaser 3](https://phaser.io/)
- Free Assets: [Kenney.nl](https://kenney.nl/), [OpenGameArt.org](https://opengameart.org/)
- Reference: [Mario Wiki](https://www.mariowiki.com/Super_Mario_Bros) (for gameplay mechanics only)
- Level Editor: [Tiled Map Editor](https://www.mapeditor.org/)


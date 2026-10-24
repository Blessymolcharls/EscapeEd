import Phaser from 'phaser';
import { EventBus, GAME_EVENTS } from './EventBus';

export class RoomScene extends Phaser.Scene {
  private isDoorLocked: boolean = true;
  private doorGraphics!: Phaser.GameObjects.Graphics;
  private doorRuneText!: Phaser.GameObjects.Text;
  private doorStatusText!: Phaser.GameObjects.Text;
  private doorHitZone!: Phaser.GameObjects.Zone;
  private candleFlames: Phaser.GameObjects.Arc[] = [];
  private pulseTweens: Phaser.Tweens.Tween[] = [];
  private dustMotes: { circle: Phaser.GameObjects.Arc; speedY: number; baseX: number; t: number }[] = [];

  constructor() {
    super('RoomScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Draw atmospheric background & stone masonry floor
    this.drawRoomStructure(width, height);

    // 2. Draw decorations (bookshelves, rugs, banners, sconces)
    this.drawDecorations(width, height);

    // 3. Draw Interactive Objects
    this.createExitDoor(width, height);
    this.createScholarDesk(width, height);
    this.createCipherPedestal(width, height);
    this.createBookshelfInteractable(width, height);

    // 4. Lighting, candles & floating dust motes
    this.createLightingAndAmbience(width, height);

    // 5. Listen to external events from React via EventBus
    EventBus.on(GAME_EVENTS.UPDATE_DOOR_STATE, (data: { isLocked: boolean }) => {
      this.updateDoorVisual(data.isLocked);
    });

    EventBus.on(GAME_EVENTS.RESET_ROOM, () => {
      this.updateDoorVisual(true);
    });

    // Notify React that the Phaser scene is ready
    EventBus.emit(GAME_EVENTS.SCENE_READY);
  }

  private drawRoomStructure(width: number, height: number) {
    const gfx = this.add.graphics();

    // Deep Charcoal / Dark Academia base
    gfx.fillStyle(0x121316, 1);
    gfx.fillRect(0, 0, width, height);

    // North & Wall masonry (top 150px)
    gfx.fillStyle(0x1a1a22, 1);
    gfx.fillRect(0, 0, width, 160);

    // Stone wall brick lines
    gfx.lineStyle(1, 0x252630, 0.7);
    const brickH = 32;
    const brickW = 64;
    for (let y = 0; y < 160; y += brickH) {
      gfx.lineBetween(0, y, width, y);
      const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
      for (let x = offset; x < width; x += brickW) {
        gfx.lineBetween(x, y, x, y + brickH);
      }
    }

    // Wall base moulding (ornate mahogany & antique brass trim)
    gfx.fillStyle(0x2d171d, 1); // Dark burgundy wood
    gfx.fillRect(0, 154, width, 10);
    gfx.fillStyle(0xc5a059, 0.8); // Brass trim line
    gfx.fillRect(0, 162, width, 2);

    // Floor: Flagstone tiles
    const floorY = 164;
    const tileW = 50;
    const tileH = 40;
    for (let y = floorY; y < height; y += tileH) {
      for (let x = 0; x < width; x += tileW) {
        const shade = ((Math.sin(x * 12.3 + y * 7.7) + 1) / 2) * 0.08;
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.ValueToColor(0x17181f),
          Phaser.Display.Color.ValueToColor(0x20222b),
          1,
          shade * 10
        );
        gfx.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
        gfx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);
      }
    }

    // Floor mortar grid
    gfx.lineStyle(1, 0x0f1013, 0.9);
    for (let y = floorY; y < height; y += tileH) {
      gfx.lineBetween(0, y, width, y);
    }
    for (let x = 0; x < width; x += tileW) {
      gfx.lineBetween(x, floorY, x, height);
    }

    // Central Ornate Academic Rug under pedestal
    const rugX = width * 0.5 - 120;
    const rugY = height * 0.52;
    gfx.fillStyle(0x45121e, 0.9); // Velvet burgundy
    gfx.fillRoundedRect(rugX, rugY, 240, 170, 8);
    gfx.lineStyle(2, 0xc5a059, 0.85); // Gold border
    gfx.strokeRoundedRect(rugX + 4, rugY + 4, 232, 162, 6);
    gfx.lineStyle(1, 0x6b1d2f, 0.6);
    gfx.strokeRoundedRect(rugX + 12, rugY + 12, 216, 146, 4);
  }

  private drawDecorations(width: number, _height: number) {
    const gfx = this.add.graphics();

    // 1. Grand Left Bookshelf
    this.drawBookshelfGraphic(gfx, 20, 40, 80, 260);

    // 2. Grand Right Bookshelf
    this.drawBookshelfGraphic(gfx, width - 100, 40, 80, 260);

    // 3. Central Python Alchemical Tapestry behind door/wall
    const tapX = 140;
    gfx.fillStyle(0x38101a, 0.9);
    gfx.fillRect(tapX, 25, 60, 110);
    gfx.lineStyle(2, 0xc5a059, 0.7);
    gfx.strokeRect(tapX, 25, 60, 110);

    // Small python icon symbol on tapestry
    this.add.text(tapX + 30, 75, 'Py', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '22px',
      color: '#d4af37',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 4. Wall Sconces with flickering candles
    this.createCandleSconce(gfx, 115, 65);
    this.createCandleSconce(gfx, width - 115, 65);
    this.createCandleSconce(gfx, width * 0.3, 75);
    this.createCandleSconce(gfx, width * 0.7, 75);
  }

  private drawBookshelfGraphic(gfx: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    // Shelf outer casing (dark oak)
    gfx.fillStyle(0x1f1411, 1);
    gfx.fillRect(x, y, w, h);
    gfx.lineStyle(2, 0x3d271f, 1);
    gfx.strokeRect(x, y, w, h);

    // Shelves tiers
    const tiers = 5;
    const tierH = h / tiers;
    const bookColors = [0x6b1d2f, 0x22354a, 0x855828, 0x243d2c, 0xc5a059];

    for (let i = 1; i < tiers; i++) {
      gfx.fillStyle(0x352018, 1);
      gfx.fillRect(x + 2, y + i * tierH - 4, w - 4, 6);

      // Books in each shelf
      let bookX = x + 4;
      while (bookX < x + w - 10) {
        const bW = Phaser.Math.Between(5, 11);
        const bH = tierH - 8 - Phaser.Math.Between(0, 6);
        const col = Phaser.Utils.Array.GetRandom(bookColors);
        gfx.fillStyle(col, 0.9);
        gfx.fillRect(bookX, y + i * tierH - 4 - bH, bW, bH);
        bookX += bW + 2;
      }
    }
  }

  private createCandleSconce(gfx: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Sconce bracket
    gfx.fillStyle(0x5a4822, 1);
    gfx.fillRect(x - 2, y, 4, 16);
    gfx.fillCircle(x, y + 16, 5);
    // Candle wax
    gfx.fillStyle(0xdcd4be, 1);
    gfx.fillRect(x - 4, y - 10, 8, 12);

    // Flame
    const flame = this.add.circle(x, y - 12, 4, 0xffaa22, 0.9);
    this.candleFlames.push(flame);

    // Flame flicker tween
    this.tweens.add({
      targets: flame,
      scaleX: { from: 0.8, to: 1.2 },
      scaleY: { from: 1.1, to: 0.9 },
      alpha: { from: 0.75, to: 1 },
      duration: Phaser.Math.Between(150, 300),
      yoyo: true,
      repeat: -1,
    });
  }

  private createExitDoor(width: number, _height: number) {
    const doorX = width * 0.5;
    const doorY = 75;
    const doorW = 90;
    const doorH = 130;

    this.doorGraphics = this.add.graphics();
    this.renderDoorState(doorX, doorY, doorW, doorH, this.isDoorLocked);

    // Status label above door
    this.doorStatusText = this.add.text(doorX, doorY - 60, 'LOCKED EXIT', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '12px',
      color: '#e74c3c',
      fontStyle: 'bold',
      backgroundColor: '#16080b',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5);

    this.doorRuneText = this.add.text(doorX, doorY + 10, '🔒', {
      fontSize: '24px',
    }).setOrigin(0.5);

    // Interactive Zone
    this.doorHitZone = this.add.zone(doorX, doorY, doorW + 20, doorH + 20)
      .setRectangleDropZone(doorW + 20, doorH + 20)
      .setInteractive({ cursor: 'pointer' });

    this.doorHitZone.on('pointerover', () => {
      this.doorStatusText.setColor(this.isDoorLocked ? '#ff6b6b' : '#2ecc71');
      this.doorStatusText.setText(this.isDoorLocked ? 'SEALED RUNIC DOOR [CLICK TO INSPECT]' : 'UNLOCKED! [CLICK TO ESCAPE]');
    });

    this.doorHitZone.on('pointerout', () => {
      this.doorStatusText.setColor(this.isDoorLocked ? '#e74c3c' : '#2ecc71');
      this.doorStatusText.setText(this.isDoorLocked ? 'LOCKED EXIT' : 'UNLOCKED EXIT');
    });

    this.doorHitZone.on('pointerdown', () => {
      if (this.isDoorLocked) {
        EventBus.emit(GAME_EVENTS.OBJECT_CLICKED, {
          id: 'exit_door',
          name: 'Heavy Runic Door',
          description: 'A reinforced iron door bound with glowing cipher locks. It requires the alchemical passcode.'
        });
      } else {
        EventBus.emit(GAME_EVENTS.TRIGGER_ESCAPE);
      }
    });
  }

  private renderDoorState(x: number, y: number, w: number, h: number, isLocked: boolean) {
    this.doorGraphics.clear();

    const left = x - w / 2;
    const top = y - h / 2;

    // Stone Archway Frame
    this.doorGraphics.fillStyle(0x282933, 1);
    this.doorGraphics.fillRoundedRect(left - 10, top - 10, w + 20, h + 15, { tl: 40, tr: 40, bl: 0, br: 0 });
    this.doorGraphics.lineStyle(2, 0xc5a059, 0.6);
    this.doorGraphics.strokeRoundedRect(left - 10, top - 10, w + 20, h + 15, { tl: 40, tr: 40, bl: 0, br: 0 });

    if (isLocked) {
      // Locked: Heavy iron reinforced oak door
      this.doorGraphics.fillStyle(0x19100d, 1);
      this.doorGraphics.fillRoundedRect(left, top, w, h, { tl: 35, tr: 35, bl: 0, br: 0 });

      // Vertical iron bars
      this.doorGraphics.lineStyle(3, 0x363842, 0.9);
      for (let bx = left + 15; bx < left + w; bx += 18) {
        this.doorGraphics.lineBetween(bx, top + 15, bx, top + h);
      }

      // Crimson glowing runic bands across
      this.doorGraphics.lineStyle(4, 0x6b1d2f, 0.9);
      this.doorGraphics.lineBetween(left + 5, top + 45, left + w - 5, top + 45);
      this.doorGraphics.lineBetween(left + 5, top + 85, left + w - 5, top + 85);

      // Lock Plate in center
      this.doorGraphics.fillStyle(0x521824, 1);
      this.doorGraphics.fillCircle(x, y + 10, 18);
      this.doorGraphics.lineStyle(2, 0xd4af37, 0.8);
      this.doorGraphics.strokeCircle(x, y + 10, 18);
    } else {
      // Unlocked: Door slightly ajar with radiant golden escape light pouring forth
      this.doorGraphics.fillStyle(0xfff3cc, 0.95);
      this.doorGraphics.fillRoundedRect(left, top, w, h, { tl: 35, tr: 35, bl: 0, br: 0 });

      // Light beams
      this.doorGraphics.fillStyle(0xf1c40f, 0.3);
      this.doorGraphics.fillTriangle(x, top + 20, x - w * 1.2, top + h + 60, x + w * 1.2, top + h + 60);

      // Open door panels on side
      this.doorGraphics.fillStyle(0x2d171d, 1);
      this.doorGraphics.fillRect(left - 5, top + 10, 15, h - 10);
      this.doorGraphics.fillRect(left + w - 10, top + 10, 15, h - 10);
    }
  }

  private updateDoorVisual(isLocked: boolean) {
    this.isDoorLocked = isLocked;
    const width = this.scale.width;
    const doorX = width * 0.5;
    const doorY = 75;
    const doorW = 90;
    const doorH = 130;

    this.renderDoorState(doorX, doorY, doorW, doorH, isLocked);

    if (isLocked) {
      this.doorStatusText.setText('LOCKED EXIT').setColor('#e74c3c');
      this.doorRuneText.setText('🔒');
    } else {
      this.doorStatusText.setText('UNLOCKED! [ESCAPE]').setColor('#2ecc71');
      this.doorRuneText.setText('✨');

      // Add triumphant particle burst
      this.createUnlockEffect(doorX, doorY + 20);
    }
  }

  private createUnlockEffect(x: number, y: number) {
    for (let i = 0; i < 24; i++) {
      const spark = this.add.circle(x, y, Phaser.Math.Between(2, 5), 0xf3e5ab, 1);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(40, 100);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(600, 1200),
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy(),
      });
    }
  }

  private createScholarDesk(width: number, height: number) {
    const deskX = width * 0.24;
    const deskY = height * 0.65;
    const deskW = 125;
    const deskH = 80;

    const gfx = this.add.graphics();

    // Desk Shadow
    gfx.fillStyle(0x0a0b0d, 0.6);
    gfx.fillEllipse(deskX, deskY + deskH / 2 + 5, deskW + 20, 25);

    // Mahogany Desk Surface
    gfx.fillStyle(0x281611, 1);
    gfx.fillRoundedRect(deskX - deskW / 2, deskY - deskH / 2, deskW, deskH, 6);
    gfx.lineStyle(2, 0x472b22, 1);
    gfx.strokeRoundedRect(deskX - deskW / 2, deskY - deskH / 2, deskW, deskH, 6);

    // Brass corner braces
    gfx.fillStyle(0xc5a059, 0.9);
    gfx.fillRect(deskX - deskW / 2 + 2, deskY - deskH / 2 + 2, 6, 6);
    gfx.fillRect(deskX + deskW / 2 - 8, deskY - deskH / 2 + 2, 6, 6);

    // Desk accessories: Ink pot & Brass Quill
    gfx.fillStyle(0x111116, 1);
    gfx.fillRect(deskX + 32, deskY - 18, 10, 10);
    gfx.lineStyle(1.5, 0xd4af37, 1);
    gfx.lineBetween(deskX + 37, deskY - 18, deskX + 46, deskY - 32);

    // Parchment paper sheet
    gfx.fillStyle(0xf1e4cf, 0.85);
    gfx.fillRect(deskX - 35, deskY - 15, 26, 32);
    gfx.lineStyle(1, 0x855828, 0.4);
    for (let py = deskY - 10; py < deskY + 12; py += 5) {
      gfx.lineBetween(deskX - 32, py, deskX - 13, py);
    }

    // THE ANCIENT CODEX (Interactive Clue Tome)
    const bookX = deskX + 2;
    const bookY = deskY + 5;
    const bookW = 38;
    const bookH = 46;

    // Book Cover (Velvet Burgundy & Gold)
    gfx.fillStyle(0x6b1d2f, 1);
    gfx.fillRoundedRect(bookX - bookW / 2, bookY - bookH / 2, bookW, bookH, 4);
    gfx.lineStyle(1.5, 0xd4af37, 0.9);
    gfx.strokeRoundedRect(bookX - bookW / 2, bookY - bookH / 2, bookW, bookH, 4);

    // Book Spine & bookmark ribbon
    gfx.lineStyle(2, 0x45121e, 1);
    gfx.lineBetween(bookX, bookY - bookH / 2 + 2, bookX, bookY + bookH / 2 - 2);
    gfx.fillStyle(0xd4af37, 1);
    gfx.fillTriangle(bookX - 2, bookY + bookH / 2 - 2, bookX + 2, bookY + bookH / 2 - 2, bookX, bookY + bookH / 2 + 6);

    // Glowing Runic seal on book cover
    const bookGlow = this.add.circle(bookX, bookY, 14, 0xd4af37, 0.25);
    const glowTween = this.tweens.add({
      targets: bookGlow,
      scale: 1.4,
      alpha: 0.45,
      duration: 1200,
      yoyo: true,
      repeat: -1,
    });
    this.pulseTweens.push(glowTween);

    // Interactive Hit Zone
    const deskZone = this.add.zone(deskX, deskY, deskW + 10, deskH + 10)
      .setRectangleDropZone(deskW + 10, deskH + 10)
      .setInteractive({ cursor: 'pointer' });

    // Label on hover
    const deskLabel = this.add.text(deskX, deskY - deskH / 2 - 14, '📖 Scribe\'s Codex [Inspect Clue]', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '11px',
      color: '#f3e5ab',
      backgroundColor: '#2d171d',
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5).setVisible(false);

    deskZone.on('pointerover', () => {
      deskLabel.setVisible(true);
      bookGlow.setScale(1.8).setAlpha(0.6);
    });

    deskZone.on('pointerout', () => {
      deskLabel.setVisible(false);
      bookGlow.setScale(1).setAlpha(0.25);
    });

    deskZone.on('pointerdown', () => {
      EventBus.emit(GAME_EVENTS.OBJECT_CLICKED, {
        id: 'clue_tome',
        name: "The Scribe's Ancient Codex",
        description: 'An illuminated manuscript recording ancient Python slicing runes and list permutations.'
      });
    });
  }

  private createCipherPedestal(width: number, height: number) {
    const pedX = width * 0.5;
    const pedY = height * 0.62;
    const pedW = 90;
    const pedH = 75;

    const gfx = this.add.graphics();

    // Pedestal Shadow
    gfx.fillStyle(0x0a0b0d, 0.7);
    gfx.fillEllipse(pedX, pedY + pedH / 2 + 6, pedW + 15, 20);

    // Octagonal Stone Pedestal Base
    gfx.fillStyle(0x22232c, 1);
    gfx.fillRoundedRect(pedX - pedW / 2, pedY - pedH / 2, pedW, pedH, 8);
    gfx.lineStyle(2, 0xc5a059, 0.7);
    gfx.strokeRoundedRect(pedX - pedW / 2, pedY - pedH / 2, pedW, pedH, 8);

    // Central Stone Console
    gfx.fillStyle(0x181920, 1);
    gfx.fillRoundedRect(pedX - 32, pedY - 26, 64, 52, 4);
    gfx.lineStyle(1.5, 0x6b1d2f, 0.9);
    gfx.strokeRoundedRect(pedX - 32, pedY - 26, 64, 52, 4);

    // Runic Pedestal Glyph Display
    const runeLabel = this.add.text(pedX, pedY, '⟦ runes[1:4] ⟧', {
      fontFamily: 'Fira Code, monospace',
      fontSize: '8px',
      color: '#d4af37',
    }).setOrigin(0.5);

    // Subtle pulsing terminal glow
    const terminalGlow = this.add.circle(pedX, pedY, 22, 0x6b1d2f, 0.3);
    const terminalTween = this.tweens.add({
      targets: terminalGlow,
      scale: 1.3,
      alpha: 0.5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
    this.pulseTweens.push(terminalTween);

    // Interactive Zone
    const pedZone = this.add.zone(pedX, pedY, pedW + 10, pedH + 10)
      .setRectangleDropZone(pedW + 10, pedH + 10)
      .setInteractive({ cursor: 'pointer' });

    const pedHoverLabel = this.add.text(pedX, pedY - pedH / 2 - 14, '⚡ Cipher Terminal [Solve Puzzle]', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '11px',
      color: '#f3e5ab',
      backgroundColor: '#1b1c24',
      padding: { x: 5, y: 3 },
    }).setOrigin(0.5).setVisible(false);

    pedZone.on('pointerover', () => {
      pedHoverLabel.setVisible(true);
      runeLabel.setColor('#ffffff');
      terminalGlow.setAlpha(0.7);
    });

    pedZone.on('pointerout', () => {
      pedHoverLabel.setVisible(false);
      runeLabel.setColor('#d4af37');
      terminalGlow.setAlpha(0.3);
    });

    pedZone.on('pointerdown', () => {
      EventBus.emit(GAME_EVENTS.OBJECT_CLICKED, {
        id: 'puzzle_terminal',
        name: 'The Alchemical Cipher Mechanism',
        description: 'An ancient dial mechanism inscribed with Python runes waiting for stdout prediction output.'
      });
    });
  }

  private createBookshelfInteractable(width: number, _height: number) {
    // Make the grand library shelf on the right inspectable for lore
    const shelfX = width - 60;
    const shelfY = 170;
    const shelfW = 75;
    const shelfH = 240;

    const shelfZone = this.add.zone(shelfX, shelfY, shelfW, shelfH)
      .setRectangleDropZone(shelfW, shelfH)
      .setInteractive({ cursor: 'pointer' });

    const shelfLabel = this.add.text(shelfX - 45, shelfY - 40, '📚 Scriptorium Archives', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '10px',
      color: '#c5a059',
      backgroundColor: '#18191e',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setVisible(false);

    shelfZone.on('pointerover', () => shelfLabel.setVisible(true));
    shelfZone.on('pointerout', () => shelfLabel.setVisible(false));

    shelfZone.on('pointerdown', () => {
      EventBus.emit(GAME_EVENTS.OBJECT_CLICKED, {
        id: 'bookshelf',
        name: 'Scriptorium Archives',
        description: 'Dusty leatherbound volumes on Python data structures, indexing, and sequence algorithms. A note mentions: "Check the master desk for the current chamber\'s active cipher."'
      });
    });
  }

  private createLightingAndAmbience(width: number, height: number) {
    // 1. Warm radial lights around sconces
    const ambientGfx = this.add.graphics();
    ambientGfx.fillStyle(0xffaa22, 0.04);
    ambientGfx.fillCircle(115, 65, 80);
    ambientGfx.fillCircle(width - 115, 65, 80);
    ambientGfx.fillCircle(width * 0.3, 75, 70);
    ambientGfx.fillCircle(width * 0.7, 75, 70);

    // 2. Drifting Dust Motes
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(50, height - 30);
      const alpha = Phaser.Math.FloatBetween(0.15, 0.45);
      const size = Phaser.Math.FloatBetween(1, 2.2);

      const circle = this.add.circle(x, y, size, 0xf3e5ab, alpha);
      this.dustMotes.push({
        circle,
        speedY: Phaser.Math.FloatBetween(0.1, 0.35),
        baseX: x,
        t: Phaser.Math.FloatBetween(0, 100),
      });
    }
  }

  update(_time: number, delta: number) {
    const height = this.scale.height;
    // Animate subtle drifting dust motes
    for (const mote of this.dustMotes) {
      mote.t += 0.02;
      mote.circle.y -= mote.speedY * (delta / 16);
      mote.circle.x = mote.baseX + Math.sin(mote.t) * 8;

      if (mote.circle.y < 30) {
        mote.circle.y = height - 20;
      }
    }
  }

  destroy() {
    this.pulseTweens.forEach((t) => t.stop());
    EventBus.off(GAME_EVENTS.UPDATE_DOOR_STATE);
    EventBus.off(GAME_EVENTS.RESET_ROOM);
  }
}

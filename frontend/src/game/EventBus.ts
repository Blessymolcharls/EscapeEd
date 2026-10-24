import Phaser from 'phaser';

/**
 * EventBus provides a decoupled messaging layer between Phaser Scenes
 * and React presentation components.
 */
export const EventBus = new Phaser.Events.EventEmitter();

export const GAME_EVENTS = {
  OBJECT_CLICKED: 'OBJECT_CLICKED',
  OBJECT_HOVERED: 'OBJECT_HOVERED',
  SCENE_READY: 'SCENE_READY',
  UPDATE_DOOR_STATE: 'UPDATE_DOOR_STATE',
  DOOR_UNLOCKED: 'DOOR_UNLOCKED',
  RESET_ROOM: 'RESET_ROOM',
  TRIGGER_ESCAPE: 'TRIGGER_ESCAPE',
} as const;

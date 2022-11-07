import { Game, getMapRect, MAP_HEIGHT, MAP_WIDTH } from "./game";
import { PlayerStatus } from "./player";
import { Pos, Rect } from "./types";

export class GameCamera {
  private game: Game;
  private mapWidthPixels: number = 0;
  private mapHeightPixels: number = 0;

  private screenWidth: number = 0;
  private screenHeight: number = 0;

  public scaleX: number = 0;
  public scaleY: number = 0;

  private currentCameraPos: Pos = { x: 0, y: 0 };
  private nextCameraPos: Pos = { x: 0, y: 0 };

  private isPanning = false;
  private panStartMS: number = 0;
  private panEndMS: number = 0;

  private cameraBounds: Rect;

  constructor(game: Game) {
    this.game = game;

    this.cameraBounds = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  private getViewportUnscaled(): Pos {
    const v = this.game.viewport.position;
    return {
      x: (v.x / this.scaleX) * -1,
      y: (v.y / this.scaleY) * -1,
    };
  }

  public setScale() {
    const w = this.game.app.renderer.screen.width;
    const h = this.game.app.renderer.screen.height;
    this.screenWidth = w;
    this.screenHeight = h;
    //console.log(this.game.viewport.scale);
    const rect = getMapRect(this.game.player.currentMap);
    this.mapHeightPixels = rect.height;
    this.mapWidthPixels = rect.width;
    // console.log(w, h, w > h, w / h, rect);
    const scaleX = w / rect.width;
    const scaleY = h / rect.height;
    const scale = w > h ? scaleY : scaleX;
    this.game.viewport.scale.set(scale);
    this.scaleX = scale;
    this.scaleY = scale;
  }

  public panToMap(fromMap: string, nextMap: string) {
    // disable player movement while panning
    this.game.player.setStatus(PlayerStatus.STOP);

    this.isPanning = true;
    //const lastPos = this.getMapCameraXY(fromMap);
    //this.currentCameraPos = lastPos;
    const lastPos = this.currentCameraPos;
    this.nextCameraPos = this.getMapCameraXY(nextMap);
    console.log(lastPos, this.nextCameraPos);
    //console.log("from", this.currentCameraPos, "to", this.nextCameraPos);

    const deltaX = this.nextCameraPos.x - lastPos.x;

    const panSpeedX = (416 / 16) * 12 + 100;
    const panSpeedY = (320 / 16) * 12 + 100;
    const panTimeMS = deltaX ? panSpeedX : panSpeedY;

    const now = Date.now();
    this.panStartMS = now;
    this.panEndMS = now + panTimeMS;
  }

  public tick() {
    if (this.isPanning) {
      //console.log("panning!");
      const now = Date.now();

      if (now > this.panEndMS) {
        this.isPanning = false;
        this.game.player.setStatus(PlayerStatus.MOVE);
        this.setCamera(this.nextCameraPos.x, this.nextCameraPos.y);
        this.currentCameraPos = this.nextCameraPos;
        return;
      }

      const diff = this.panEndMS - now;
      const totalTime = this.panEndMS - this.panStartMS;
      const percentage = diff / totalTime;
      const dx = percentage * (this.nextCameraPos.x - this.currentCameraPos.x);
      const dy = percentage * (this.nextCameraPos.y - this.currentCameraPos.y);

      const p = this.nextCameraPos;
      this.setCamera(p.x - dx, p.y - dy);
      return;
    }
  }

  public snapCameraToMap(mapName: string) {
    const pos = this.getMapCameraXY(mapName);
    this.currentCameraPos = pos;
    this.setCamera(pos.x, pos.y);
  }

  public setCameraBounds(mapTopLeft: string, mapBottomRight: string) {
    const TL = getMapRect(mapTopLeft);
    const BR = getMapRect(mapBottomRight);

    this.cameraBounds = {
      x: TL.x,
      y: TL.y,
      width: BR.x + MAP_WIDTH,
      height: BR.y + MAP_HEIGHT,
    };
  }

  private getMapCameraXY(mapName: string): Pos {
    const data = getMapRect(mapName);

    let x = -data.x * this.game.viewport.scale.x;
    let y = -data.y * this.game.viewport.scale.y;

    const w = this.game.app.renderer.screen.width;
    const h = this.game.app.renderer.screen.height;

    const mapWidth = this.mapWidthPixels * this.scaleX;
    const mapHeight = this.mapHeightPixels * this.scaleY;

    const padX = this.screenWidth - mapWidth;
    const padY = this.screenHeight - mapHeight;

    if (w > h) {
      const half = Math.round(padX / 2);
      const test = Math.abs(x) - half;
      // Only center the map if no area outside the world would be seen
      if (test >= 0) {
        x += half;
        const worldWidth = this.cameraBounds.width * this.scaleX;
        const finalX = Math.abs(x) + this.screenWidth;
        if (finalX > worldWidth) {
          x += finalX - worldWidth;
        }
      }
    } else {
      const half = Math.round(padY / 2);
      const test = Math.abs(y) - half;
      if (test >= 0) {
        y += half;
        const worldHeight = this.cameraBounds.height * this.scaleY;
        const finalY = Math.abs(y) + this.screenHeight;
        if (finalY > worldHeight) {
          y += finalY - worldHeight;
        }
      }
    }

    return { x: Math.round(x), y: Math.round(y) };
  }

  private setCamera(x: number, y: number) {
    this.game.viewport.position.set(x, y);
  }
}

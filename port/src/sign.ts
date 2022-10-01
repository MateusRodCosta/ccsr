import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "./game";
export class GameSign {
  private game: Game;
  private sprite: PIXI.Sprite | undefined;
  private characterSprite: PIXI.Sprite | undefined;
  private textElement: HTMLParagraphElement;

  private adaptiveScale: boolean = false;
  private originalHeight: number = 0;
  private originalWidth: number = 0;

  private scale = 1;

  constructor(game: Game) {
    this.game = game;

    // Initialize and style the text HTML element
    this.textElement = document.createElement("p");
    this.textElement.textContent = "";
    this.textElement.style.position = "absolute";
    this.textElement.style.display = "none";
    this.textElement.style.top = "0";
    this.textElement.style.left = "0";
    this.textElement.style.backgroundColor = "white";
    this.textElement.style.overflowY = "scroll";
    this.textElement.style.border = "1px solid black";
    this.textElement.style.userSelect = "none";
    this.textElement.style.whiteSpace = "break-spaces"; // don't compress whitespace
    this.textElement.style.fontFamily = "arial";

    this.adaptiveScale = true;

    document.getElementById("game-container")?.appendChild(this.textElement);
  }

  public init() {
    this.sprite = new PIXI.Sprite(getMemberTexture("sign.bkg"));
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;

    this.characterSprite = new PIXI.Sprite();
    this.characterSprite.anchor.set(0.5, 0.5);
    this.characterSprite.visible = false;

    this.game.app.stage.addChild(this.sprite);
    this.game.app.stage.addChild(this.characterSprite);

    this.originalHeight = this.sprite.height;
    this.originalWidth = this.sprite.width;
    this.resize();
  }

  public showCharacterMessage(charName: string, message: string) {
    this.game.showingMessage = true;
    this.setTextDimensions(false);

    this.sprite!.texture = getMemberTexture("talk.bkg")!;
    this.sprite!.visible = true;

    this.characterSprite!.texture = getMemberTexture(charName + ".face")!;
    this.characterSprite!.visible = true;
    console.log(this.characterSprite);

    this.textElement.innerText = message;
    this.textElement.style.display = "block";
  }

  public showMessage(message: string) {
    this.game.showingMessage = true;
    this.setTextDimensions(true);

    this.sprite!.texture = getMemberTexture("sign.bkg")!;
    this.sprite!.visible = true;

    this.textElement.innerText = message;
    this.textElement.style.display = "block";
  }

  private setTextDimensions(isSign: boolean) {
    const width = isSign ? 242 : 165;
    const height = isSign ? 136 : 160;

    const boxWidth = width * this.scale;
    const boxHeight = height * this.scale;

    const halfWidth = Math.round(this.sprite!.width / 2);
    const halfHeight = Math.round(this.sprite!.height / 2);

    const l = isSign ? 30 : 120;
    const t = isSign ? 34 : 18;

    const leftAdjust = l * this.scale;
    const topAdjust = t * this.scale;

    const left = this.sprite!.position.x - halfWidth + leftAdjust;
    const top = this.sprite!.position.y - halfHeight + topAdjust;

    this.textElement.style.width = boxWidth + "px";
    this.textElement.style.height = boxHeight + "px";
    this.textElement.style.left = left + "px";
    this.textElement.style.top = top + "px";
  }

  public closeMessage() {
    this.sprite!.visible = false;
    this.characterSprite!.visible = false;
    this.textElement.innerText =
      "I see you, poking around in the developer console";
    this.textElement.style.display = "none";
  }

  public resize() {
    const width = this.game.app.renderer.screen.width;
    const height = this.game.app.renderer.screen.height;
    const x = Math.round(width / 2);
    const y = Math.round(height / 2);
    this.sprite?.position.set(x, y);
    this.characterSprite?.position.set(285, 320);

    // In the original game, the message takes up
    // 65% of the screen's height more or less
    const targetHeight = height * 0.65;
    const targetWidth = width * 0.73;
    const scaleY = targetHeight / this.originalHeight;
    const scaleX = targetWidth / this.originalWidth;

    this.scale = 1;
    if (this.adaptiveScale) {
      this.scale = width > height ? scaleY : scaleX;
    }

    this.sprite?.scale.set(this.scale, this.scale);
    this.characterSprite?.scale.set(this.scale, this.scale);

    this.textElement.style.fontSize = 100 * this.scale + "%";
    this.setTextDimensions(true);
  }
}
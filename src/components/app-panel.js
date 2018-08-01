import { AnElement, html } from './an-element';
import './file-picker';
import './control-panel';

export class AppPanel extends AnElement {
  _render() {
    return html`
    <style>
      :host {
        position: relative;
      }
      #noFilePanel {
        padding: 20px 16px;
        margin: 0 auto;
        max-width: 500px;
      }
      #filePicker {
        color: white;
        border-color: rgba(255,255,255, 0.9);
        height: 150px;
      }
      #canvasPanel {
        padding: 20px 16px;
        margin: 0 auto;
        display: none;
      }
      #canvas {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        box-sizing: border-box;
      }

      .hasFile #noFilePanel {
        display: none;
      }
      .hasFile #canvasPanel {
        display: block;
      }

      .subPanel {
        text-align: center;
        padding: 20px 0;
      }

      #originalSection, #canvasSection {
        overflow: hidden;
      }
      #img {
        display: block;
        box-sizing: border-box;
        max-width: 500px;
        margin: 0 auto;
      }
    </style>
    <div id="main">
      <div id="noFilePanel">
        <file-picker id="filePicker" on-files="${(e) => this.onFiles(e)}"></file-picker>
        <div class="subPanel">
        </div>
      </div>
      <div id="canvasPanel">
        <div id="originalSection">
          <img id="img" on-load="${() => this.onImageLoad()}">
        </div>
        <div id="canvasSection">
          <canvas id="canvas"></canvas>
        </div>
        <div class="subPanel">
          <control-panel></control-panel>
        </div>
      </div>
    </div>
    `;
  }

  _firstRendered() {
    this.main = this.$('main');
    this.originalSection = this.$('originalSection');
    this.canvasSection = this.$('canvasSection');
    this.canvas = this.$('canvas');
    this.image = this.$('img');
    this.controls = this.$$('control-panel');
  }

  onFiles(e) {
    const file = e.detail.file;
    if (file.type.indexOf('image/') === 0) {
      this.loadImage(file);
    }
  }

  loadImage(file) {
    if (this.prevImageUrl) {
      URL.revokeObjectURL(this.prevImageUrl);
    }
    this.prevImageUrl = URL.createObjectURL(file);
    this.image.src = this.prevImageUrl;
    this.originalSection.style.height = 0;
    this.canvasSection.style.height = 0;
    this.main.classList.add('hasFile');
  }

  onImageLoad() {
    this.originalSection.style.height = 'auto';
    this.canvasSection.style.height = 0;
  }
}
customElements.define('app-panel', AppPanel);
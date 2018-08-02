import { AnElement, html } from './an-element.js';
import { draw } from '../draw.js';
import { RoughCanvas } from '../../node_modules/roughjs/bin/canvas.js';
import './file-picker.js';
import './control-panel.js';

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
        max-height: 500px;
        margin: 0 auto;
      }
      #loadingPanel {
        padding: 20px 16px;
        text-align: center;
      }
    </style>
    <div id="main" style="display: none;">
      <div id="noFilePanel">
        <file-picker id="filePicker" on-files="${(e) => this.onFiles(e)}"></file-picker>
        <div class="subPanel">
          <div class="message">
            Select an image to render it in a sketchy hand-drawn fashion.
          </div>
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
          <control-panel on-update="${(e) => this.onUpdate(e)}" on-clear="${() => this.clearImage()}"></control-panel>
        </div>
      </div>
    </div>
    <div id="loadingPanel">Loading OpenCV module...</div>
    `;
  }

  _firstRendered() {
    this.main = this.$('main');
    this.originalSection = this.$('originalSection');
    this.canvasSection = this.$('canvasSection');
    this.canvas = this.$('canvas');
    this.image = this.$('img');
    this.controls = this.$$('control-panel');
    this.filePicker = this.$('filePicker');
    this.loadingPanel = this.$('loadingPanel');
    if (window.opencvLoaded) {
      this.openCVReady();
    } else {
      window.addEventListener('opencv-load', () => this.openCVReady());
    }
  }

  openCVReady() {
    this.loadingPanel.style.display = 'none';
    this.main.style.display = 'block';
  }

  clearImage() {
    if (this.prevImageUrl) {
      URL.revokeObjectURL(this.prevImageUrl);
    }
    this.prevImageUrl = null;
    this.filePicker.clear();
    this.originalSection.style.height = 0;
    this.canvasSection.style.height = 0;
    this.main.classList.remove('hasFile');
    this.controls.reset();
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
    this.redraw(this.controls.settings);
  }

  onUpdate(event) {
    this.redraw(this.prevImageUrl && event.detail);
  }

  async redraw(settings) {
    if (settings) {
      let out = await draw(this.image, settings.shapeCount, settings.threshold, false, false);
      this.canvas.width = out.size[0];
      this.canvas.height = out.size[1];
      this.canvas.getContext('2d').clearRect(0, 0, out.size[0], out.size[1]);
      this.drawShapes(out, settings.simplify);
      if (settings.doublePass) {
        out = await draw(this.image, settings.shapeCount, settings.threshold, false, true);
        this.drawShapes(out, settings.simplify);
      }
      this.originalSection.style.height = 0;
      this.canvasSection.style.height = 'auto';
    }
  }

  drawShapes(data, simplify) {
    if (!this.rc) {
      this.rc = new RoughCanvas(this.canvas, {
        options: {
          fillStyle: 'hachure',
          fillWeight: 3,
          stroke: '#777'
        }
      });
    }
    for (const p of data.paths) {
      const o = { fill: p.color, hachureAngle: Math.round(Math.random() * 360) };
      if (simplify) {
        o.simplification = 0.1;
      }
      this.rc.path(p.d, o);
    }
  }
}
customElements.define('app-panel', AppPanel);
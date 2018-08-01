import { AnElement, html } from './an-element';
import './checkbox';

export class ControlPanel extends AnElement {
  _render({ shapeCount, threshold, simplify, doublePass }) {
    return html`
    <style>
      :host {
        text-align: left;
      }

      #controlPanel {
        max-width: 500px;
        margin: 0 auto;
      }

      label {
        display: block;
        margin: 10px 0;
      }

      label span {
        color: var(--highlight-pink);
      }

      input[type="range"] {
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    <div id="controlPanel">
      <label>
        Number of shapes
        <span id="shapeValue"></span>
        <input id="shapeCount" type="range" min="1" max="50" step="1" value="15">
      </label>
      <label>
        Threshold
        <span id="thresholdValue"></span>
        <input id="threshold" type="range" min="0" max="250" step="1" value="110">
      </label>
      <label>
        <check-box id="doublePass" checked>Double pass extraction</check-box>
      </label>
      <label>
        <check-box id="simplify" checked>Simplify shape</check-box>
      </label>
    </div>
    `;
  }

  _firstRendered() {
    this.shapeValue = this.$('shapeValue');
    this.thresholdValue = this.$('thresholdValue');
    this.shapeCount = this.$('shapeCount');
    this.threshold = this.$('threshold');
    this.doublePass = this.$('doublePass');
    this.simplify = this.$('simplify');
    this.$('controlPanel').addEventListener('input', this.debounce(this.onPanelChange, this.refreshLabels, 250, false, this));
    this.$('controlPanel').addEventListener('chnage', this.debounce(this.onPanelChange, this.refreshLabels, 250, false, this));
    this.refreshLabels();
  }

  refreshLabels() {
    this.shapeValue.textContent = `(${this.shapeCount.value})`;
    this.thresholdValue.textContent = `(${this.threshold.value})`;
  }

  onPanelChange() {
    this.refreshLabels();
    this.fireEvent('update', {
      shapeCount: +this.shapeCount.value,
      threshold: +this.threshold.value,
      simplify: this.simplify.checked,
      doublePass: this.doublePass.checked
    });
  }

  debounce(func, imFunct, wait, immediate, context) {
    let timeout = 0;
    return () => {
      const args = arguments;
      const later = () => {
        timeout = 0;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
      imFunct.apply(context, args);
    };
  }
}
customElements.define('control-panel', ControlPanel);
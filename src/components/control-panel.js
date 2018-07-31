import { AnElement, html } from './an-element';

export class ControlPanel extends AnElement {
  static get properties() {
    return {
      shapeCount: Number,
      threshold: Number,
      simplify: Boolean,
      doublePass: Boolean
    }
  }

  constructor() {
    super();
    this.shapeCount = 15;
    this.threshold = 110;
    this.simplify = true;
    this.doublePass = false;
  }

  _render({ shapeCount, threshold, simplify, doublePass }) {
    return html`
    <style>
      :host {
        display: block;
      }

      #controlPanel {
        background: white;
        padding: 10px 12px;
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.6);
        border-radius: 5px;
        color: #000;
        width: 290px;
        position: absolute;
        right: 10px;
        top: 10px;
      }

      label {
        display: block;
        margin: 10px 0;
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
        <input id="shapeCount" type="range" min="1" max="50" step="1" value$="${shapeCount}">
      </label>
      <label>
        Threshold
        <span id="thresholdValue"></span>
        <input id="threshold" type="range" min="0" max="250" step="1" value$="${threshold}">
      </label>
      <label>
        <input id="doublePass" type="checkbox" checked?="${doublePass}"> Double pass extraction
      </label>
      <label>
        <input id="simplify" type="checkbox" checked?="${simplify}"> Simplify shape
      </label>
    </div>
    `;
  }
}
customElements.define('control-panel', ControlPanel);
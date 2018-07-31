import { AnElement, html } from './an-element';
import './file-picker';
// import './control-panel';

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
    </style>
    <div id="main">
      <div id="noFilePanel">
        <file-picker id="filePicker" on-files="${(e) => this.onFiles(e)}"></file-picker>
      </div>
    </div>
    `;
  }

  onFiles(e) {
  }
}
customElements.define('app-panel', AppPanel);
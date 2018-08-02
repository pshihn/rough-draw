import { AnElement, html } from './an-element.js';
import './icon.js';
import './icon-defs.js';

export class CheckBox extends AnElement {
  static get properties() {
    return {
      checked: Boolean
    }
  }

  constructor() {
    super();
    this.checked = false;
  }

  _render() {
    return html`
    <style>
      :host {
        display: block;
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
      }
    
      an-icon {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        color: var(--highlight-pink);
        margin-right: 5px;
      }
    
      span {
        display: inline;
        vertical-align: middle;
      }
    </style>
    <label on-click="${() => this._toggle()}">
      <an-icon icon="${this.checked ? 'checkbox-filled' : 'checkbox-unfilled'}"></an-icon>
      <span>
        <slot></slot>
      </span>
    </label>
    `;
  }

  _toggle() {
    this.checked = !this.checked;
    this.fireEvent('change', { checked: this.checked });
  }
}
customElements.define('check-box', CheckBox);
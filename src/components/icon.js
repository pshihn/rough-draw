import { AnElement, html } from './an-element.js';

export const MAP_REF = '__x_icon_map__';

export class AnIcon extends AnElement {
  static get properties() {
    return {
      icon: String
    }
  }

  _render({ icon }) {
    let path = '';
    const mapRef = icon && window[MAP_REF];
    if (mapRef) {
      path = mapRef[icon] || '';
    }
    return html`
    <style>
      :host {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: currentColor;
        stroke: none;
        width: 24px;
        height: 24px;
      }
    
      svg {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g>
        <path d$="${path}"></path>
      </g>
    </svg>
    `;
  }
}
customElements.define('an-icon', AnIcon);
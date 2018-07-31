import { LitElement } from '@polymer/lit-element';
export { html } from '@polymer/lit-element';

const _$ = {};

export class AnElement extends LitElement {
  $(id) {
    if (!_$[id]) {
      const e = this.shadowRoot.querySelector(`#${id}`);
      if (e) {
        _$[id] = e;
      }
    }
    return _$[id];
  }

  $$(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  fireEvent(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }
}
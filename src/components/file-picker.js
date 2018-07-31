import { AnElement, html } from './an-element';

export class FilePicker extends AnElement {
  static get properties() {
    return {
      label: String,
      hidePrefixLabel: String,
      browseLabel: String,
      accept: String
    }
  }

  constructor() {
    super();
    this.label = 'Drop a file';
    this.hidePrefixLabel = false;
    this.browseLabel = 'browse';
    this.file = null;
    this.dragOverListener = this.onDragOver.bind(this);
    this.dragLeaveListener = this.onDragLeave.bind(this);
    this.dragEndListener = this.onDragEnd.bind(this);
    this.dropListener = this.onDrop.bind(this);
  }

  _render() {
    const fileLabel = ((this.file && this.file.name) || this.label || 'Drop a file') + ' or ';
    const prefixLabelClass = this.hidePrefixLabel ? 'hidden' : 'inline';
    return html`
    <style>
      :host {
        display: block;
        width: 100%;
        min-height: 40px;
        box-sizing: border-box;
        padding: 5px;
        border: 2px dashed rgba(0, 0, 0, 0.4);
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
        color: #777;
        letter-spacing: 0.03em;
        overflow: hidden;
      }
    
      :host(.dragging) {
        background-color: var(--highlight-pink);
      }
    
      .inline {
        display: inline-block;
        vertical-align: middle;
      }
    
      .flex {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      }
    
      #nofile {
        text-align: center;
        word-break: break-word;
      }
    
      .fiContainer {
        display: inline-block;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        color: var(--highlight-pink);
        border-bottom: 1px solid;
      }

      :host(.dragging) .fiContainer {
        color: inherit;
      }
    
      #fi {
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    
      .hidden {
        display: none;
      }
    </style>
    <div class="flex"></div>
    <div id="nofile">
      <span id="prefixLabel" class$="${prefixLabelClass}">${fileLabel}</span>
      <div class="fiContainer inline">
        <label class="link">${this.browseLabel}</label>
        <input id="fi" type="file" accept$="${this.accept}" title="Browse files" on-change="${() => this.fileChanged()}">
      </div>
    </div>
    <div id=""></div>
    <div class="flex"></div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.attachDragListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.detachDragListeners();
  }

  attachDragListeners() {
    this.detachDragListeners();
    this.addEventListener('dragover', this.dragOverListener);
    this.addEventListener('dragleave', this.dragLeaveListener);
    this.addEventListener('dragend', this.dragEndListener);
    this.addEventListener('drop', this.dropListener);
  }

  detachDragListeners() {
    this.removeEventListener('dragover', this.dragOverListener);
    this.removeEventListener('dragleave', this.dragLeaveListener);
    this.removeEventListener('dragend', this.dragEndListener);
    this.removeEventListener('drop', this.dropListener);
  }

  onDragOver(event) {
    event.preventDefault();
    this.classList.add('dragging');
  }

  onDragLeave(event) {
    event.preventDefault();
    this.classList.remove('dragging');
  }

  onDragEnd(event) {
    this.classList.remove('dragging');
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      if (dataTransfer.items) {
        for (let i = 0; i < dataTransfer.items.length; i++) {
          dataTransfer.items.remove(i);
        }
      } else {
        event.dataTransfer.clearData();
      }
    }
  }

  onDrop(event) {
    event.preventDefault();
    this.classList.remove('dragging');
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
      this.file = dataTransfer.files[0];
      this.requestRender();
      this.fireEvent('files', { file: this.file });
    }
  }

  fileChanged() {
    this.file = (this.$('fi').files || [])[0];
    this.requestRender();
    this.fireEvent('files', { file: this.file });
  }

  clear() {
    this.$('fi').value = null;
    this.file = null;
    this.requestRender();
  }
}
customElements.define('file-picker', FilePicker);
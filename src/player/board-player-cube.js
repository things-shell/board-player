import { LitElement, html, css } from 'lit-element'
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer'

class BoardPlayerCube extends LitElement {
  static get properties() {
    return {
      side: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 600px;
          height: 600px;
          -webkit-perspective: 1000px;
          -moz-perspective: 1000px;
          -o-perspective: 1000px;
          perspective: 1000px;
        }

        #cube {
          width: 100%;
          height: 100%;
          position: absolute;
          -webkit-transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          -o-transform-style: preserve-3d;
          transform-style: preserve-3d;
          -webkit-transition: -webkit-transform 1.5s;
          -moz-transition: -moz-transform 1.5s;
          -o-transition: -o-transform 1.5s;
          transition: transform 1.5s;
        }

        #cube > ::slotted([page]) {
          background: white;
          margin: 0;
          display: block;
          position: absolute;
          border: 2px solid black;
          width: 100%;
          height: 100%;
        }

        #cube.backface-invisible > ::slotted([page]) {
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -o-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        /* 배경색을 바꾸는 경우에 사용한다.
        #cube > ::slotted:nth-child(1) { background: hsla(   0, 100%, 50%, 0.7 ); }
        #cube > ::slotted:nth-child(2) { background: hsla(  60, 100%, 50%, 0.7 ); }
        #cube > ::slotted:nth-child(3) { background: hsla( 120, 100%, 50%, 0.7 ); }
        #cube > ::slotted:nth-child(4) { background: hsla( 180, 100%, 50%, 0.7 ); }
        #cube > ::slotted:nth-child(5) { background: hsla( 240, 100%, 50%, 0.7 ); }
        #cube > ::slotted:nth-child(6) { background: hsla( 300, 100%, 50%, 0.7 ); }
      */

        #cube > ::slotted(:nth-child(1)) {
          -webkit-transform: translateZ(300px);
          -moz-transform: translateZ(300px);
          -o-transform: translateZ(300px);
          transform: translateZ(300px);
        }

        #cube > ::slotted(:nth-child(2)) {
          -webkit-transform: translateZ(-300px);
          -moz-transform: translateZ(-300px);
          -o-transform: translateZ(-300px);
          transform: translateZ(-300px);
        }

        #cube > ::slotted(:nth-child(3)) {
          -webkit-transform: rotateY(90deg) translateZ(300px);
          -moz-transform: rotateY(90deg) translateZ(300px);
          -o-transform: rotateY(90deg) translateZ(300px);
          transform: rotateY(90deg) translateZ(300px);
        }

        #cube > ::slotted(:nth-child(4)) {
          -webkit-transform: rotateY(-90deg) translateZ(300px);
          -moz-transform: rotateY(-90deg) translateZ(300px);
          -o-transform: rotateY(-90deg) translateZ(300px);
          transform: rotateY(-90deg) translateZ(300px);
        }

        #cube > ::slotted(:nth-child(5)) {
          -webkit-transform: rotateX(90deg) translateZ(300px);
          -moz-transform: rotateX(90deg) translateZ(300px);
          -o-transform: rotateX(90deg) translateZ(300px);
          transform: rotateX(90deg) translateZ(300px);
        }

        #cube > ::slotted(:nth-child(6)) {
          -webkit-transform: rotateX(-90deg) translateZ(300px);
          -moz-transform: rotateX(-90deg) translateZ(300px);
          -o-transform: rotateX(-90deg) translateZ(300px);
          transform: rotateX(-90deg) translateZ(300px);
        }

        :host([show-front]) > div {
          -webkit-transform: translateZ(-300px);
          -moz-transform: translateZ(-300px);
          -o-transform: translateZ(-300px);
          transform: translateZ(-300px);
        }

        :host([show-back]) > div {
          -webkit-transform: translateZ(-300px) rotateX(-180deg);
          -moz-transform: translateZ(-300px) rotateX(-180deg);
          -o-transform: translateZ(-300px) rotateX(-180deg);
          transform: translateZ(-300px) rotateX(-180deg);
        }

        :host([show-right]) > div {
          -webkit-transform: translateZ(-300px) rotateY(-90deg);
          -moz-transform: translateZ(-300px) rotateY(-90deg);
          -o-transform: translateZ(-300px) rotateY(-90deg);
          transform: translateZ(-300px) rotateY(-90deg);
        }

        :host([show-left]) > div {
          -webkit-transform: translateZ(-300px) rotateY(90deg);
          -moz-transform: translateZ(-300px) rotateY(90deg);
          -o-transform: translateZ(-300px) rotateY(90deg);
          transform: translateZ(-300px) rotateY(90deg);
        }

        :host([show-top]) > div {
          -webkit-transform: translateZ(-300px) rotateX(-90deg);
          -moz-transform: translateZ(-300px) rotateX(-90deg);
          -o-transform: translateZ(-300px) rotateX(-90deg);
          transform: translateZ(-300px) rotateX(-90deg);
        }

        :host([show-bottom]) > div {
          -webkit-transform: translateZ(-300px) rotateX(90deg);
          -moz-transform: translateZ(-300px) rotateX(90deg);
          -o-transform: translateZ(-300px) rotateX(90deg);
          transform: translateZ(-300px) rotateX(90deg);
        }
      `
    ]
  }

  render() {
    return html`
      <div id="cube"><slot select="[page]"></slot></div>
    `
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._slotObserver.disconnect()
  }

  firstUpdated() {
    this.side = this.side || 'front'

    this._slotObserver = new FlattenedNodesObserver(this.shadowRoot.querySelector('#slot'), info => {
      this.start()
    })
  }

  updated(change) {
    change.has('side') && this._onSideChanged(this.side, change.get('side'))
  }

  start() {
    this._onSideChanged(this.side, this.side)
  }

  stop() {}

  _onSideChanged(after, before) {
    if (before) this.removeAttribute('show-' + before)
    this.setAttribute('show-' + after, true)
    this.dispatchEvent(new CustomEvent('transform', { bubbles: true, composed: true }))
  }

  next() {
    this.side = ['front', 'back', 'right', 'left', 'top', 'bottom'][Math.floor(Math.random() * 6)]
  }

  previous() {
    this.next()
  }
}

customElements.define('board-player-cube', BoardPlayerCube)

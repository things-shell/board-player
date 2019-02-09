import { LitElement, html, css } from 'lit-element'

import '@material/mwc-fab/mwc-fab'
import '@material/mwc-icon/mwc-icon'

import './board-wrapper'

import './player/board-player-carousel'
import './player/board-player-cube'
import './player/board-player-flipcard'
import './player/board-player-flipcard-edge'
import './player/board-player-grid'
import './player/board-player-enlarge-grid'

import { fullscreen } from '@things-shell/client-utils'

import { style } from './board-player-style'

class BoardPlayer extends LitElement {
  constructor() {
    super()

    this.boards = []

    this.transition = 'carousel'
    this.playtime = 30
    this.columns = 1
    this.rows = 1
    this.started = false
  }

  static get properties() {
    return {
      boards: Array,

      transition: String,
      playtime: Number,
      columns: Number,
      rows: Number,
      provider: Object,
      started: Boolean
    }
  }

  static get styles() {
    return [style]
  }

  render() {
    return html`
      <slot
        @keydown=${e => this._onKeydown(e)}
        @tap=${e => this._onTap(e)}
        @mousemove=${e => this._onMousemove(e)}
        @transform=${e => this._onTransform(e)}
        tabindex="-1"
      >
        ${this.started
          ? html`
              ${this.transition == 'flip-card'
                ? html`
                    <board-player-flipcard axis="y" .rows=${this.rows} .columns=${this.columns} player>
                      ${this.boards.map(
                        item => html`
                          <board-wrapper page .sceneId=${item.id} fit="both" .provider=${this.provider}>
                          </board-wrapper>
                        `
                      )}
                    </board-player-flipcard>
                  `
                : html``}
              ${this.transition == 'flip-card2'
                ? html`
                    <board-player-flipcard-edge axis="y" .rows=${this.rows} .columns=${this.columns} player>
                      ${this.boards.map(
                        item => html`
                          <board-wrapper page .sceneId=${item.id} fit="both" .provider=${this.provider}>
                          </board-wrapper>
                        `
                      )}
                    </board-player-flipcard-edge>
                  `
                : html``}
              ${this.transition == 'carousel'
                ? html`
                    <board-player-carousel
                      axis="y"
                      .rows=${this.rows}
                      .columns=${this.columns}
                      backface-visibility="false"
                      player
                    >
                      ${this.boards.map(
                        item => html`
                          <board-wrapper page .sceneId=${item.id} fit="both" .provider=${this.provider}>
                          </board-wrapper>
                        `
                      )}
                    </board-player-carousel>
                  `
                : html``}
              ${this.transition == 'enlarge-grid'
                ? html`
                    <board-player-enlarge-grid
                      axis="y"
                      .rows=${this.rows}
                      .columns=${this.columns}
                      backface-visibility="false"
                      player
                    >
                      ${this.boards.map(
                        item => html`
                          <board-wrapper page .sceneId=${item.id} fit="both" .provider=${this.provider}>
                          </board-wrapper>
                        `
                      )}
                    </board-player-enlarge-grid>
                  `
                : html``}
            `
          : html``}
      </slot>

      <mwc-fab
        id="fab"
        @mouseover=${e => this._onMouseoverFab(e)}
        @tap=${e => this._onTapFullscreen(e)}
        icon="fullscreen"
        title="fullscreen"
      >
      </mwc-fab>
    `
  }

  updated(changes) {
    if (changes.has('boards') || changes.has('columns') || changes.has('rows')) {
      this.boards && this.boards.length > 0 ? this.restart() : this.stop()
    }
  }

  get fab() {
    return this.shadowRoot.getElementById('fab')
  }

  async _resetFadeTimer(stop) {
    if (!this._fab_animation) {
      this._fab_animation = this.fab.animate(
        [
          {
            opacity: 1,
            easing: 'ease-in'
          },
          { opacity: 0 }
        ],
        { delay: 1000, duration: 2000 }
      )
    }

    this.fab.hidden = false

    this._fab_animation.cancel()
    if (stop) return

    try {
      this._fab_animation.play()
      await this._fab_animation.finished
      this.fab.hidden = true
    } catch (e) {
      /* cancelled */
    }
  }

  _onMousemove() {
    this._resetFadeTimer()
  }

  _onMouseoverFab() {
    this._resetFadeTimer(true)
  }

  _onTapFullscreen() {
    fullscreen(
      this.currentPlayer,
      () => {
        this.fab.hidden = true
        this.focus()
      },
      () => {
        this.fab.hidden = false
        this.focus()
      }
    )
  }

  _onTransform() {
    requestAnimationFrame(() => this.started && this._resetTransformTimer())
  }

  _resetTransformTimer() {
    clearTimeout(this._transfer_timer)

    if (this.currentPlayer) {
      this._transfer_timer = setTimeout(() => {
        if (this._transfer_timer) this.currentPlayer.next()
      }, this.playtime * 1000)
    }
  }

  _onTap() {
    this.currentPlayer && this.currentPlayer.next()
  }

  _onKeydown(e) {
    var player = this.currentPlayer

    if (!player) return

    switch (e.keyCode) {
      case 38: // arrow up
        player.axis = 'x'
        player.next()
        break
      case 39: // arrow right
        player.axis = 'y'
        player.next()
        break
      case 40: // arrow down
        player.axis = 'x'
        player.previous()
        break
      case 37: // arrow left
        player.axis = 'y'
        player.previous()
        break
    }
  }

  async restart() {
    await this.stop()
    await this.start()
  }

  async start() {
    if (!this.boards || this.boards.length == 0) return

    this.started = true

    await this.renderComplete
    this.currentPlayer = this.shadowRoot.querySelector(':not([style*="display: none"])[player]')

    this._resetTransformTimer()
    this._resetFadeTimer()

    this.focus()
  }

  async stop() {
    clearTimeout(this._transfer_timer)

    this.currentPlayer && this.currentPlayer.stop()

    await this.renderComplete
    this.started = false
  }
}

customElements.define('board-player', BoardPlayer)

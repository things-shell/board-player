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

import { togglefullscreen } from '@things-shell/client-utils'

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
    this.fullscreened = false
  }

  static get properties() {
    return {
      boards: Array,

      transition: String,
      playtime: Number,
      columns: Number,
      rows: Number,
      provider: Object,
      started: Boolean,
      playing: Boolean,
      fullscreened: Boolean
    }
  }

  static get styles() {
    return [style]
  }

  render() {
    return html`
      <slot @mousemove=${e => this.onMousemove(e)} @transform=${e => this.onTransform(e)} tabindex="-1">
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

      <div id="control" @mouseover=${e => this.onMouseoverControl(e)} hidden>
        <mwc-icon id="up" @click=${e => this.onTapUp(e)}>keyboard_arrow_up</mwc-icon>
        <mwc-icon id="left" @click=${e => this.onTapLeft(e)}>keyboard_arrow_left</mwc-icon>
        <mwc-icon id="play" @click=${e => this.onTapPlay(e)} ?hidden=${this.playing}>play_arrow</mwc-icon>
        <mwc-icon id="pause" @click=${e => this.onTapPause(e)} ?hidden=${!this.playing}>pause</mwc-icon>
        <mwc-icon id="right" @click=${e => this.onTapRight(e)}>keyboard_arrow_right</mwc-icon>
        <mwc-icon id="down" @click=${e => this.onTapDown(e)}>keyboard_arrow_down</mwc-icon>
        <mwc-icon id="settings" @click=${e => this.onTapSettings(e)}>settings</mwc-icon>
        <mwc-icon id="fullscreen" @click=${e => this.onTapFullscreen(e)} ?hidden=${this.fullscreened}
          >fullscreen</mwc-icon
        >
        <mwc-icon id="fullscreen-exit" @click=${e => this.onTapFullscreen(e)} ?hidden=${!this.fullscreened}
          >fullscreen_exit</mwc-icon
        >
      </div>
    `
  }

  updated(changes) {
    if (changes.has('boards') || changes.has('columns') || changes.has('rows')) {
      this.boards && this.boards.length > 0 ? this.restart() : this.stop()
    }
  }

  get control() {
    return this.shadowRoot.getElementById('control')
  }

  get fullscreen() {
    return this.shadowRoot.getElementById('fullscreen')
  }

  async _resetFadeTimer(stop) {
    if (!this._control_animation) {
      this._control_animation = this.control.animate(
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

    this.control.hidden = false

    this._control_animation.cancel()
    if (stop) return

    try {
      this._control_animation.play()
      await this._control_animation.finished
      this.control.hidden = true
    } catch (e) {
      /* cancelled */
    }
  }

  _resetTransformTimer() {
    clearTimeout(this._transfer_timer)

    this.playing = true

    if (this.currentPlayer) {
      this._transfer_timer = setTimeout(() => {
        if (this._transfer_timer) this.currentPlayer.next()
      }, this.playtime * 1000)
    }
  }

  onMousemove() {
    this._resetFadeTimer()
  }

  onMouseoverControl() {
    this._resetFadeTimer(true)
  }

  onTapFullscreen() {
    togglefullscreen(
      this,
      () => {
        this.fullscreened = true
        this.focus()
      },
      () => {
        this.fullscreened = false
        this.focus()
      }
    )
  }

  onTransform() {
    requestAnimationFrame(() => this.started && this.playing && this._resetTransformTimer())
  }

  onTapPlay(e) {
    this._resetTransformTimer()
  }

  onTapPause(e) {
    clearTimeout(this._transfer_timer)
    this.playing = false
  }

  onTapLeft(e) {
    this.currentPlayer.axis = 'y'
    this.currentPlayer.previous()
  }

  onTapRight(e) {
    this.currentPlayer.axis = 'y'
    this.currentPlayer.next()
  }

  onTapUp(e) {
    this.currentPlayer.axis = 'x'
    this.currentPlayer.next()
  }

  onTapDown(e) {
    this.currentPlayer.axis = 'x'
    this.currentPlayer.previous()
  }

  onTapSettings(e) {
    console.warn('Not implemented yet.')
  }

  async restart() {
    await this.stop()
    await this.start()
  }

  async start() {
    if (!this.boards || this.boards.length == 0) return

    this.started = true
    this.playing = true

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

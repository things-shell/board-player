import { css } from 'lit-element'

export const style = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    overflow: hidden;
  }

  ::slotted > * {
    flex: 1;
  }

  board-wrapper {
    width: 100%;
    height: 100%;
  }

  board-wrapper[front] {
    background: black;
  }

  board-wrapper[back] {
    background: black;
  }

  #fab {
    position: absolute;
    right: 15px;
    bottom: 15px;
  }

  #fab[hidden] {
    display: none;
  }
`

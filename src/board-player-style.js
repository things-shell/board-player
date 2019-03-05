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

  #control {
    position: absolute;
    width: 100%;
    display: block;
    bottom: 15px;
  }

  #control[hidden] {
    display: none;
  }

  [hidden] {
    display: none;
  }
`

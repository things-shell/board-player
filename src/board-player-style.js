import { css } from 'lit-element'

export const style = css`
  :host {
    display: flex;
    position: relative;
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
    left: 50%;
    bottom: 15px;
    transform: translateX(-50%);

    padding: 10px;
    background-color: #cc3300;
  }

  #control[hidden] {
    display: none;
  }

  #control > div > * {
    cursor: pointer;
  }

  [hidden] {
    display: none;
  }
`

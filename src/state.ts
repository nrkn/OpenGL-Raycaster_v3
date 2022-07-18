import { State } from './types.js'

const frame1 = 0
const frame2 = 0
const frameDelta = 0
const gameState = 0
const timer = 0
const fade = 0

export const state: State = { frame1, frame2, frameDelta, gameState, timer, fade }

export const goto = (gameState: number) => {
  state.fade = 0
  state.timer = 0
  state.gameState = gameState
}
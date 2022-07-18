//------------------------YouTube-3DSage----------------------------------------
//Full video: https://www.youtube.com/watch?v=w0Bm4IA-Ii8
//WADS to move player, E open door after picking up the key

import { viewHeight, viewWidth } from './const.js'
import { canvas } from './render.js'
import { mapWalls } from './map.js'
import { initSprites } from './sprite.js'
import { initPlayer } from './player.js'
import { goto, state } from './state.js'
import { drawRays } from './draw/draw-rays.js'
import { drawSprites } from './draw/draw-sprites.js'
import { drawSky } from './draw/draw-sky.js'
import { drawScreen } from './draw/draw-screen.js'
import { simulation } from './simulation.js'

//screen window rescaled, handle 
const resize = (w: number, h: number) => {
  // no need, handled in CSS, but useful later
}

addEventListener('resize', () => resize(innerWidth, innerHeight))

//init all variables when game starts
const init = () => {
  //close doors
  mapWalls[19] = 4
  mapWalls[26] = 4

  initPlayer()
  initSprites()

  state.fade = 0
  state.timer = 0
  state.gameState = 1
}

const showScreen = (curr: number, next: number) => {
  drawScreen(curr)
  state.timer += 1 * state.frameDelta
  if (state.timer > 2000) goto(next)
}

const tick = (time: number) => {
  //frames per second
  state.frame2 = time
  state.frameDelta = (state.frame2 - state.frame1)
  state.frame1 = time

  canvas.width = viewWidth
  canvas.height = viewHeight

  //init game
  if (state.gameState === 0) init()

  //start screen
  if (state.gameState === 1) showScreen( 1, 2 )

  //The main game loop
  if (state.gameState === 2) {
    simulation()
    drawSky()
    drawRays()
    drawSprites()
  }

  //won screen
  if (state.gameState === 3) showScreen(2,0)

  //lost screen
  if (state.gameState === 4) showScreen(3,0)

  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)

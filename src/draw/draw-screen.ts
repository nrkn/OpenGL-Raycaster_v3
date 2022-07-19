import { viewHeight, cellSize, viewWidth } from '../const.js'
import { setColorBytes, drawPoint } from '../render.js'
import { loseScreen } from '../textures/lose-screen.js'
import { titleScreen } from '../textures/title-screen.js'
import { winScreen } from '../textures/win-screen.js'
import { state } from '../state.js'

//draw any full screen image. 120x80 pixels
export const drawScreen = (v: number) => {
  let x = 0
  let y = 0
  let T: number[] = []

  if (v == 1) { T = titleScreen }
  if (v == 2) { T = winScreen }
  if (v == 3) { T = loseScreen }
  
  for (y = 0; y < viewHeight; y++) {
    for (x = 0; x < viewWidth; x++) {
      let pixel = (y * viewWidth + x) * 3
      let red = T[pixel + 0] * state.fade
      let green = T[pixel + 1] * state.fade
      let blue = T[pixel + 2] * state.fade
      
      setColorBytes(red, green, blue)
      drawPoint(x * cellSize, y * cellSize)
    }
  }
  
  if (state.fade < 1) { state.fade += 0.001 * state.frameDelta }
  if (state.fade > 1) { state.fade = 1 }
}

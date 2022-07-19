import { cellSize, viewCY, viewWidth } from '../const.js'
import { setColorBytes, drawPoint } from '../render.js'
import { sky } from '../textures/sky.js'
import { player } from '../player.js'

//draw sky and rotate based on player rotation
export const drawSky = () => { 
  for (let y = 0; y < viewCY; y++) {
    for (let x = 0; x < viewWidth; x++) {      
      let xo = (player.angle * 2 - x) | 0
      
      //return 0-120 based on player angle
      if (xo < 0) xo += viewWidth   
      xo = xo % viewWidth
      
      const pixel = (y * viewWidth + xo) * 3
      const red = sky[pixel + 0]
      const green = sky[pixel + 1]
      const blue = sky[pixel + 2]
      
      setColorBytes(red, green, blue)
      drawPoint(x * cellSize, y * cellSize)
    }
  }
}

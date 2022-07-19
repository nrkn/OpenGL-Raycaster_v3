import { fov, fovH, depth, cellSize } from '../const.js'
import { player } from '../player.js'
import { setPointSize, setColorBytes, drawPoint } from '../render.js'
import { sprites } from '../sprite.js'
import { spriteSheet } from '../textures/sprite-sheet.js'
import { degToRad } from '../util.js'

export const drawSprites = () => {
  let x = 0
  let y = 0

  setPointSize(cellSize)

  for (let s = 0; s < sprites.length; s++) {
    // temp float variables
    let sx = sprites[s].x - player.x
    let sy = sprites[s].y - player.y
    let sz = sprites[s].z

    // rotate around origin
    let pCos = Math.cos(degToRad(player.angle))
    let pSin = Math.sin(degToRad(player.angle))
    let a = sy * pCos + sx * pSin
    let b = sx * pCos - sy * pSin

    sx = a
    sy = b
    //convert to screen x,y
    sx = (sx * 108.0 / sy) + (fov / 2)
    sy = (sz * 108.0 / sy) + (fovH / 2)

    //scale sprite based on distance
    let scale = (32 * 80 / b) | 0
    if (scale < 0) { scale = 0 }
    if (scale > fov) { scale = fov }

    //texture
    let t_x = 0
    let t_y = 31
    let t_x_step = 31.5 / scale
    let t_y_step = 32.0 / scale

    for (x = ((sx - scale / 2) | 0); x < sx + scale / 2; x++) {
      t_y = 31

      for (y = 0; y < scale; y++) {
        if (sprites[s].state === 1 && x > 0 && x < fov && b < depth[x]) {
          const pixel = (
            ((t_y | 0) * 32 + (t_x | 0)) * 3 +
            (sprites[s].map * 32 * 32 * 3)
          )
          const red = spriteSheet[pixel + 0]
          const green = spriteSheet[pixel + 1]
          const blue = spriteSheet[pixel + 2]

          if (red !== 255 && green !== 0 && blue !== 255) // purple transparent
          {
            //draw point             
            setColorBytes(red, green, blue)
            drawPoint(x * cellSize, Math.floor( ( sy * cellSize - y * cellSize) / cellSize ) * cellSize )
          }

          t_y -= t_y_step
          if (t_y < 0) { t_y = 0 }
        }
      }
      t_x += t_x_step
    }
  }
}

import { viewHeight, depth, cellSize, viewWidth, texHeight, texWidth } from '../const.js'
import { player } from '../player.js'
import { setColorBytes, drawPoint } from '../render.js'
import { sprites } from '../sprite.js'
import { spriteSheet } from '../textures/sprite-sheet.js'
import { degToRad } from '../util.js'

export const drawSprites = () => {
  let x = 0
  let y = 0

  const pCos = Math.cos(degToRad(player.angle))
  const pSin = Math.sin(degToRad(player.angle))

  for (let s = 0; s < sprites.length; s++) {
    // temp float variables
    let sx = sprites[s].x - player.x
    let sy = sprites[s].y - player.y
    let sz = sprites[s].z

    // rotate around origin
    let a = sy * pCos + sx * pSin
    let b = sx * pCos - sy * pSin

    sx = a
    sy = b
    //convert to screen x,y
    sx = (sx * viewWidth * 1.1 / sy) + (viewWidth / 2)
    sy = (sz * viewWidth * 1.1 / sy) + (viewHeight / 2)

    //scale sprite based on distance
    let scale = (texHeight * viewHeight / b) | 0
    if (scale < 0) { scale = 0 }
    if (scale > viewWidth) { scale = viewWidth }

    //texture
    let t_x = 0
    let t_y = texHeight - 1
    let t_x_step = (texHeight - 0.5) / scale
    let t_y_step = texHeight / scale

    for (x = ((sx - scale / 2) | 0); x < sx + scale / 2; x++) {
      t_y = texHeight - 1

      for (y = 0; y < scale; y++) {
        if (sprites[s].state === 1 && x > 0 && x < viewWidth && b < depth[x]) {
          const pixel = (
            ((t_y | 0) * texWidth + (t_x | 0)) * 3 +
            (sprites[s].map * texWidth * texHeight * 3)
          )
          const red = spriteSheet[pixel + 0]
          const green = spriteSheet[pixel + 1]
          const blue = spriteSheet[pixel + 2]

          const isMagenta = red === 255 && green === 0 && blue === 255

          if (!isMagenta)
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

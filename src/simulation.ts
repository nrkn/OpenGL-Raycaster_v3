import { mapX } from './const.js'
import { Keys } from './io.js'
import { mapWalls } from './map.js'
import { degToRad, wrapAngle } from './util.js'
import { sprites } from './sprite.js'
import { player } from './player.js'
import { goto, state } from './state.js'

export const simulation = () => {
  //Entered block 1, Win game!!
  if (player.x >> 6 == 1 && player.y >> 6 == 1) {
    goto(3)

    return
  }

  //enemy attack
  //normal grid position
  const spx = sprites[3].x >> 6
  const spy = sprites[3].y >> 6
  //normal grid position plus     offset
  const spx_add = (sprites[3].x + 15) >> 6
  const spy_add = (sprites[3].y + 15) >> 6
  //normal grid position subtract offset
  const spx_sub = (sprites[3].x - 15) >> 6
  const spy_sub = (sprites[3].y - 15) >> 6

  if (sprites[3].x > player.x && mapWalls[spy * 8 + spx_sub] === 0) {
    sprites[3].x -= 0.04 * state.frameDelta
  }
  if (sprites[3].x < player.x && mapWalls[spy * 8 + spx_add] === 0) {
    sprites[3].x += 0.04 * state.frameDelta
  }
  if (sprites[3].y > player.y && mapWalls[spy_sub * 8 + spx] === 0) {
    sprites[3].y -= 0.04 * state.frameDelta
  }
  if (sprites[3].y < player.y && mapWalls[spy_add * 8 + spx] === 0) {
    sprites[3].y += 0.04 * state.frameDelta
  }

  // killed by enemy
  if (
    player.x < sprites[3].x + 30 && player.x > sprites[3].x - 30 &&
    player.y < sprites[3].y + 30 && player.y > sprites[3].y - 30
  ) {
    goto(4)

    return
  }


  //pick up key 	
  if (
    player.x < sprites[0].x + 30 && player.x > sprites[0].x - 30 &&
    player.y < sprites[0].y + 30 && player.y > sprites[0].y - 30
  ) {
    sprites[0].state = 0
  }


  //open doors
  if (Keys.KeyE && sprites[0].state == 0) {
    let xo = 0; if (player.dx < 0) { xo = -25; } else { xo = 25; }
    let yo = 0; if (player.dy < 0) { yo = -25; } else { yo = 25; }
    let ipx_add_xo = (player.x + xo) / 64.0
    let ipy_add_yo = (player.y + yo) / 64.0

    // set the door to floor
    if (mapWalls[(ipy_add_yo | 0) * mapX + (ipx_add_xo | 0)] === 4) {
      mapWalls[(ipy_add_yo | 0) * mapX + (ipx_add_xo | 0)] = 0
    }
  }

  // rotate left
  if (Keys.KeyA) {
    player.angle += 0.2 * state.frameDelta
  }

  // rotate right
  if (Keys.KeyD) {
    player.angle -= 0.2 * state.frameDelta
  }

  if (Keys.KeyA || Keys.KeyD) {
    player.angle = wrapAngle(player.angle)
    player.dx = Math.cos(degToRad(player.angle))
    player.dy = -Math.sin(degToRad(player.angle))
  }

  //x offset to check map
  let xo = 0
  if (player.dx < 0) { xo = -20 } else { xo = 20 }
  //y offset to check map
  let yo = 0
  if (player.dy < 0) { yo = -20 } else { yo = 20 }

  //x position and offset
  let ipx = player.x / 64.0
  let ipx_add_xo = (player.x + xo) / 64.0
  let ipx_sub_xo = (player.x - xo) / 64.0;
  //y position and offset
  let ipy = player.y / 64.0
  let ipy_add_yo = (player.y + yo) / 64.0
  let ipy_sub_yo = (player.y - yo) / 64.0;

  if (Keys.KeyW) //move forward
  {
    if (mapWalls[(ipy | 0) * mapX + (ipx_add_xo | 0)] === 0) { 
      player.x += player.dx * 0.2 * state.frameDelta 
    }
    if (mapWalls[(ipy_add_yo | 0) * mapX + (ipx | 0)] === 0) { 
      player.y += player.dy * 0.2 * state.frameDelta
    }
  }
  if (Keys.KeyS) //move backward
  {
    if (mapWalls[(ipy | 0) * mapX + (ipx_sub_xo | 0)] === 0) { 
      player.x -= player.dx * 0.2 * state.frameDelta
    }
    if (mapWalls[(ipy_sub_yo | 0) * mapX + (ipx | 0)] === 0) { 
      player.y -= player.dy * 0.2 * state.frameDelta
    }
  }
}

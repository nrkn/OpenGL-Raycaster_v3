import { bumpRadius, mapUnitSize, mapWidth, playerSpeed, wallSlide } from './const.js'
import { Keys } from './io.js'
import { mapWalls } from './map.js'
import { degToRad, wrapAngle } from './util.js'
import { sprites } from './sprite.js'
import { player } from './player.js'
import { goto, state } from './state.js'

export const simulation = () => {
  //Entered block 1, Win game!!
  if (player.x >> 6 === 1 && player.y >> 6 === 1) {
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

  if (sprites[3].x > player.x && mapWalls[spy * mapWidth + spx_sub] === 0) {
    sprites[3].x -= 0.04 * state.frameDelta
  }
  if (sprites[3].x < player.x && mapWalls[spy * mapWidth + spx_add] === 0) {
    sprites[3].x += 0.04 * state.frameDelta
  }
  if (sprites[3].y > player.y && mapWalls[spy_sub * mapWidth + spx] === 0) {
    sprites[3].y -= 0.04 * state.frameDelta
  }
  if (sprites[3].y < player.y && mapWalls[spy_add * mapWidth + spx] === 0) {
    sprites[3].y += 0.04 * state.frameDelta
  }

  // killed by enemy
  if (
    player.x < sprites[3].x + bumpRadius && 
    player.x > sprites[3].x - bumpRadius &&
    player.y < sprites[3].y + bumpRadius && 
    player.y > sprites[3].y - bumpRadius
  ) {
    goto(4)

    return
  }


  //pick up key 	
  if (
    player.x < sprites[0].x + bumpRadius && 
    player.x > sprites[0].x - bumpRadius &&
    player.y < sprites[0].y + bumpRadius && 
    player.y > sprites[0].y - bumpRadius
  ) {
    sprites[0].state = 0
  }


  //open doors
  if (Keys.KeyE && sprites[0].state == 0) {
    let xo = 0; 
    let yo = 0; 

    if (player.dx < 0) { xo = -25; } else { xo = 25; }
    if (player.dy < 0) { yo = -25; } else { yo = 25; }

    let ipx_add_xo = (player.x + xo) / mapUnitSize
    let ipy_add_yo = (player.y + yo) / mapUnitSize

    // set the door to floor
    if (mapWalls[(ipy_add_yo | 0) * mapWidth + (ipx_add_xo | 0)] === 4) {
      mapWalls[(ipy_add_yo | 0) * mapWidth + (ipx_add_xo | 0)] = 0
    }
  }

  // rotate left
  if (Keys.KeyA) {
    player.angle += playerSpeed * state.frameDelta
  }

  // rotate right
  if (Keys.KeyD) {
    player.angle -= playerSpeed * state.frameDelta
  }

  if (Keys.KeyA || Keys.KeyD) {
    player.angle = wrapAngle(player.angle)
    player.dx = Math.cos(degToRad(player.angle))
    player.dy = -Math.sin(degToRad(player.angle))
  }

  //x offset to check map
  let xo = 0
  if (player.dx < 0) { xo = -wallSlide } else { xo = wallSlide }
  //y offset to check map
  let yo = 0
  if (player.dy < 0) { yo = -wallSlide } else { yo = wallSlide }

  //x position and offset
  let ipx = player.x / mapUnitSize
  let ipx_add_xo = (player.x + xo) / mapUnitSize
  let ipx_sub_xo = (player.x - xo) / mapUnitSize
  //y position and offset
  let ipy = player.y / mapUnitSize
  let ipy_add_yo = (player.y + yo) / mapUnitSize
  let ipy_sub_yo = (player.y - yo) / mapUnitSize

  if (Keys.KeyW) //move forward
  {
    if (mapWalls[(ipy | 0) * mapWidth + (ipx_add_xo | 0)] === 0) { 
      player.x += player.dx * playerSpeed * state.frameDelta 
    }
    if (mapWalls[(ipy_add_yo | 0) * mapWidth + (ipx | 0)] === 0) { 
      player.y += player.dy * playerSpeed * state.frameDelta
    }
  }
  if (Keys.KeyS) //move backward
  {
    if (mapWalls[(ipy | 0) * mapWidth + (ipx_sub_xo | 0)] === 0) { 
      player.x -= player.dx * playerSpeed * state.frameDelta
    }
    if (mapWalls[(ipy_sub_yo | 0) * mapWidth + (ipx | 0)] === 0) { 
      player.y -= player.dy * playerSpeed * state.frameDelta
    }
  }
}

import {
  fov, mapX, mapY, mapS, viewHeight, viewCY, depth, cellSize
} from '../const.js'

import { mapWalls, mapFloors, mapCeils } from '../map.js'
import { player } from '../player.js'

import {
  setColorF, setPointSize, setColorBytes, drawPoint
} from '../render.js'

import { textureSheet } from '../textures/texture-sheet.js'
import { wrapAngle, degToRad } from '../util.js'

const epsilonA = 0.001
const epsilonW = 0.0001

const drawWalls = true
const drawFloors = true
const drawCeils = true

export const drawRays = () => {
  let r = 0
  let mx = 0
  let my = 0
  let mp = 0
  let dof = 0
  let side = 0

  let vx = 0
  let vy = 0
  let rx = 0
  let ry = 0
  let ra = 0
  let xo = 0
  let yo = 0
  let disV = 0
  let disH = 0

  let raTan = 0

  // ray set back 30 degrees
  ra = wrapAngle(player.angle + 30)

  setPointSize(cellSize)

  for (r = 0; r < fov; r++) {
    // vertical and horizontal map texture number
    let vmt = 0
    let hmt = 0

    // vertical walls
    dof = 0
    side = 0
    disV = 100000

    raTan = Math.tan(degToRad(ra))

    if (Math.cos(degToRad(ra)) > epsilonA) {
      // looking left
      rx = ((player.x >> 6) << 6) + 64
      ry = (player.x - rx) * raTan + player.y
      xo = 64
      yo = -xo * raTan
    } else if (Math.cos(degToRad(ra)) < epsilonA) {
      // looking right
      rx = ((player.x >> 6) << 6) - epsilonW
      ry = (player.x - rx) * raTan + player.y
      xo = -64; yo = -xo * raTan
    } else {
      // looking up or down. no hit  
      rx = player.x
      ry = player.y
      dof = 8
    }

    while (dof < 8) {
      mx = (rx) >> 6
      my = (ry) >> 6
      mp = my * mapX + mx

      if (mp > 0 && mp < mapX * mapY && mapWalls[mp] > 0) {
        // hit         
        vmt = mapWalls[mp] - 1
        dof = 8
        disV = (
          Math.cos(degToRad(ra)) * (rx - player.x) -
          Math.sin(degToRad(ra)) * (ry - player.y)
        )
      } else {
        // check next horizontal
        rx += xo
        ry += yo
        dof += 1
      }
    }

    vx = rx
    vy = ry

    // horizontal walls
    dof = 0; disH = 100000
    raTan = 1.0 / raTan

    if (Math.sin(degToRad(ra)) > epsilonA) {
      // looking up 
      ry = ((player.y >> 6) << 6) - epsilonW
      rx = (player.y - ry) * raTan + player.x
      yo = -64
      xo = -yo * raTan
    }
    else if (Math.sin(degToRad(ra)) < -epsilonA) {
      // looking down
      ry = ((player.y >> 6) << 6) + 64
      rx = (player.y - ry) * raTan + player.x
      yo = 64
      xo = -yo * raTan
    } else {
      // looking straight left or right
      rx = player.x
      ry = player.y
      dof = 8
    }

    while (dof < 8) {
      mx = (rx) >> 6
      my = (ry) >> 6
      mp = my * mapX + mx;
      if (mp > 0 && mp < mapX * mapY && mapWalls[mp] > 0) {
        // hit         
        hmt = mapWalls[mp] - 1
        dof = 8
        disH = (
          Math.cos(degToRad(ra)) * (rx - player.x) -
          Math.sin(degToRad(ra)) * (ry - player.y)
        )
      } else {
        // check next horizontal
        rx += xo
        ry += yo
        dof += 1
      }
    }

    let shade = 1
    setColorF(0, 0.8, 0)
    if (disV < disH) {
      // horizontal hit first
      hmt = vmt
      shade = 0.5
      rx = vx
      ry = vy
      disH = disV
      setColorF(0, 0.6, 0)
    }

    const ca = wrapAngle(player.angle - ra)

    disH = disH * Math.cos(degToRad(ca))

    // fix fisheye 
    let lineH = (mapS * viewHeight) / (disH)
    const ty_step = 32 / lineH
    let ty_off = 0
    if (lineH > viewHeight) {
      // line height and limit
      ty_off = (lineH - viewHeight) / 2
      lineH = viewHeight
    }
    
    // line offset
    const lineOff = viewCY - (lineH >> 1)

    // save this line's depth
    depth[r] = disH

    // draw walls
    let y = 0
    let ty = ty_off * ty_step
    let tx = 0
    if (shade === 1) {
      tx = (rx / 2) % 32
      if (ra > 180) {
        tx = 31 - tx
      }
    } else {
      tx = (ry / 2) % 32
      if (ra > 90 && ra < 270) {
        tx = 31 - tx
      }
    }

    if( drawWalls ){
      for (y = 0; y < lineH; y++ ) {
        if( y % 8 === 0 ){
          let pixel = ((ty | 0) * 32 + (tx | 0)) * 3 + (hmt * 32 * 32 * 3)
          let red = textureSheet[pixel + 0] * shade
          let green = textureSheet[pixel + 1] * shade
          let blue = textureSheet[pixel + 2] * shade
          
          setColorBytes(red, green, blue)
          drawPoint(r * cellSize, Math.floor((y + lineOff)/cellSize)*cellSize )  
        }
  
        ty += ty_step
      }
    }    

    // draw floors and ceils
    for (y = (((lineOff + lineH)/cellSize) | 0)* cellSize; y < viewHeight; y++ ) {
      const dy = y - (viewHeight / 2)
      const deg = degToRad(ra)
      const raFix = Math.cos(degToRad(wrapAngle(player.angle - ra)))

      tx = player.x / 2 + Math.cos(deg) * 158 * 2 * 32 / dy / raFix
      ty = player.y / 2 - Math.sin(deg) * 158 * 2 * 32 / dy / raFix

      if( y % 8 === 0 && drawFloors ){
        // floors
        const mp = mapFloors[((ty / 32) | 0) * mapX + ((tx / 32) | 0)] * 32 * 32
        const pixel = (((ty) & 31) * 32 + ((tx) & 31)) * 3 + mp * 3
        const red = textureSheet[pixel + 0] * 0.7
        const green = textureSheet[pixel + 1] * 0.7
        const blue = textureSheet[pixel + 2] * 0.7

        setColorBytes(red, green, blue)
        drawPoint(r * cellSize, y )
      }

      if( y % 8 === 0 && drawCeils ){
        // ceils
        const mp = mapCeils[((ty / 32) | 0) * mapX + ((tx / 32) | 0)] * 32 * 32
        const pixel = (((ty) & 31) * 32 + ((tx) & 31)) * 3 + mp * 3
        const red = textureSheet[pixel + 0]
        const green = textureSheet[pixel + 1]
        const blue = textureSheet[pixel + 2]

        if (mp > 0) {
          setColorBytes(red, green, blue)
          drawPoint(r * cellSize, viewHeight - y )
        }
      }
    }

    //go to next ray
    ra = wrapAngle(ra - 0.5)
  }
}

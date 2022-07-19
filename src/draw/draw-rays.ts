import {
  mapWidth, mapHeight, mapUnitSize, canvasHeight, canvasCY, depth, cellSize, 
  viewWidth, maxDof, fovC, fov, texHeight, texWidth, shadeFloor
} from '../const.js'

import { mapWalls, mapFloors, mapCeils } from '../map.js'
import { player } from '../player.js'

import {
  setColorF, setColorBytes, drawPoint
} from '../render.js'

import { textureSheet } from '../textures/texture-sheet.js'
import { wrapAngle, degToRad } from '../util.js'

const epsilonA = 0.001
const epsilonW = 0.0001

const drawWalls = true
const drawFloors = true
const drawCeils = true

export const drawRays = () => {
  let col = 0
  let mx = 0
  let my = 0
  let mp = 0
  let dof = 0
  let side = 0

  let vx = 0
  let vy = 0
  let rx = 0
  let ry = 0
  let ray = 0
  let xo = 0
  let yo = 0
  let disV = 0
  let disH = 0

  let rayTan = 0
  let rayCos = 0
  let raySin = 0

  // ray set back half of fov
  ray = wrapAngle(player.angle + fovC)

  for (col = 0; col < viewWidth; col++) {
    // vertical and horizontal map texture number
    let vmt = 0
    let hmt = 0

    // vertical walls
    dof = 0
    side = 0
    disV = 100000

    rayTan = Math.tan(degToRad(ray))
    rayCos = Math.cos(degToRad(ray))
    raySin = Math.sin(degToRad(ray))

    if (rayCos > epsilonA) {
      // looking left
      rx = ((player.x >> 6) << 6) + mapUnitSize
      ry = (player.x - rx) * rayTan + player.y
      xo = mapUnitSize
      yo = -xo * rayTan
    } else if (rayCos < epsilonA) {
      // looking right
      rx = ((player.x >> 6) << 6) - epsilonW
      ry = (player.x - rx) * rayTan + player.y
      xo = -mapUnitSize; yo = -xo * rayTan
    } else {
      // looking up or down. no hit  
      rx = player.x
      ry = player.y
      dof = maxDof
    }

    while (dof < maxDof) {
      mx = (rx) >> 6
      my = (ry) >> 6
      mp = my * mapWidth + mx

      if (mp > 0 && mp < mapWidth * mapHeight && mapWalls[mp] > 0) {
        // hit         
        vmt = mapWalls[mp] - 1
        dof = maxDof
        disV = (
          rayCos * (rx - player.x) -
          Math.sin(degToRad(ray)) * (ry - player.y)
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
    rayTan = 1.0 / rayTan

    if (raySin > epsilonA) {
      // looking up 
      ry = ((player.y >> 6) << 6) - epsilonW
      rx = (player.y - ry) * rayTan + player.x
      yo = -mapUnitSize
      xo = -yo * rayTan
    }
    else if (raySin < -epsilonA) {
      // looking down
      ry = ((player.y >> 6) << 6) + mapUnitSize
      rx = (player.y - ry) * rayTan + player.x
      yo = mapUnitSize
      xo = -yo * rayTan
    } else {
      // looking straight left or right
      rx = player.x
      ry = player.y
      dof = maxDof
    }

    while (dof < maxDof) {
      mx = (rx) >> 6
      my = (ry) >> 6
      mp = my * mapWidth + mx;
      if (mp > 0 && mp < mapWidth * mapHeight && mapWalls[mp] > 0) {
        // hit         
        hmt = mapWalls[mp] - 1
        dof = maxDof
        disH = (
          rayCos * (rx - player.x) -
          raySin * (ry - player.y)
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

    const ca = wrapAngle(player.angle - ray)

    disH = disH * Math.cos(degToRad(ca))

    // fix fisheye - only seems to work properly for 60 deg fov?
    let lineH = (mapUnitSize * canvasHeight) / (disH)
    const ty_step = texHeight / lineH
    let ty_off = 0
    if (lineH > canvasHeight) {
      // line height and limit
      ty_off = (lineH - canvasHeight) / 2
      lineH = canvasHeight
    }
    
    // line offset
    const lineOff = canvasCY - (lineH >> 1)

    // save this line's depth
    depth[col] = disH

    // draw walls
    let y = 0
    let ty = ty_off * ty_step
    let tx = 0
    if (shade === 1) {
      tx = (rx / 2) % texWidth
      if (ray > 180) {
        tx = texWidth - 1 - tx
      }
    } else {
      tx = (ry / 2) % texWidth
      if (ray > 90 && ray < 270) {
        tx = texWidth - 1 - tx
      }
    }

    if( drawWalls ){
      for (y = 0; y < lineH; y++ ) {
        if( y % cellSize === 0 ){
          const pixel = ((ty | 0) * texWidth + (tx | 0)) * 3 + (hmt * texWidth * texHeight * 3)
          const red = textureSheet[pixel + 0] * shade
          const green = textureSheet[pixel + 1] * shade
          const blue = textureSheet[pixel + 2] * shade
          
          setColorBytes(red, green, blue)
          drawPoint(col * cellSize, Math.floor((y + lineOff)/cellSize)*cellSize )  
        }
  
        ty += ty_step
      }
    }    

    // draw floors and ceils
    for (y = (((lineOff + lineH)/cellSize) | 0)* cellSize; y < canvasHeight; y++ ) {
      const dy = y - (canvasHeight / 2)
      const deg = degToRad(ray)
      const raFix = Math.cos(degToRad(wrapAngle(player.angle - ray)))

      // todo: magic number 158 is something to do with tan and aspect ratio
      // I'm not certain (cellSize / 4 ) is correct either
      tx = player.x / 2 + Math.cos(deg) * 158 * ( cellSize / 4 ) * texWidth / dy / raFix
      ty = player.y / 2 - Math.sin(deg) * 158 * ( cellSize / 4 ) * texHeight / dy / raFix

      if( y % cellSize === 0 && drawFloors ){
        // floors
        const mp = mapFloors[((ty / texHeight) | 0) * mapWidth + ((tx / texWidth) | 0)] * texWidth * texHeight
        const pixel = (((ty) & (texWidth-1)) * texWidth + ((tx) & (texWidth-1))) * 3 + mp * 3
        const red = textureSheet[pixel + 0] * shadeFloor
        const green = textureSheet[pixel + 1] * shadeFloor
        const blue = textureSheet[pixel + 2] * shadeFloor

        setColorBytes(red, green, blue)
        drawPoint(col * cellSize, y )
      }

      if( y % cellSize === 0 && drawCeils ){
        // ceils
        const mp = mapCeils[((ty / texHeight) | 0) * mapWidth + ((tx / texWidth) | 0)] * texWidth * texHeight

        if (mp > 0) {
          const pixel = (((ty) & (texHeight-1)) * texWidth + ((tx) & (texWidth-1))) * 3 + mp * 3
          const red = textureSheet[pixel + 0]
          const green = textureSheet[pixel + 1]
          const blue = textureSheet[pixel + 2]

          setColorBytes(red, green, blue)
          drawPoint(col * cellSize, canvasHeight - y )
        }
      }
    }

    //go to next ray - uh I think we just adjust so that viewWidth * second number === fov
    ray = wrapAngle(ray - fov / viewWidth )
  }
}

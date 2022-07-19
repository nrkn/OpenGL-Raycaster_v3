//------------------------YouTube-3DSage----------------------------------------
//Full video: https://www.youtube.com/watch?v=w0Bm4IA-Ii8
//WADS to move player, E open door after picking up the key

import { viewHeight, viewWidth } from './const.js'
import { canvas, ctx, getLog, setDebug } from './render.js'
import { mapWalls } from './map.js'
import { initSprites } from './sprite.js'
import { initPlayer } from './player.js'
import { goto, state } from './state.js'
import { drawRays } from './draw/draw-rays.js'
import { drawSprites } from './draw/draw-sprites.js'
import { drawSky } from './draw/draw-sky.js'
import { drawScreen } from './draw/draw-screen.js'
import { simulation } from './simulation.js'
import { Tuple2, Tuple3, Tuple5 } from './types.js'

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

let frames = Array<number>(60).fill(60)

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
  if (state.gameState === 1) showScreen(1, 2)

  //The main game loop
  if (state.gameState === 2) {
    // capture one frame
    if (isD) setDebug(true)

    simulation()
    drawSky()
    drawRays()
    drawSprites()

    if (isD) {
      onDebug()
      setDebug(false)
      isD = false
    }
  }

  //won screen
  if (state.gameState === 3) showScreen(2, 0)

  //lost screen
  if (state.gameState === 4) showScreen(3, 0)

  frames.push(1000 / state.frameDelta)
  frames = frames.slice(1)

  const fps = frames.reduce((prev, curr) => prev + curr) / frames.length

  ctx.fillStyle = '#ff0'
  ctx.fillText(`${fps | 0}`.padStart(3, ' ') + 'fps', 8, 16)

  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)

//

let isD = false

canvas.addEventListener('click', () => {
  if (!isD) {
    console.log('listening')
    isD = true
  }
})

const onDebug = () => {
  const log = getLog()

  const points: Tuple2[] = []

  let minX = Number.MAX_SAFE_INTEGER
  let minY = Number.MAX_SAFE_INTEGER
  let maxX = Number.MIN_SAFE_INTEGER
  let maxY = Number.MIN_SAFE_INTEGER

  const xSet = new Set<number>()
  const ySet = new Set<number>()

  for (const l of log) {
    const [name, ...args] = l

    if (name === 'drawPoint') {
      let [x, y] = args

      x |= 0
      y |= 0

      points.push([x, y])
      xSet.add(x)
      ySet.add(y)

      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  // lets take the second value in x set and find every y for that x and its color
  const targetX = 8
  const colorPoints: Tuple5[] = []

  let color: Tuple3 = [ 0, 0, 0 ]
  for( const l of log ){
    const [name, ...args] = l

    if( name === 'setColorBytes' ){
      const [ r, g,b ] = args
      color = [ r,g,b]
    }

    if (name === 'drawPoint') {
      let [x, y] = args

      if( x !== targetX ) continue

      const colorP: Tuple5 = [ x, y, ...color ]

      colorPoints.push( colorP )
    }
  }

  colorPoints.sort( ( a, b ) => a[ 1 ] - b[ 1 ] ) 

  const pointSet = new Set<string>(points.map(p => `[${p.join()}]`))

  const allPoints = [...pointSet].join()

  console.log(allPoints)
  console.log(
    { minX, minY, maxX, maxY },
    'renderered point count', points.length,
    'pointSet size', pointSet.size,
    'xSet size', xSet.size,
    'ySet size', ySet.size
  )
  console.log([...ySet].sort((a, b) => a - b).join())
  console.log({ colorPoints })
}

//
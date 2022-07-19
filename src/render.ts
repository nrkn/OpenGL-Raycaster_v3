import { canvasWidth, canvasHeight, cellSize } from './const.js'
import { assrt } from './util.js'

export const canvas = document.createElement('canvas')

canvas.width = canvasWidth
canvas.height = canvasHeight

document.body.append(canvas)

export const ctx = assrt(
  canvas.getContext('2d'), 'Expected 2D canvas context'
)

//

let isDebugLog = false

export const setDebug = (isDebug: boolean) => {
  isDebugLog = isDebug
  
  if( !isDebug ) debugLog.length = 0
}

export const getLog = () => debugLog

const debugLog: [string, ...any][] = []

//

let lastR = 0
let lastG = 0
let lastB = 0

export const setColorBytes = (red: number, green: number, blue: number) => {
  if( red === lastR && green === lastG && blue === lastB ) return

  ctx.fillStyle = `#${[red, green, blue].map(
    s => (s | 0).toString(16).padStart(2, '0')
  ).join('')
    }`

  lastR = red
  lastG = green
  lastB = blue

  if (isDebugLog) debugLog.push(['setColorBytes', red, green, blue ])
}

export const setColorF = (red: number, green: number, blue: number) =>
  setColorBytes(red * 255, green * 255, blue * 255)

export const drawPoint = (x: number, y: number ) => {
  ctx.fillRect(x | 0, y | 0, cellSize, cellSize )

  if (isDebugLog) debugLog.push(['drawPoint', x, y ])
}
  

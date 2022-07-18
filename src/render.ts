import { viewWidth, viewHeight } from './const.js'
import { assrt } from './util.js'

export const canvas = document.createElement('canvas')

canvas.width = viewWidth
canvas.height = viewHeight

document.body.append(canvas)

export const ctx = assrt(
  canvas.getContext('2d'), 'Expected 2D canvas context'
)

let pointSize = 0

export const setPointSize = (p: number) => pointSize = p | 0

export const setColorBytes = (red: number, green: number, blue: number) =>
  ctx.fillStyle = `#${[red, green, blue].map(
    s => (s | 0).toString(16).padStart(2, '0')
  ).join('')
  }`

export const setColorF = (red: number, green: number, blue: number) =>
  setColorBytes(red * 255, green * 255, blue * 255)

export const drawPoint = (x: number, y: number) =>
  ctx.fillRect(x | 0, y | 0, pointSize, pointSize)

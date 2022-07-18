import { Player } from './types.js'
import { degToRad } from './util.js'

const x = 150
const y = 400
const angle = 90
const dx = Math.cos(degToRad(angle))
const dy = -Math.sin(degToRad(angle))

export const player: Player = { x, y, angle, dx, dy }

export const initPlayer = () =>
  Object.assign(player, { x, y, angle, dx, dy })

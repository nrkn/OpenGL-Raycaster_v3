import { ButtonKeys } from './types.js'

export const Keys: Partial<ButtonKeys> = {}

addEventListener('keydown', e => Keys[e.code] = 1)
addEventListener('keyup', e => Keys[e.code] = 0)

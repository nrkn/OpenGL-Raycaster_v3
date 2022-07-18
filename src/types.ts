export type Tuple3<T = number> = [T, T, T]

export type ButtonKeys = {
  KeyW: number
  KeyA: number
  KeyD: number
  KeyS: number
  KeyE: number
}

export type Sprite = {
  type: number
  state: number
  map: number
  x: number
  y: number
  z: number
}

export type Player = {
  x: number
  y: number
  dx: number
  dy: number
  angle: number
}

export type State = {
  frame1: number
  frame2: number
  frameDelta: number
  gameState: number
  timer: number
  fade: number
}

// well, we can change this - but leave it for now
export const fov = 60
export const fovC = fov / 2

// changing breaks even if same aspect ratio - haven't found all magic numbers
export const viewWidth = 120
export const viewHeight = 80

export const viewCX = Math.floor( viewWidth / 2 )
export const viewCY = Math.floor( viewHeight / 2 )

export const rayStep = viewWidth / fov
export const rayInc = 1 / rayStep

export const cellSize = 1

export const canvasWidth = viewWidth * cellSize
export const canvasHeight = viewHeight * cellSize
export const canvasCY = Math.floor( canvasHeight / 2 )
export const canvasCX = Math.floor( canvasWidth / 2 )

export const mapWidth = 8      //map width
export const mapHeight = 8      //map height

// this can't be changed unless you go through and fix all the rounding 
// using shifting by 6 bits
export const mapUnitSize = 64      //map cube size

export const texWidth = 32
export const texHeight = 32

export const maxDof = Math.max( mapWidth, mapHeight )

export const playerSpeed = 0.2

export const bumpRadius = 30
export const wallSlide = 20

export const shadeFloor = 0.7

// hold wall line depth to compare for sprite depth
export const depth = Array<number>(viewWidth).fill(0)


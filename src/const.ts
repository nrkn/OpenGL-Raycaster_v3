export const fov = 120

export const fovH = 80
export const fovCX = Math.floor( fov / 2 )
export const fovCY = Math.floor( fovH / 2 )

export const cellSize = 8

export const viewWidth = fov * cellSize
export const viewHeight = fovH * cellSize
export const viewCY = Math.floor( viewHeight / 2 )
export const viewCX = Math.floor( viewWidth / 2 )

export const mapX = 8      //map width
export const mapY = 8      //map height
export const mapS = 64      //map cube size

// hold wall line depth to compare for sprite depth
export const depth = Array<number>(fov).fill(0)

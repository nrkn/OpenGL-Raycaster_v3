import { Sprite } from './types.js'

const createSprites = () => [
  //key 
  {
    type: 1, state: 1, map: 0, x: 1.5 * 64, y: 5 * 64, z: 20,  
  },
  //light 1
  {
    type: 2, state: 1, map: 1, x: 1.5 * 64, y: 4.5 * 64, z: 0, 
  },
  //light 2
  {
    type: 2, state: 1, map: 1, x: 3.5 * 64, y: 4.5 * 64, z: 0, 
  },
  //enemy
  {
    type: 3, state: 1, map: 2, x: 2.5 * 64, y: 2 * 64, z: 20, 
  }
]

export const sprites: Sprite[] = []

export const initSprites = () => {
  const s = createSprites()

  for( let i = 0; i < s.length; i++ ){
    sprites[ i ] = s[ i ]
  }
}

initSprites()

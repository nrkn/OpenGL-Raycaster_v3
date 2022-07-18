export const degToRad = (a: number) => 
  a * Math.PI / 180

export const wrapAngle = (a: number) => { 
  if (a > 359) { a -= 360 } 
  if (a < 0) { a += 360 } 
  
  return a
}

export const assrt = <T>( value: T | null | undefined, message = 'Expected value' ) => {
  if( value === null || value == undefined ) throw Error( message )

  return value
}

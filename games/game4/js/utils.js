export const roomElementSize = 64
export const canvaWidth = 960
export const canvaHeight = 768
export const roomWidth = canvaWidth - (2 * roomElementSize)
export const roomHeight = canvaHeight - (2 * roomElementSize)
export const rows = 12
export const columns = 15

export const possibleXCoords = [128, 256, 384, 512, 640, 768]
export const possibleYCoords = [64, 192, 320, 448, 576, 704]
export const upOrDown = [0, canvaHeight - roomElementSize]
export const leftOrRight = [0, canvaWidth - roomElementSize]
export function int256ToBytes(int: any) {
  const bytesArray: number[] = []
  for (let i = 0; i < 32; i++) {
    let shift = int >> BigInt(8 * i)
    shift &= BigInt(255)
    bytesArray[i] = Number(String(shift))
  }
  return Buffer.from(bytesArray)
}

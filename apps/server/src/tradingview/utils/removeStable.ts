export const removeStable = (pair: string) => {
  return pair.replace('USDT', '').replace('BUSD', '').toUpperCase()
}

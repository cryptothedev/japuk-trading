export const wait = (sec: number) => {
  return new Promise((res) => setTimeout(res, sec * 1000))
}

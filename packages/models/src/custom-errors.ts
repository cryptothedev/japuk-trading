export class SwitchNotMatchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SwitchNotMatchError'
  }
}

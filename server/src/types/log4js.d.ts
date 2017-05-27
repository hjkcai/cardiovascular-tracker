import 'log4js'

declare module 'log4js' {
  interface Logger {
    [index: string]: any
  }
}

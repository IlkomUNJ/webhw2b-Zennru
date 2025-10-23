import type { HttpContext as BaseHttpContext } from '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  export interface HttpContext extends BaseHttpContext {
    view: any
    auth: any
  }
}

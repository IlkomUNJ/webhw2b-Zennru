import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

server.errorHandler(() => import('../app/exceptions/handler.js'))

server.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/static/static_middleware'),
  () => import('@adonisjs/session/session_middleware'),
  //() => import('@adonisjs/shield/shield_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

export const middleware = router.named({
  guest: () => import('#middleware/guest_middleware'),
  auth: () => import('#middleware/auth_middleware'),
})

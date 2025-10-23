import { defineConfig } from '@adonisjs/shield'

export default defineConfig({
  csrf: {
    enabled: true,
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
    exceptRoutes: ['/login', '/logout'],
  },
  csp: {
    enabled: false,
    directives: {},
    reportOnly: false,
  },
  xFrame: { enabled: true, action: 'DENY' },
  hsts: { enabled: false },
  contentTypeSniffing: { enabled: true },
})

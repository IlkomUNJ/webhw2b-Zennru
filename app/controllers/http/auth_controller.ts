import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  private users = [
    { email: 'seller@example.com', password: '12345', role: 'seller' },
    { email: 'buyer@example.com', password: '12345', role: 'buyer' },
  ]

  public async login({ request, session, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    const user = this.users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return response.redirect('/login?error=invalid_credentials')
    }

    session.put('user', user)

    if (user.role === 'seller') {
      return response.redirect('/seller/home')
    } else if (user.role === 'buyer') {
      return response.redirect('/buyer/home')
    }

    return response.redirect('/')
  }

  public async logout({ session, response }: HttpContext) {
    session.forget('user')
    return response.redirect('/login')
  }
}

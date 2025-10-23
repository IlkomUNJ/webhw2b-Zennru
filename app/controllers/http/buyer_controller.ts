import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
import path from 'path'

const productsPath = path.join(process.cwd(), 'data', 'products.json')
const wishlistPath = path.join(process.cwd(), 'data', 'wishlist.json')
const cartPath = path.join(process.cwd(), 'data', 'cart.json')

function loadJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return []
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data || '[]')
}

function saveJSON(filePath: string, data: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export default class BuyerController {
  public async home({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'buyer') return response.redirect('/login?error=unauthorized')

    const wishlist = loadJSON(wishlistPath)
    const cart = loadJSON(cartPath)
    const wishlistCount = wishlist.filter((w) => w.buyerEmail === user.email).length
    const cartCount = cart.filter((c) => c.buyerEmail === user.email).length

    return view.render('buyer/home', { user, wishlistCount, cartCount })
  }
  public async about({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'buyer') return response.redirect('/login?error=unauthorized')

    const wishlist = loadJSON(wishlistPath)
    const cart = loadJSON(cartPath)
    const wishlistCount = wishlist.filter((w) => w.buyerEmail === user.email).length
    const cartCount = cart.filter((c) => c.buyerEmail === user.email).length

    return view.render('buyer/about', { user, wishlistCount, cartCount })
  }

  public async products({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'buyer') return response.redirect('/login?error=unauthorized')

    const products = loadJSON(productsPath)
    const wishlist = loadJSON(wishlistPath)
    const cart = loadJSON(cartPath)

    const wishlistIds = wishlist
      .filter((w) => w.buyerEmail === user.email)
      .map((w) => Number(w.productId))

    const cartIds = cart.filter((c) => c.buyerEmail === user.email).map((c) => Number(c.productId))

    const wishlistCount = wishlistIds.length
    const cartCount = cartIds.length

    return view.render('buyer/products', {
      user,
      products,
      wishlistIds,
      cartIds,
      wishlistCount,
      cartCount,
    })
  }
  public async addWishlist({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')

    const { productId, sellerEmail } = request.only(['productId', 'sellerEmail'])
    const wishlist = loadJSON(wishlistPath)

    const exists = wishlist.find((w) => Number(w.productId) === Number(productId) && w.buyerEmail === user.email
)

    if (!exists) {
      wishlist.push({
        id: wishlist.length + 1,
        productId: Number(productId),
        buyerEmail: user.email,
        sellerEmail,
        createdAt: new Date().toISOString(),
      })
      saveJSON(wishlistPath, wishlist)
    }

    return response.redirect('back')
  }

  public async removeWishlist({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')

    const productId = request.input('productId')
    let wishlist = loadJSON(wishlistPath)

    wishlist = wishlist.filter(
      (w) => !(Number(w.productId) === Number(productId) && w.buyerEmail === user.email)
    )

    saveJSON(wishlistPath, wishlist)
    return response.redirect('back')
  }

  public async wishlist({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'buyer') return response.redirect('/login?error=unauthorized')

    const allProducts = loadJSON(productsPath)
    const allWishlist = loadJSON(wishlistPath)
    const cart = loadJSON(cartPath)

    const buyerWishlist = allWishlist
      .filter((w) => w.buyerEmail === user.email)
      .map((w) => {
        const product = allProducts.find((p) => Number(p.id) === Number(w.productId))
        return { ...w, product: product || null }
      })
      .filter((item) => item.product !== null)

    const wishlistCount = buyerWishlist.length
    const cartCount = cart.filter((c) => c.buyerEmail === user.email).length

    return view.render('buyer/wishlist', {
      user,
      wishlist: buyerWishlist,
      wishlistCount,
      cartCount,
    })
  }

  public async addCart({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')

    const { productId, sellerEmail } = request.only(['productId', 'sellerEmail'])
    const cart = loadJSON(cartPath)

    const exists = cart.find((c) => Number(c.productId) === Number(productId) && c.buyerEmail === user.email
    )

    if (!exists) {
      cart.push({
        id: cart.length + 1,
        productId: Number(productId),
        buyerEmail: user.email,
        sellerEmail,
        createdAt: new Date().toISOString(),
      })
      saveJSON(cartPath, cart)
    }

    return response.redirect('back')
  }

  public async removeCart({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')

    const productId = request.input('productId')
    let cart = loadJSON(cartPath)

    cart = cart.filter(
      (c) => !(Number(c.productId) === Number(productId) && c.buyerEmail === user.email)
    )

    saveJSON(cartPath, cart)
    return response.redirect('back')
  }

  public async cart({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'buyer') return response.redirect('/login?error=unauthorized')

    const allProducts = loadJSON(productsPath)
    const allCart = loadJSON(cartPath)
    const wishlist = loadJSON(wishlistPath)

    const buyerCart = allCart
      .filter((c) => c.buyerEmail === user.email)
      .map((c) => {
        const product = allProducts.find((p) => Number(p.id) === Number(c.productId))
        return { ...c, product: product || null }
      })
      .filter((item) => item.product !== null)

    const wishlistCount = wishlist.filter((w) => w.buyerEmail === user.email).length
    const cartCount = buyerCart.length

    return view.render('buyer/cart', {
      user,
      cart: buyerCart,
      wishlistCount,
      cartCount,
    })
  }
}

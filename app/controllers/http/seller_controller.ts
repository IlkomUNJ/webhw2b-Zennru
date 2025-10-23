import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
import path from 'path'

const productsPath = path.join(process.cwd(), 'data', 'products.json')
const wishlistPath = path.join(process.cwd(), 'data', 'wishlist.json')

function loadJSON(filePath: string) {
  if (!fs.existsSync(filePath)) return []
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data || '[]')
}

function saveJSON(filePath: string, data: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export default class SellerController {
  public async home({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'seller') return response.redirect('/login?error=unauthorized')

    const products = loadJSON(productsPath).filter((p) => p.sellerEmail === user.email)
    return view.render('seller/home', { user, products })
  }

  public async about({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'seller') return response.redirect('/login?error=unauthorized')

    return view.render('seller/about', { user })
  }

  public async wishlist({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'seller') return response.redirect('/login?error=unauthorized')

    const allProducts = loadJSON(productsPath)
    const allWishlist = loadJSON(wishlistPath)

    const sellerWishlist = allWishlist
      .filter((w) => w.sellerEmail === user.email)
      .map((w) => {
        const product = allProducts.find((p) => p.id === w.productId)
        return { ...w, product }
      })

    return view.render('seller/wishlist', { user, wishlist: sellerWishlist })
  }

  public async products({ view, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'seller') return response.redirect('/login?error=unauthorized')

    const products = loadJSON(productsPath)
    return view.render('seller/products', { user, products })
  }

  public async addProduct({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'seller') return response.redirect('/login?error=unauthorized')

    const { title, image, price } = request.only(['title', 'image', 'price'])
    const products = loadJSON(productsPath)

    const newProduct = {
      id: products.length + 1,
      title,
      image,
      price,
      sellerEmail: user.email,
      createdAt: new Date().toISOString(),
    }

    products.push(newProduct)
    saveJSON(productsPath, products)

    return response.redirect('/seller/products')
  }

  public async deleteProduct({ request, session, response }: HttpContext) {
    const user = session.get('user')
    if (!user) return response.redirect('/login')
    if (user.role !== 'seller') return response.redirect('/login?error=unauthorized')

    const productId = request.input('id')
    let products = loadJSON(productsPath)

    products = products.filter((p) => !(p.id === Number(productId) && p.sellerEmail === user.email)
    )

    saveJSON(productsPath, products)
    return response.redirect('/seller/products')
  }

  public async addWishlist({ request, session, response }: HttpContext) {
    const buyer = session.get('user')
    if (!buyer) return response.redirect('/login')

    const { productId, sellerEmail } = request.only(['productId', 'sellerEmail'])
    const wishlist = loadJSON(wishlistPath)

    const exists = wishlist.find((w) => w.productId == productId && w.buyerEmail == buyer.email
    )

    if (!exists) {
      wishlist.push({
        id: wishlist.length + 1,
        productId: Number(productId),
        buyerEmail: buyer.email,
        sellerEmail,
        createdAt: new Date().toISOString(),
      })
      saveJSON(wishlistPath, wishlist)
    }

    return response.redirect('back')
  }
}

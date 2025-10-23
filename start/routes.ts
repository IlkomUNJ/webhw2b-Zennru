import router from '@adonisjs/core/services/router'

// Gunakan path relatif ke folder app/controllers
const AuthController = () => import('../app/controllers/http/auth_controller.ts')
const BuyerController = () => import('../app/controllers/http/buyer_controller.ts')
const SellerController = () => import('../app/controllers/http/seller_controller.ts')

// Publik
router.get('/', async ({ view, auth }) => view.render('index', { user: auth.user })).as('home')
router.get('/about', async ({ view }) => view.render('about')).as('about')
router.get('/products', async ({ view, auth }) => view.render('products', { user: auth.user })).as('products')
router.get('/contact', async ({ view }) => view.render('contact')).as('contact')

// Auth
router.get('/login', async ({ view }) => view.render('login')).as('login')
router.post('/login', [AuthController, 'login']).as('login.submit')
router.get('/logout', [AuthController, 'logout']).as('logout')

// Buyer & Seller
router.get('/buyer/home', [BuyerController, 'home']).as('buyer.home')
router.get('/buyer/about', [BuyerController, 'about']).as('buyer.about')
router.get('/cart', [BuyerController, 'cart'])
router.post('/buyer/add-wishlist', [SellerController, 'addWishlist'])
router.get('/buyer/products', [BuyerController, 'products'])
router.get('/buyer/wishlist', [BuyerController, 'wishlist'])
router.post('/buyer/remove-wishlist', [BuyerController, 'removeWishlist'])
router.post('/remove-cart', [BuyerController, 'removeCart'])
router.post('/buyer/add-cart', [BuyerController, 'addCart'])

router.get('/seller/home', [SellerController, 'home']).as('seller.home')
router.get('/seller/about', [SellerController, 'about']).as('seller.about')
router.get('/seller/wishlist', [SellerController, 'wishlist']).as('seller.wishlist')
router.get('/seller/products', [SellerController, 'products']).as('seller.products')
router.post('/seller/add-product', [SellerController, 'addProduct']).as('seller.addProduct')
router.post('/seller/delete-product', [SellerController, 'deleteProduct']).as('seller.deleteProduct')

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Seller account
    await User.create({
      username: 'seller1',
      email: 'seller1@example.com',
      password: await Hash.make('seller123'),
      role: 'seller',
    })

    // Buyer account
    await User.create({
      username: 'buyer1',
      email: 'buyer1@example.com',
      password: await Hash.make('buyer123'),
      role: 'buyer',
    })
  }
}

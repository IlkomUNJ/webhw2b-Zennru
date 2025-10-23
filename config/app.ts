import env from '../start/env.js'
import app from '@adonisjs/core/services/app'
import { Secret } from '@adonisjs/core/helpers'
import { defineConfig } from '@adonisjs/core/http'

/**
 * App key digunakan untuk enkripsi cookie, signed URL, dan modul encryption.
 * Jangan pernah ubah kunci ini di produksi, karena data terenkripsi akan gagal dibaca.
 */
export const appKey = new Secret(env.get('APP_KEY'))

/**
 * Konfigurasi server HTTP AdonisJS
 */
export const http = defineConfig({
  /**
   * Menentukan apakah setiap request akan punya ID unik (berguna untuk logging/tracing)
   */
  generateRequestId: true,

  /**
   * Mengizinkan method spoofing (misalnya mengubah POST jadi PUT via _method).
   * Default: false untuk keamanan.
   */
  allowMethodSpoofing: false,

  /**
   * Async Local Storage memungkinkan kamu mengakses konteks request dari mana saja.
   * Aktifkan kalau kamu butuh akses global ke context HTTP.
   */
  useAsyncLocalStorage: true,

  /**
   * Pengaturan cookie bawaan server HTTP.
   * Session cookies diatur terpisah di config/session.ts.
   */
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },
})

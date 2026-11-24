import { Horizon, Keypair } from '@stellar/stellar-sdk'

// Conexión a la Testnet (Red de pruebas de Stellar)
export const server = new Horizon.Server('https://horizon-testnet.stellar.org')

/**
 * Genera una cuenta real en la Testnet de Stellar y la fondea con Friendbot
 */
export async function createTestAccount(existingPublicKey = null) {
  try {
    let publicKey = existingPublicKey
    let secretKey = null

    if (!publicKey || !publicKey.startsWith('G') || publicKey.length !== 56) {
      const pair = Keypair.random()
      publicKey = pair.publicKey()
      secretKey = pair.secret()
    }

    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    )

    return {
      ok: response.ok,
      publicKey,
      secretKey
    }
  } catch (error) {
    console.error('Error al conectar con Friendbot:', error)
    return null
  }
}

/**
 * Obtiene el saldo real de XLM / activos de una cuenta pública en Testnet
 */
export async function getAccountBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey)
    return account.balances
  } catch (error) {
    console.error('Error al obtener saldo en Horizon Testnet:', error)
    return []
  }
}
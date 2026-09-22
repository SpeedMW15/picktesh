import { Horizon } from '@stellar/stellar-sdk'

// Conexión a la Testnet (Red de pruebas de Stellar)
export const server = new Horizon.Server('https://horizon-testnet.stellar.org')

/**
 * Genera una cuenta de prueba aleatoria en la Testnet de Stellar con fondos falsos (Friendbot)
 */
export async function createTestAccount() {
  try {
    // Genera un par de claves aleatorias (Pública y Privada)
    const response = await fetch('https://friendbot.stellar.org?addr=' + encodeURIComponent('G...'))
    // En el paso siguiente integraremos la clave dinámica
    return response.ok
  } catch (error) {
    console.error("Error al conectar con Friendbot:", error)
    return null
  }
}

/**
 * Obtiene el saldo de $TESH o XLM de una cuenta pública
 */
export async function getAccountBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey)
    return account.balances
  } catch (error) {
    console.error("Error al obtener saldo:", error)
    return []
  }
}
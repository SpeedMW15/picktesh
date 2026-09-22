import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Base de datos temporal en memoria (MOCK DB)
let ordersDatabase = [
  {
    orderId: "ORD-104015",
    pickupCode: "104015",
    student: "Alumno TESH (GBX...4X9)",
    items: [
      { name: "Torta de Chilaquiles", price: 35 },
      { name: "Café Americano 12oz", price: 18 }
    ],
    total: 53,
    pickupTime: "12:30",
    status: "PENDING_ESCROW", // PENDING_ESCROW | COMPLETED | PENALIZED
    createdAt: new Date().toISOString()
  }
]

// RUTA 1: Endpoint de Salud (Health Check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor PickTESH operando en Testnet de Stellar' })
})

// RUTA 2: Obtener todos los pedidos
app.get('/api/orders', (req, res) => {
  res.json(ordersDatabase)
})

// RUTA 3: Buscar un pedido por código de 6 dígitos
app.get('/api/orders/verify/:code', (req, res) => {
  const { code } = req.params
  const order = ordersDatabase.find(o => o.pickupCode === code)

  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado o código inválido.' })
  }

  res.json(order)
})

// RUTA 4: Crear nuevo pedido (Sincronización con Escrow)
app.post('/api/orders', (req, res) => {
  const { pickupCode, student, items, total, pickupTime } = req.body

  const newOrder = {
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    pickupCode,
    student: student || 'Alumno TESH Anonymous',
    items,
    total,
    pickupTime,
    status: 'PENDING_ESCROW',
    createdAt: new Date().toISOString()
  }

  ordersDatabase.push(newOrder)
  res.status(201).json({ message: 'Pedido registrado con éxito', order: newOrder })
})

// RUTA 5: Actualizar estado de entrega (Liberación o Penalización)
app.patch('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params
  const { status } = req.body // COMPLETED o PENALIZED

  const order = ordersDatabase.find(o => o.orderId === orderId)

  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado.' })
  }

  order.status = status
  res.json({ message: `Estado actualizado a ${status}`, order })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor PickTESH Backend corriendo en http://localhost:${PORT}`)
})
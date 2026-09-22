import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 1. Obtener TODOS los pedidos para los Monitores y Dashboards
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al listar ordenes de Supabase:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json(data || [])
  } catch (error) {
    console.error('Error servidor:', error)
    res.status(500).json({ error: error.message })
  }
})

// 2. Guardar orden enviada por el alumno
app.post('/api/orders', async (req, res) => {
  try {
    const { pickupCode, student, items, total, pickupTime } = req.body

    const newOrder = {
      order_id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      pickup_code: String(pickupCode),
      student: String(student || 'Alumno TESH'),
      items: String(items),
      total: Number(total),
      pickup_time: String(pickupTime),
      status: 'PENDING_ESCROW'
    }

    const { data, error } = await supabase.from('orders').insert([newOrder]).select()

    if (error) throw error
    res.status(201).json({ message: 'Orden registrada', order: data[0] })
  } catch (error) {
    console.error('Error al guardar:', error)
    res.status(500).json({ error: error.message })
  }
})

// 3. Buscar orden por código exacto
app.get('/api/orders/verify/:code', async (req, res) => {
  try {
    const { code } = req.params
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('pickup_code', String(code))

    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const order = data[0]
    res.json({
      orderId: order.order_id,
      pickup_code: order.pickup_code,
      student: order.student,
      items: order.items,
      total: order.total,
      pickupTime: `${order.pickup_time} hrs`,
      status: order.status
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 4. Cambiar estado
app.patch('/api/orders/:code/status', async (req, res) => {
  try {
    const { code } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('pickup_code', String(code))
      .select()

    if (error) throw error
    res.json({ message: `Estado actualizado a ${status}`, order: data[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`)
})
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

// 1. Guardar orden enviada por el alumno
app.post('/api/orders', async (req, res) => {
  try {
    const { pickupCode, student, items, total, pickupTime } = req.body

    const newOrder = {
      order_id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      pickup_code: pickupCode,
      student: student || 'Alumno TESH',
      items: typeof items === 'string' ? items : JSON.stringify(items),
      total: Number(total),
      pickup_time: pickupTime,
      status: 'PENDING_ESCROW'
    }

    const { data, error } = await supabase.from('orders').insert([newOrder]).select().single()

    if (error) throw error
    res.status(201).json({ message: 'Orden guardada', order: data })
  } catch (error) {
    console.error('Error al guardar:', error)
    res.status(500).json({ error: error.message })
  }
})

// 2. Buscar orden exacta en Supabase
app.get('/api/orders/verify/:code', async (req, res) => {
  try {
    const { code } = req.params
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('pickup_code', code)
      .maybeSingle()

    if (error || !data) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    res.json({
      orderId: data.order_id,
      pickup_code: data.pickup_code,
      student: data.student,
      items: data.items,
      total: data.total,
      pickupTime: `${data.pickup_time} hrs`,
      status: data.status
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 3. Cambiar estado
app.patch('/api/orders/:code/status', async (req, res) => {
  try {
    const { code } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('pickup_code', code)
      .select()
      .single()

    if (error) throw error
    res.json({ message: `Estado actualizado a ${status}`, order: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`)
})
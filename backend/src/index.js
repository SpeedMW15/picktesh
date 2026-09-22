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

// 1. Registro de Usuario en Supabase
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, enrollment } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Por favor completa todos los campos requeridos.' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const studentId = enrollment ? enrollment.trim() : cleanEmail.split('@')[0]
    const stellarKey = `G${studentId.toUpperCase().replace(/[^A-Z0-9]/g, '')}STELLARSECUREKEY001`

    // Verificar si el correo ya está registrado en Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single()

    if (existingUser) {
      return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' })
    }

    // Insertar nuevo usuario en la base de datos
    const newUser = {
      student_id: studentId,
      name: name,
      email: cleanEmail,
      password: password, // Para producción se recomienda encriptar con bcrypt
      role: 'student',
      stellar_public_key: stellarKey
    }

    const { data, error } = await supabase.from('users').insert([newUser]).select()

    if (error) throw error

    const registeredUser = data[0]

    res.status(201).json({
      success: true,
      user: {
        id: registeredUser.student_id,
        name: registeredUser.name,
        email: registeredUser.email,
        role: registeredUser.role,
        provider: 'Cuenta PickTESH (Supabase)',
        stellarPublicKey: registeredUser.stellar_public_key
      }
    })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    res.status(500).json({ error: 'No se pudo completar el registro en Supabase.' })
  }
})

// 2. Inicio de Sesión y Validación contra Supabase
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Proporciona tu correo electrónico y contraseña.' })
    }

    const cleanInput = identifier.trim().toLowerCase()

    // Buscar usuario en Supabase por email o por student_id (matrícula)
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${cleanInput},student_id.eq.${cleanInput}`)

    if (error || !users || users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado. Registra una cuenta primero.' })
    }

    const user = users[0]

    // Validar contraseña exacta
    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta. Inténtalo de nuevo.' })
    }

    res.json({
      success: true,
      user: {
        id: user.student_id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: 'Cuenta PickTESH (Supabase)',
        stellarPublicKey: user.stellar_public_key
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error interno al validar las credenciales.' })
  }
})

// 3. Obtener pedidos en Supabase
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 4. Registrar pedido
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
    res.status(500).json({ error: error.message })
  }
})

// 5. Verificación de ticket por código
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

// 6. Actualizar estado de pedido
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

// 7. Recomendador IA Groq
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { preference } = req.body
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey || apiKey.trim() === '' || apiKey.includes('tu_clave')) {
      return res.json({
        recommendation: "¡MichiTESH sugiere: Una Torta de Chilaquiles con Café Americano para tener energía entre clases!"
      })
    }

    const prompt = `Eres "MichiTESH", la mascota gatito de la cafetería del TecNM Huixquilucan (TESH).
    Menú:
    - Torta de Chilaquiles (35 $TESH)
    - Molletes Sencillos (25 $TESH)
    - Café Americano 12oz (18 $TESH)

    Preferencia: "${preference || 'algo rico'}".
    Recomienda en máximo 2 oraciones de forma tierna.`

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120
      })
    })

    const groqData = await groqResponse.json()
    const text = groqData.choices?.[0]?.message?.content || "¡MichiTESH sugiere probar los Molletes Sencillos!"
    res.json({ recommendation: text })

  } catch (error) {
    res.json({
      recommendation: "¡MichiTESH sugiere: Torta de Chilaquiles con tu bebida favorita!"
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`)
})
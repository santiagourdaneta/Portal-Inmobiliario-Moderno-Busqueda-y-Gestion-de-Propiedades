// Importa el módulo Express para crear y manejar nuestro servidor.
import express from 'express';
// Importa `mysql2` para poder hablar directamente con nuestra base de datos MySQL.
// Importamos también `RowDataPacket` para ayudar a TypeScript a entender el tipo de las filas.
import mysql, { RowDataPacket } from 'mysql2/promise';
// Importa la librería `cors` para manejar los permisos de comunicación entre dominios.
import cors from 'cors';
// Importa Zod, nuestro "policía" para validar los datos.
import { z } from 'zod';
// Importa `uuid` para generar identificadores únicos para cada propiedad.
import { v4 as uuidv4 } from 'uuid';

// Crea una nueva aplicación Express.
const app = express();

// Define el puerto donde escuchará nuestro servidor.
const PORT = process.env.PORT || 3001;

// --- Configuración de la conexión a la base de datos MySQL ---
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // ¡Tu contraseña si la configuraste! Si no, déjala vacía.
  database: 'miportaldb'
};
const pool = mysql.createPool(dbConfig);

// --- Configuración de CORS ---
app.use(cors({
  origin: 'http://localhost:3000', // El origen (dominio y puerto) de tu frontend.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos.
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos.
}));

// Middlewares:
app.use(express.json()); // Permite que Express entienda el JSON que le enviaremos.

// --- Definición de Schemas Zod (Nuestro "Policía" para validar datos) ---
const PropertyTypeSchema = z.enum([
  'CASA', 'APARTAMENTO', 'TERRENO', 'OFICINA', 'LOCAL_COMERCIAL', 'OTROS'
]);
const PropertyStatusSchema = z.enum([
  'EN_VENTA', 'EN_ALQUILER', 'VENDIDA', 'ALQUILADA', 'DESACTIVADA'
]);

const PropertyInputSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio.'),
  description: z.string().min(1, 'La descripción es obligatoria.'),
  price: z.number().positive('El precio debe ser un número positivo.'),
  address: z.string().min(1, 'La dirección es obligatoria.'),
  city: z.string().min(1, 'La ciudad es obligatoria.'),
  country: z.string().min(1, 'El país es obligatorio.'),
  bedrooms: z.number().int().positive('Las habitaciones deben ser un número entero positivo.'),
  bathrooms: z.number().positive('Los baños deben ser un número positivo.'),
  areaSqFt: z.number().positive('El área debe ser un número positivo.'),
  type: PropertyTypeSchema,
  status: PropertyStatusSchema,
  imageUrl: z.string().optional().transform(val => {
    return val ? val.split(',').map(url => url.trim()).filter(url => url.length > 0) : [];
  }),
});


// --- Rutas (API Endpoints) ---

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡El cerebro del portal de casas está funcionando y conectado a MySQL directamente (con CORS y Zod)!');
});

// Ruta para obtener todas las propiedades (casas).
app.get('/api/properties', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms } = req.query;

    let sql = 'SELECT * FROM Property WHERE 1=1';
    const values: (string | number)[] = [];

    if (city) {
      sql += ' AND city LIKE ?';
      values.push(`%${city}%`);
    }
    if (type) {
      sql += ' AND type = ?';
      values.push(type as string);
    }
    if (minPrice) {
      sql += ' AND price >= ?';
      values.push(parseFloat(minPrice as string));
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      values.push(parseFloat(maxPrice as string));
    }
    if (bedrooms) {
      sql += ' AND bedrooms >= ?';
      values.push(parseInt(bedrooms as string));
    }

    const [rows] = await pool.execute(sql, values);

    const properties = (rows as RowDataPacket[]).map(row => ({ // Casteamos a RowDataPacket[] aquí
      ...row,
      imageUrl: row.imageUrl ? JSON.parse(row.imageUrl) : [],
      price: parseFloat(row.price),
      bedrooms: parseInt(row.bedrooms),
      bathrooms: parseFloat(row.bathrooms),
      areaSqFt: parseFloat(row.areaSqFt),
    }));
    res.json(properties);
  } catch (error) {
    console.error('Error al obtener propiedades con filtros:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener propiedades con filtros.' });
  }
});

// NUEVA RUTA: Ruta para crear una nueva propiedad.
app.post('/api/properties', async (req, res) => {
  try {
    const validatedData = PropertyInputSchema.parse(req.body);
    const id = uuidv4();
    const agentId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // ID de agente de prueba

    try {
        await pool.execute('INSERT IGNORE INTO User (id, email, password) VALUES (?, ?, ?)',
            [agentId, 'agent@example.com', 'password123']);
        await pool.execute('INSERT IGNORE INTO Agent (id, userId, phone) VALUES (?, ?, ?)',
            [agentId, agentId, '123-456-7890']);
    } catch (dbError) {
        console.warn('Advertencia: No se pudo asegurar el agente de prueba (puede que ya exista o haya un error menor).', dbError);
    }

    const sql = `
      INSERT INTO Property (
        id, title, description, price, address, city, country,
        bedrooms, bathrooms, areaSqFt, type, status, imageUrl, agentId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      id,
      validatedData.title,
      validatedData.description,
      validatedData.price,
      validatedData.address,
      validatedData.city,
      validatedData.country,
      validatedData.bedrooms,
      validatedData.bathrooms,
      validatedData.areaSqFt,
      validatedData.type,
      validatedData.status,
      JSON.stringify(validatedData.imageUrl),
      agentId
    ];

    await pool.execute(sql, values);

    res.status(201).json({ message: 'Propiedad creada exitosamente', id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    console.error('Error al crear propiedad:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear propiedad.' });
  }
});

// RUTA PARA OBTENER DETALLES DE PROPIEDAD POR ID (aquí estaba el error)
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Aquí le decimos a TypeScript que esperamos un array de RowDataPacket.
    const [rows] = await pool.execute('SELECT * FROM Property WHERE id = ?', [id]);
    const properties = rows as RowDataPacket[]; // <--- ¡Esta línea corrige el error!

    if (properties.length === 0) { // Ahora TypeScript sabe que `properties` tiene `length`.
      return res.status(404).json({ message: 'Propiedad no encontrada.' });
    }

    const property = properties[0]; // Obtenemos la primera (y única) propiedad.

    const formattedProperty = {
      ...property,
      imageUrl: property.imageUrl ? JSON.parse(property.imageUrl as string) : [], // Convertimos a string primero si es necesario
      price: parseFloat(property.price as any),
      bedrooms: parseInt(property.bedrooms as any),
      bathrooms: parseFloat(property.bathrooms as any),
      areaSqFt: parseFloat(property.areaSqFt as any),
    };

    res.json(formattedProperty);
  } catch (error) {
    console.error('Error al obtener propiedad por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener propiedad por ID.' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Cerebro del portal escuchando en el puerto ${PORT}`);
});

// Cierre de conexiones al apagar el servidor
process.on('SIGINT', async () => {
  console.log('Cerrando conexiones de base de datos...');
  await pool.end();
  process.exit(0);
});

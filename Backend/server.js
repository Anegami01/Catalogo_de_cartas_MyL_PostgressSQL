require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que tu frontend se comunique con el servidor
app.use(cors());

// Conexión a la base de datos PostgreSQL usando los datos del .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Backend de cartas Mitos y Leyendas funcionando.");
});

// Ruta principal que pide tu Frontend: /api/productos
// Realiza la consulta SQL a las dos tablas con INNER JOIN
app.get("/api/productos", async (req, res) => {
    try {
        const consulta = `
      SELECT
          p.producto_id,
          p.nombre,
          p.tipo_carta,
          p.ataque,
          p.costo,
          p.edicion,
          p.descripcion,
          p.precio,
          p.imagen_url,
          c.nombre AS categoria
      FROM demo_productos AS p
      INNER JOIN demo_categorias AS c
          ON p.categoria_id = c.categoria_id
      ORDER BY p.producto_id ASC;
    `;

        const resultado = await pool.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error("Error al consultar PostgreSQL:", error);
        res.status(500).json({ error: "Error al consultar la base de datos" });
    }
});

// Enciende el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
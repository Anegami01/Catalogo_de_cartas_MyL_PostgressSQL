# Catálogo de Cartas — Mitos y Leyendas (Primer Bloque)

Aplicación web Full Stack para consultar un catálogo de 514 cartas de *Mitos y Leyendas* (Primer Bloque / Leyendas Primer Bloque 4.0), conectando una base de datos relacional PostgreSQL con una API REST en Node.js/Express y un frontend interactivo con Bootstrap.

---

## 🛠️ Tecnologías Utilizadas

- **Base de Datos:** PostgreSQL local (consultas optimizadas mediante `INNER JOIN`).
- **Backend:** Node.js con Express, CORS, Dotenv y la librería `pg` (Pool de conexiones relacionales).
- **Frontend:** HTML5 semántico, CSS3 personalizado con zoom flotante en miniaturas, JavaScript Vanilla (Fetch API, filtrado múltiple reactivo) y Bootstrap 5 para el componente de paginación.

---

## 📁 Estructura del Proyecto

```text
├── Backend/
│   ├── .env.example       # Plantilla de configuración de conexión
│   ├── package.json       # Dependencias del servidor (express, pg, cors, dotenv)
│   └── server.js          # API REST y endpoints de consulta
├── Frontend/
│   ├── index.html         # Interfaz web con buscador, filtros y tabla
│   └── assets/
│       ├── css/
│       │   └── style.css  # Diseño oscuro, badges e interactividad hover
│       └── js/
│           └── script.js  # Consumo de API, multi-filtro y paginación Bootstrap (15 cartas por pág)
├── base_datos_myl_oficial.sql  # Script SQL con creación de tablas y las 514 cartas verificadas
├── .gitignore             # Protección de credenciales y dependencias
└── README.md              # Documentación del proyecto
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Base de Datos (PostgreSQL)
1. Abre tu gestor de PostgreSQL (pgAdmin o psql) y crea una base de datos llamada `Cartas`.
2. Ejecuta el script SQL `base_datos_myl_oficial.sql` para generar las tablas `demo_categorias` y `demo_productos` con los 514 registros verificados.

### 2. Backend (Servidor Express)
1. Abre una terminal dentro de la carpeta `Backend`:
   ```bash
   cd Backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` tomando como base `.env.example` y configura tu contraseña de PostgreSQL:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=Cartas
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   ```
4. Inicia el servidor:
   ```bash
   node server.js
   ```
   *El servidor estará disponible en `http://localhost:3000`.*

### 3. Frontend
Abre el archivo `Frontend/index.html` en tu navegador web (o mediante la extensión Live Server de VS Code).

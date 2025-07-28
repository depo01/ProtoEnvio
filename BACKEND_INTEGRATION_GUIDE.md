
# 🚀 Guía de Integración Backend - Sistema de Recogida y Entrega

Esta guía contiene toda la información necesaria para implementar el backend que funcione con esta aplicación React.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Estructura de Base de Datos](#estructura-de-base-de-datos)
3. [Endpoints de API](#endpoints-de-api)
4. [Autenticación y Autorización](#autenticación-y-autorización)
5. [Variables de Entorno](#variables-de-entorno)
6. [Estructura de Respuestas](#estructura-de-respuestas)
7. [Ejemplos de Implementación](#ejemplos-de-implementación)

## ⚙️ Configuración Inicial

### Variables de Entorno Requeridas

```env
# Frontend (React)
VITE_API_URL=http://localhost:3001/api

# Backend
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pickup_delivery_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

## 🗃️ Estructura de Base de Datos

### Tabla: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'admin', 'operative')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    username VARCHAR(100) UNIQUE, -- Solo para operativos
    must_set_password BOOLEAN DEFAULT FALSE, -- Solo para operativos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `services`
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    multiplier DECIMAL(4,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `zones`
```sql
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    multiplier DECIMAL(4,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    coordinates JSONB -- Array de coordenadas [{lat, lng}]
);
```

### Tabla: `client_pricing`
```sql
CREATE TABLE client_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES services(id),
    custom_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, service_id)
);
```

### Tabla: `pickup_requests`
```sql
CREATE TABLE pickup_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    package_type VARCHAR(100) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (
        status IN ('pendiente', 'confirmado', 'en-transito', 'entregado', 'cancelado')
    ),
    price DECIMAL(10,2) NOT NULL,
    operative_id UUID REFERENCES users(id),
    operative_name VARCHAR(255),
    route_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `packages`
```sql
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES pickup_requests(id) ON DELETE CASCADE,
    package_type VARCHAR(100) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    description TEXT
);
```

### Tabla: `routes`
```sql
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    operative_id UUID NOT NULL REFERENCES users(id),
    operative_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'in-progress', 'completed')
    ),
    estimated_duration INTEGER, -- en minutos
    actual_duration INTEGER, -- en minutos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `notifications`
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(20), -- 'request', 'route', 'user'
    related_entity_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);
```

## 🔌 Endpoints de API

### 🔐 Autenticación (`/auth`)

```
POST   /auth/login              # Iniciar sesión
POST   /auth/register           # Registrar usuario
POST   /auth/logout             # Cerrar sesión
GET    /auth/profile            # Obtener perfil del usuario
PUT    /auth/profile            # Actualizar perfil
GET    /auth/verify             # Verificar token JWT
POST   /auth/change-password    # Cambiar contraseña
```

### 👥 Usuarios (`/users`) - Solo Admins

```
GET    /users                   # Listar usuarios (con paginación y filtros)
GET    /users/:id               # Obtener usuario por ID
PUT    /users/:id               # Actualizar usuario
DELETE /users/:id               # Eliminar usuario
PATCH  /users/:id/status        # Actualizar estado (active/inactive)
POST   /users/operatives        # Crear usuario operativo
GET    /users/operatives        # Obtener todos los operativos
```

### 📦 Solicitudes (`/requests`)

```
GET    /requests                # Obtener todas las solicitudes (paginadas)
GET    /requests/:id            # Obtener solicitud por ID
POST   /requests                # Crear nueva solicitud
PUT    /requests/:id            # Actualizar solicitud completa
PATCH  /requests/:id/status     # Actualizar solo el estado
DELETE /requests/:id            # Eliminar solicitud
GET    /requests/my-requests    # Solicitudes del cliente autenticado
PATCH  /requests/:id/assign     # Asignar solicitud a operativo
```

### 🛠️ Servicios (`/services`)

```
GET    /services                # Obtener servicios (con paginación)
GET    /services/:id            # Obtener servicio por ID
POST   /services                # Crear nuevo servicio
PUT    /services/:id            # Actualizar servicio
DELETE /services/:id            # Eliminar servicio
GET    /services/client-pricing/:clientId  # Precios personalizados por cliente
POST   /services/client-pricing # Establecer precio personalizado
PUT    /services/client-pricing/:id        # Actualizar precio personalizado
GET    /services/zones          # Obtener zonas
POST   /services/zones          # Crear zona
PUT    /services/zones/:id      # Actualizar zona
DELETE /services/zones/:id      # Eliminar zona
```

### 🗺️ Rutas (`/routes`)

```
GET    /routes                  # Obtener todas las rutas
GET    /routes/:id              # Obtener ruta por ID
POST   /routes                  # Crear nueva ruta
PUT    /routes/:id              # Actualizar ruta
DELETE /routes/:id              # Eliminar ruta
GET    /routes/operative/:id    # Rutas de un operativo específico
```

### 📊 Estadísticas (`/stats`) - Solo Admins

```
GET    /stats/dashboard         # Estadísticas del dashboard
GET    /stats/revenue           # Estadísticas de ingresos
GET    /stats/clients           # Estadísticas de clientes
```

### 🔔 Notificaciones (`/notifications`)

```
GET    /notifications           # Obtener notificaciones del usuario
PATCH  /notifications/:id/read  # Marcar notificación como leída
PATCH  /notifications/mark-all-read # Marcar todas como leídas
DELETE /notifications/:id       # Eliminar notificación
GET    /notifications/unread-count   # Conteo de no leídas
POST   /notifications           # Crear notificación (admins)
```

### 📈 Reportes (`/reports`) - Solo Admins

```
GET    /reports/export          # Exportar reportes en CSV/Excel/PDF
```

## 🔒 Autenticación y Autorización

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "client|admin|operative",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Middleware de Autorización
```javascript
// Verificar token JWT en headers
Authorization: Bearer <jwt_token>

// Roles y permisos:
// - client: Solo sus propias solicitudes
// - operative: Ver solicitudes asignadas
// - admin: Acceso completo a todo
```

## 📝 Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {}, // o [] para arrays
  "message": "Operación exitosa"
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE", // opcional
  "status": 400
}
```

## 🔍 Parámetros de Query Comunes

### Paginación
```
?page=1&limit=10
```

### Filtros para Solicitudes
```
?status=pendiente&clientId=uuid&dateFrom=2024-01-01&dateTo=2024-12-31
```

### Filtros para Usuarios
```
?role=client&status=active&search=nombre
```

## 💻 Ejemplo de Implementación (Node.js/Express)

### Estructura de Carpetas Recomendada
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   ├── userController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Request.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── requests.js
│   │   └── ...
│   ├── utils/
│   │   ├── jwt.js
│   │   └── pagination.js
│   └── app.js
├── migrations/
└── package.json
```

### Ejemplo de Endpoint (Login)
```javascript
// controllers/authController.js
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token
    const token = jwt.sign(
      { 
        sub: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

## 🔧 Configuración de CORS
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

## 📚 Tecnologías Recomendadas

### Backend
- **Node.js + Express** o **Python + FastAPI** o **PHP + Laravel**
- **PostgreSQL** o **MySQL** para base de datos
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas

### Deployment
- **Backend**: Railway, Render, DigitalOcean, AWS
- **Base de datos**: Supabase, Railway, PlanetScale
- **Frontend**: Vercel, Netlify

## 🚀 Pasos para Deployment

1. **Configurar base de datos en producción**
2. **Desplegar backend con variables de entorno**
3. **Actualizar `VITE_API_URL` en el frontend**
4. **Configurar CORS para el dominio de producción**
5. **Probar todos los endpoints**

## 📞 Soporte

Si necesitas ayuda con la implementación, asegúrate de:
- Seguir exactamente la estructura de respuestas JSON
- Implementar todos los endpoints listados
- Mantener la estructura de base de datos
- Configurar correctamente la autenticación JWT

---

¡Con esta guía tienes todo lo necesario para crear un backend completamente funcional! 🎉

📁 ESTRUCTURA DEL PROYECTO - INTEGRACIÓN API COMPLETADA

```
java-react-onpe/
├── 📄 RESUMEN_CAMBIOS.md               ← 📍 LEE ESTO PRIMERO
├── 📄 INTEGRACION_API.md               ← Documentación técnica completa
├── 📄 CHECKLIST_VERIFICACION.md        ← Checklist de pruebas
├── 📄 test-api.sh                      ← Script para probar API
│
├── frontend/
│   ├── 📄 package.json                 ← Dependencias
│   ├── 📄 .env                         ← Variables de entorno (crear si no existe)
│   │
│   └── src/
│       ├── 📄 App.jsx
│       ├── 📄 main.jsx
│       │
│       ├── 📁 config/
│       │   └── 📄 apiConfig.js         ← ✨ NUEVO: Configuración API
│       │
│       ├── 📁 services/                ← SERVICIOS DE API
│       │   ├── 📄 votantesService.js   ← ✨ NUEVO: GET/PUT votantes
│       │   ├── 📄 votosService.js      ← ✨ NUEVO: Registrar votos
│       │   ├── 📄 candidatosService.js ← ✨ MODIFICADO: Servicios candidatos
│       │   └── 📄 data/
│       │       └── ...
│       │
│       ├── 📁 pages/
│       │   └── 📁 votar/
│       │       ├── 📄 Verificacion.jsx ← ✨ MODIFICADO: Integrado con API
│       │       ├── 📄 Votar.jsx        ← Por modificar en Fase 2
│       │       ├── 📄 Candidatos.jsx
│       │       ├── 📄 Categorias.jsx
│       │       ├── 📄 Confirmacion.jsx
│       │       ├── 📄 Congresistas.jsx
│       │       ├── 📄 Final.jsx
│       │       ├── 📄 ProgressCard.jsx
│       │       └── 📄 Votar.jsx
│       │
│       ├── 📁 components/
│       │   ├── 📄 Navbar.jsx
│       │   ├── 📄 Footer.jsx
│       │   ├── 📄 ProtectedRoute.jsx
│       │   └── ...
│       │
│       ├── 📁 context/
│       │   └── 📄 AccessibilityContext.jsx
│       │
│       ├── 📁 constants/
│       │   └── 📄 electoralConstants.js
│       │
│       ├── 📁 assets/
│       │   ├── 📁 images/
│       │   └── 📁 logos/
│       │
│       └── 📁 styles/
│           └── 📄 index.css
│
└── backend/ (Java/Spring Boot)
    ├── src/main/java/...
    │   ├── controllers/
    │   │   ├── VotanteController.java     ← GET consulta/{dni}, PUT ubicacion/{dni}
    │   │   ├── CandidatoController.java   ← GET /presidencial, /congresistas, etc.
    │   │   ├── VotoController.java        ← POST /registrar
    │   │   └── ...
    │   ├── repositories/
    │   │   ├── VotanteRepository.java
    │   │   ├── CandidatoRepository.java
    │   │   └── ...
    │   └── ...
    │
    └── application.properties             ← Configurar CORS

```

---

## 🔄 FLUJO DE DATOS

```
┌──────────────────────────────────┐
│    USUARIO EN NAVEGADOR          │
└────────────┬─────────────────────┘
             │
             │ React/Verificacion.jsx
             │
      ┌──────▼───────────┐
      │ FRONTEND         │
      │ ┌──────────────┐ │
      │ │ Paso 1-5     │ │
      │ │ Componentes  │ │
      │ └──────┬───────┘ │
      │        │         │
      │ ┌──────▼────────────────┐
      │ │ Services:            │
      │ │ - votantesService    │
      │ │ - votosService       │
      │ │ - candidatosService  │
      │ └──────┬────────────────┘
      └────────┼─────────────────┘
               │ HTTP/JSON
    ┌──────────▼──────────────┐
    │  BACKEND (Spring Boot)   │
    │  ┌────────────────────┐  │
    │  │ Controllers:       │  │
    │  │ - VotanteCtrl      │  │
    │  │ - VotoCtrl         │  │
    │  │ - CandidatoCtrl    │  │
    │  └────────┬───────────┘  │
    │           │              │
    │  ┌────────▼───────────┐  │
    │  │ Repositories/      │  │
    │  │ JPA (ORM)          │  │
    │  └────────┬───────────┘  │
    └───────────┼──────────────┘
                │
    ┌───────────▼──────────────┐
    │  DATABASE (PostgreSQL)    │
    │  ┌────────────────────┐   │
    │  │ votantes           │   │
    │  │ candidatos         │   │
    │  │ votos_emitidos     │   │
    │  │ partidos_politicos │   │
    │  └────────────────────┘   │
    └────────────────────────────┘

```

---

## 🌊 LLAMADAS API IMPLEMENTADAS

```javascript
// 1️⃣ CONSULTAR VOTANTE
GET /api/votantes/consulta/{dni}
Response: { dni, nombres, apellidos, fechaNac, sexo, departamento, ... }

// 2️⃣ ACTUALIZAR UBICACIÓN
PUT /api/votantes/ubicacion/{dni}
Body: { departamento, provincia, distrito }
Response: { ...votante actualizado... }

// 3️⃣ FINALIZAR VOTO
POST /api/votantes/finalizar/{dni}
Response: { estado: "Votó", fechaAcceso: ... }

// 4️⃣ OBTENER CANDIDATOS (Para Fase 2)
GET /api/candidatos/presidencial
GET /api/candidatos/congresistas
GET /api/candidatos/andinos
Response: [{ idCandidato, nombreCompleto, cargo, ... }]

// 5️⃣ REGISTRAR VOTO (Para Fase 3)
POST /api/votos/registrar
Body: { dniVotante, idCandidato }
Response: { idVoto, dniVotante, idCandidato, ... }
```

---

## 📊 MAPEO DE CAMPOS BD ↔ FRONTEND

```javascript
VOTANTES:
  id_votante       → idVotante
  dni              → dni
  nombres          → nombres
  apellidos        → apellidos
  fecha_nac        → fechaNac
  sexo             → sexo
  departamento     → departamento
  provincia        → provincia
  distrito         → distrito
  estado           → estado ("No votó" | "Votó")
  fecha_acceso     → fechaAcceso

CANDIDATOS:
  id_candidato     → idCandidato
  id_partido       → idPartido
  nombre_completo  → nombreCompleto
  biografia        → biografia
  propuestas       → propuestas (array)
  cargo            → cargo
  distrito         → distrito
  foto             → foto
  estado           → estado

VOTOS_EMITIDOS:
  id_voto          → idVoto
  dni_votante      → dniVotante
  id_candidato     → idCandidato
  candidato_nombre → candidatoNombre
  cargo_votado     → cargoVotado
  partido_nombre   → partidoNombre
  departamento     → departamento
  provincia        → provincia
  distrito         → distrito
  fecha_registro   → fechaRegistro
```

---

## 🛠️ STACK TÉCNICO

```
Frontend:
  - React 18+
  - Vite
  - React Router
  - Framer Motion (animaciones)
  - Lucide React (iconos)
  - Tailwind CSS (estilos)

Backend:
  - Spring Boot 3.x
  - Spring Data JPA
  - PostgreSQL

HTTP Client:
  - Fetch API (nativo de JavaScript)

Autenticación:
  - DNI como identificador (sin login tradicional)
```

---

## 📋 FUNCIONES CLAVE DEL SERVICIO

```javascript
// votantesService.js
✅ consultarVotantePorDni(dni)
   └─ Valida si el DNI existe en BD
   
✅ actualizarUbicacionVotante(dni, dept, prov, dist)
   └─ Actualiza ubicación del votante
   
✅ finalizarVoto(dni)
   └─ Marca votante como "Votó"

// votosService.js
✅ registrarVoto(dniVotante, idCandidato)
   └─ Registra el voto emitido

// candidatosService.js
✅ obtenerCandidatosPresidenciales()
✅ obtenerCandidatosCongresistas()
✅ obtenerCandidatosAndinos()
✅ obtenerTodosCandidatos()
✅ obtenerCandidatoPorId(id)
```

---

## 🎯 ESTADO ACTUAL

```
Fase 1: Verificación y Datos
  ✅ Consulta de votante
  ✅ Validación de DNI contra BD
  ✅ Actualización de ubicación
  ✅ Verificación CAPTCHA
  ✅ Navegación segura a Votar

Fase 2: Candidatos (Por hacer)
  ⏳ Obtener candidatos de API
  ⏳ Mostrar tarjetas de candidatos
  ⏳ Modales de detalles

Fase 3: Votación (Por hacer)
  ⏳ Seleccionar candidatos
  ⏳ Registrar votos en BD
  ⏳ Confirmación

Fase 4: Resultados (Por hacer)
  ⏳ Mostrar confirmación
  ⏳ Pantalla final
```

---

## 💡 NOTAS IMPORTANTES

1. **No hay datos simulados:** Todo viene de la BD
2. **Manejo de errores:** El usuario ve mensajes claros
3. **Estados de carga:** Spinners mientras se consulta API
4. **Flujo navegable:** Botones back en cada paso
5. **Datos persistentes:** Se guardan en BD correctamente
6. **CORS requerido:** Backend debe permitir requests del frontend

---

## 🚀 PARA EJECUTAR

```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3 (opcional): Ver logs
tail -f backend/logs/app.log
```

---

**📍 Punto de partida para Fase 2:** `src/pages/votar/Votar.jsx`

**📍 Servicios disponibles:** `src/services/*Service.js`

**📍 Configuración API:** `src/config/apiConfig.js`


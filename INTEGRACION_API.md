# Guía de Integración Frontend - API de Votación

## 📋 Resumen de Cambios

Se ha implementado la integración completa del frontend con la API REST del backend para el flujo de verificación y votación.

## 🔧 Configuración Necesaria

### 1. URL del API Backend

Asegúrate de que la URL del backend esté correctamente configurada. Por defecto es `http://localhost:8080/api`.

**Para cambiar la URL:**
- Editar `src/config/apiConfig.js` y modificar `API_BASE_URL`
- O establecer la variable de entorno `REACT_APP_API_URL` en el archivo `.env`

### 2. CORS (Cross-Origin Resource Sharing)

Si el frontend y backend están en diferentes puertos/dominios, asegúrate de que el backend tenga CORS habilitado.

En tu `application.properties` o `application.yml` de Spring Boot:
```properties
# Permitir requests desde el frontend
server.servlet.context-path=/
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000
spring.web.cors.allowed-methods=*
spring.web.cors.allowed-headers=*
```

## 📁 Archivos Creados/Modificados

### Archivos Creados:

1. **`src/services/votantesService.js`**
   - Métodos para consultar y actualizar datos de votantes
   - Funciones: `consultarVotantePorDni()`, `actualizarUbicacionVotante()`, `finalizarVoto()`

2. **`src/services/votosService.js`**
   - Método para registrar votos
   - Función: `registrarVoto(dni, idCandidato)`

3. **`src/services/candidatosService.js`** (actualizado)
   - Métodos para obtener candidatos por categoría
   - Funciones: `obtenerCandidatosPresidenciales()`, `obtenerCandidatosCongresistas()`, etc.

4. **`src/config/apiConfig.js`**
   - Configuración centralizada de la API
   - Helper `fetchAPI()` para peticiones

### Archivos Modificados:

1. **`src/pages/votar/Verificacion.jsx`**
   - Reemplazados datos simulados por llamadas a la API
   - Agregado manejo de estados de carga (loading)
   - Implementado flujo correcto de verificación:
     - Paso 1: Ingresar DNI y validar contra BD
     - Paso 2: Mostrar datos del votante (ahora desde DB)
     - Paso 3: Verificación de seguridad (CAPTCHA)
     - Paso 4: Seleccionar departamento en mapa
     - Paso 5: Completar provincia y distrito

## 🔄 Flujo de Verificación Implementado

```
Paso 1: DNI Input
   ↓ (consultarVotantePorDni)
Paso 2: Mostrar Datos (con opción de actualizar ubicación)
   ↓
   ├─→ [ACTUALIZAR UBICACIÓN] ──→ Paso 4: Seleccionar Departamento
   │      ↓ (actualizarUbicacionVotante)
   │   Paso 5: Completar Provincia/Distrito
   │      ↓
   └─→ [CONTINUAR VERIFICACIÓN] → Paso 3: Verificación de Seguridad
      ↓ (procederCaptcha)
Paso 3: CAPTCHA Verification
   ↓ (completarVerificacion + finalizarVoto)
✅ Navegar a /votar con datos del votante
```

## 📡 Endpoints Utilizados

### Votantes
- `GET /api/votantes/consulta/{dni}` - Consultar votante por DNI
- `PUT /api/votantes/ubicacion/{dni}` - Actualizar ubicación
- `POST /api/votantes/finalizar/{dni}` - Marcar como "Votó"

### Candidatos (Para fases posteriores)
- `GET /api/candidatos/presidencial` - Presidentes y vicepresidentes
- `GET /api/candidatos/congresistas` - Congresistas
- `GET /api/candidatos/andinos` - Parlamentarios andinos

### Votos (Para fases posteriores)
- `POST /api/votos/registrar` - Registrar un voto

## 📊 Datos Esperados

### Request: Consulta de Votante
```javascript
GET /api/votantes/consulta/12345678
```

### Response: Votante
```json
{
  "idVotante": 1,
  "dni": "12345678",
  "nombres": "Juan",
  "apellidos": "García López",
  "fechaNac": "1990-05-15",
  "sexo": "M",
  "departamento": "Lima",
  "provincia": "Lima",
  "distrito": "San Isidro",
  "estado": "No votó",
  "fechaAcceso": null
}
```

### Request: Actualizar Ubicación
```javascript
PUT /api/votantes/ubicacion/12345678
{
  "departamento": "Lima",
  "provincia": "Lima",
  "distrito": "San Isidro"
}
```

### Request: Registrar Voto
```javascript
POST /api/votos/registrar
{
  "dniVotante": "12345678",
  "idCandidato": 1
}
```

## 🛠️ Cómo Usar los Servicios

### Ejemplo: Verificar un votante
```javascript
import { consultarVotantePorDni } from '@/services/votantesService';

try {
  const votante = await consultarVotantePorDni("12345678");
  console.log(votante); // { dni: "12345678", nombres: "Juan", ... }
} catch (error) {
  console.error("Error:", error.message);
}
```

### Ejemplo: Registrar un voto
```javascript
import { registrarVoto } from '@/services/votosService';

try {
  const voto = await registrarVoto("12345678", 1);
  console.log("Voto registrado:", voto);
} catch (error) {
  console.error("Error:", error.message);
}
```

## ⚠️ Manejo de Errores

Los servicios lanzan excepciones que incluyen mensajes descriptivos:
- `"DNI no encontrado en el sistema"` - Error 404
- `"Error al actualizar la ubicación"` - Error en PUT
- `"Este votante ya ha votado"` - Error 409 (Conflict)

El componente `Verificacion.jsx` captura estos errores y los muestra al usuario.

## 🔐 Seguridad

- Las contraseñas **nunca** se envían desde el frontend
- El DNI es la clave principal para identificar al votante
- Se valida en el backend antes de procesar cualquier acción
- Se usa HTTPS en producción (cambiar `http://` a `https://`)

## 🚀 Próximos Pasos para Completar el Flujo

1. **Modificar `Votar.jsx`** para:
   - Obtener candidatos de los endpoints
   - Usar `registrarVoto()` al seleccionar un candidato
   - Mostrar datos del votante desde `location.state`

2. **Agregar validaciones adicionales**:
   - Verificar que el votante no haya votado ya
   - Validar integridad de datos

3. **Implementar pantalla de éxito** tras completar todos los votos

## 📝 Notas Importantes

- **NO** cambiar los nombres de los servicios sin actualizar las importaciones
- **NO** agregar datos simulados nuevamente; siempre usar la API
- Los datos del votante se pasan a través de `location.state` al navegar a `/votar`
- El CAPTCHA es local (no requiere backend), pero se puede mejorar con generación backend

## 🆘 Troubleshooting

### Error: "Failed to fetch"
- Verificar que el backend está corriendo en `http://localhost:8080`
- Verificar CORS en el backend

### Error: "DNI no encontrado"
- Verificar que los datos existen en la BD
- Usar un DNI válido del sistema

### Error: "Cannot read property of undefined"
- Asegurarse que los campos del votante coinciden con lo esperado en la BD
- Revisar la estructura de la respuesta del endpoint

---

**Última actualización:** 15 de Noviembre de 2025
**Versión:** 1.0

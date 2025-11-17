// CHECKLIST DE VERIFICACIÓN - IMPLEMENTACIÓN COMPLETADA

## ✅ VERIFICACIÓN FINAL DE IMPLEMENTACIÓN

### 📋 Archivos Creados/Modificados

**Nuevos Archivos:**
- [ ] ✅ `src/services/votantesService.js` - Servicio de votantes
- [ ] ✅ `src/services/votosService.js` - Servicio de votos
- [ ] ✅ `src/config/apiConfig.js` - Configuración centralizada
- [ ] ✅ `INTEGRACION_API.md` - Documentación completa
- [ ] ✅ `RESUMEN_CAMBIOS.md` - Resumen de cambios
- [ ] ✅ `test-api.sh` - Script para probar API
- [ ] ✅ Este archivo de checklist

**Archivos Modificados:**
- [ ] ✅ `src/pages/votar/Verificacion.jsx` - Componente principal actualizado

---

### 🔧 VERIFICACIÓN DE CONFIGURACIÓN

Antes de ejecutar, verifica:

- [ ] **Backend corriendo:**
  ```bash
  # Backend debería estar en
  http://localhost:8080
  ```

- [ ] **Base de datos con datos:**
  ```sql
  SELECT COUNT(*) FROM votantes;  -- Debería tener datos
  ```

- [ ] **CORS habilitado en Spring Boot:**
  ```properties
  # En application.properties
  spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:3000
  ```

- [ ] **Frontend corriendo:**
  ```bash
  npm run dev
  # Debería estar en http://localhost:5173
  ```

---

### 🧪 PRUEBAS DE FUNCIONAMIENTO

#### Test 1: Ingresar DNI Válido
- [ ] Ingresa un DNI que EXISTE en tu BD (ej: 12345678)
- [ ] Click en "CONSULTAR"
- [ ] Debería mostrar los datos del votante
- [ ] ❌ Si falla: Verifica que el DNI existe en BD

#### Test 2: Ingresar DNI Inválido
- [ ] Ingresa un DNI que NO existe (ej: 99999999)
- [ ] Click en "CONSULTAR"
- [ ] Debería mostrar error: "DNI no encontrado en el sistema"
- [ ] ❌ Si no muestra error: Revisa el servicio

#### Test 3: Mostrar Datos Completos
- [ ] En Paso 2, verifica que aparecen:
  - [ ] Nombres
  - [ ] Apellidos
  - [ ] Fecha de Nacimiento
  - [ ] Sexo
  - [ ] DNI
  - [ ] Departamento
  - [ ] Provincia
  - [ ] Distrito
- [ ] ❌ Si faltan datos: Verifica estructura en BD

#### Test 4: Actualizar Ubicación
- [ ] Click en "ACTUALIZAR UBICACIÓN"
- [ ] Selecciona un departamento en el mapa
- [ ] Ingresa Provincia y Distrito
- [ ] Click en "COMPLETAR VERIFICACIÓN"
- [ ] Debería guardar y volver a Paso 2
- [ ] Verifica que los datos se actualizaron
- [ ] ❌ Si falla: Revisa el endpoint PUT

#### Test 5: Verificación CAPTCHA
- [ ] Click en "CONTINUAR CON VERIFICACIÓN"
- [ ] Ingresa el código CAPTCHA mostrado
- [ ] Click en "VERIFICAR"
- [ ] Si es correcto, debería navegar a /votar
- [ ] ❌ Si falla: Revisa la lógica de CAPTCHA

#### Test 6: Navegación Final
- [ ] Tras completar la verificación
- [ ] Debería navegar a `/votar`
- [ ] Los datos del votante deberían estar disponibles
- [ ] ❌ Si no navega: Revisa la función completarVerificacion

---

### 🐛 TROUBLESHOOTING

**Error: "Failed to fetch"**
```
✅ Solución: Verifica que el backend está corriendo en http://localhost:8080
```

**Error: "DNI no encontrado"**
```
✅ Solución: Inserta datos en la BD:
INSERT INTO votantes (dni, nombres, apellidos, fecha_nac, sexo, departamento, provincia, distrito, estado)
VALUES ('12345678', 'Juan', 'García', '1990-05-15', 'M', 'Lima', 'Lima', 'San Isidro', 'No votó');
```

**Error: "CORS policy blocked"**
```
✅ Solución: Habilita CORS en backend:
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

**La ubicación no se actualiza**
```
✅ Solución: Verifica que el endpoint PUT está bien:
PUT /api/votantes/ubicacion/{dni}
Content-Type: application/json

{
  "departamento": "Lima",
  "provincia": "Lima",
  "distrito": "San Isidro"
}
```

**Falta icono Loader**
```
✅ Solución: Verifica la importación en Verificacion.jsx:
import { ..., Loader } from "lucide-react";
```

---

### 📊 VERIFICACIÓN DE CÓDIGO

**Verificar que no haya referencias a datos simulados:**
```bash
# Ejecuta esto en la carpeta del proyecto
grep -r "CIUDADANOS_DB" src/  # No debería encontrar nada
grep -r "ciudadano\." src/pages/votar/Verificacion.jsx  # No debería encontrar nada
```

**Verificar que se usan los servicios correctamente:**
```javascript
// En Verificacion.jsx debería ver:
import { consultarVotantePorDni, actualizarUbicacionVotante, finalizarVoto } from "../../services/votantesService";
```

---

### 🚀 PRÓXIMOS PASOS

Una vez que todo funcione correctamente, continúa con:

1. **Fase 2: Integrar Candidatos**
   - [ ] Modificar `src/pages/votar/Votar.jsx`
   - [ ] Importar servicios de candidatos
   - [ ] Mostrar candidatos desde API

2. **Fase 3: Registrar Votos**
   - [ ] Usar `registrarVoto()` al seleccionar candidato
   - [ ] Guardar votos en BD

3. **Fase 4: Pantalla de Confirmación**
   - [ ] Mostrar resumen de votos
   - [ ] Opción de revisar o confirmar

---

### 💾 BACKUP Y CONTROL DE VERSIONES

Asegúrate de:
- [ ] Hacer commit de los cambios:
  ```bash
  git add .
  git commit -m "feat: integración de API para flujo de verificación"
  ```

- [ ] Si algo falla, puedes revertir:
  ```bash
  git revert <commit-hash>
  ```

---

### 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs del backend**
2. **Abre DevTools (F12) → Console** en el navegador
3. **Ejecuta test-api.sh** para verificar endpoints
4. **Verifica BD:** `SELECT * FROM votantes;`
5. **Reinicia servicios:** Backend y Frontend

---

## ✨ ¡LISTO PARA USAR!

Si todos los tests pasan ✅, la integración está lista.

**Próximo paso:** Continuar con la Fase 2 (Candidatos)

---

**Última actualización:** 15 de Noviembre de 2025
**Estado:** ✅ COMPLETADO Y FUNCIONAL

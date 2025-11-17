/**
 * 🎯 INSTRUCCIONES FINALES - QUÉ HACER AHORA
 * ==========================================
 */

// PASO 1: ACTUALIZA EL NAVEGADOR
// ===============================
// Si tenías la app abierta, presiona F5 para recargar
// O cierra la pestaña y abre nuevamente http://localhost:5173/votar

// PASO 2: VE AL FLUJO DE VOTACIÓN
// ================================
// 1. Verifica con DNI y contraseña
// 2. Selecciona "Congresistas"
// 3. Abre DevTools: F12
// 4. Ve a pestaña "Console"

// PASO 3: SELECCIONA UN CANDIDATO
// ================================
// Click en cualquier candidato (ej: "Adriana Tudela")
// En la console deberías ver:
// >>> "Click en candidato ID: 401, nombre: Adriana Tudela"

// PASO 4: SELECCIONA UN SEGUNDO (OPCIONAL)
// ==========================================
// Click en otro candidato
// En la console deberías ver:
// >>> "Click en candidato ID: 402, nombre: Alejandro Cavero Alva"

// PASO 5: CONFIRMA TU VOTO
// ========================
// Click en botón "Confirmar (1/2)" o "Confirmar (2/2)"
// 
// En la console deberías ver (CRÍTICO):
// >>> "=== DEBUG Congresistas handleConfirmar ==="
// >>> "Candidatos encontrados: [Array(1)]"
//      └─> Al expandir debe mostrar: [{id: 401, nombre: "Adriana Tudela", partidoNombre: "Avanza País", ...}]
// >>> "=== VOTO CONGRESAL A ENVIAR ==="
//      { id: 401, nombre: "Adriana Tudela", candidatos: [...], preferenciales: [401], ... }
// >>> "=== Registrando votos preferenciales (Congresistas) ==="
// >>> "Registrando preferencial ID: 401, nombre: Adriana Tudela, partido: Avanza País"
// >>> ">>> DATOS A ENVIAR: dni=73659841, idPref=401, ..., nombre=Adriana Tudela, partido=Avanza País"

// PASO 6: VERIFICA LA PETICIÓN NETWORK
// ======================================
// En DevTools: ve a pestaña "Network"
// Busca petición POST a: /api/votos/registrar
// Click en ella → ve a "Request" o "Payload"
// Deberías ver:
// {
//   "dniVotante": "73659841",
//   "idCandidato": 401,
//   "cargoVotado": "Congresistas",
//   "candidatoNombre": "Adriana Tudela",     ← NO NULL
//   "partidoNombre": "Avanza País"           ← NO NULL
// }

// PASO 7: VERIFICA LA RESPUESTA
// ==============================
// En la MISMA petición Network → ve a "Response"
// Deberías ver:
// {
//   "success": true,
//   "mensaje": "Voto registrado correctamente",
//   "votoId": 123
// }

// PASO 8: VERIFICA LA BASE DE DATOS
// ==================================
// Abre tu cliente SQL (Adminer, pgAdmin, etc.)
// Ejecuta:
// SELECT dni_votante, id_candidato, candidato_nombre, cargo_votado, partido_nombre 
// FROM votos_emitidos 
// WHERE dni_votante = '73659841' 
// ORDER BY id_voto DESC 
// LIMIT 5;
//
// Deberías ver EXACTAMENTE:
// dni_votante | id_candidato | candidato_nombre    | cargo_votado   | partido_nombre
// ------------|--------------|---------------------|----------------|----------------
// 73659841    | 401          | Adriana Tudela      | Congresistas   | Avanza País
// 73659841    | 402          | Alejandro Cavero... | Congresistas   | Avanza País
// (si seleccionaste 2)

// ✅ SI LLEGAS AQUÍ CON TODO CORRECTO = PROBLEMA RESUELTO

// ❌ SI ALGO SALE MAL, VERIFICA:
// ================================

// Problema: "Console muestra candidatos: [] vacío"
// Solución: Backend no devolviendo candidatos
// → Verifica GET /api/candidatos/congresistas en Network

// Problema: "Nombre/partido null en paso 5"
// Solución: candidatos no tiene las propiedades correctas
// → En console, expande candidatos array y verifica que tengan:
//   id, nombre, partidoNombre, foto, distrito

// Problema: "JSON que se envía tiene null"
// Solución: Votar.jsx no está extrayendo correctamente
// → Verifica en votosService que llamada tenga nombre/partido

// Problema: "Response 500 del backend"
// Solución: Backend no procesa correctamente
// → Verifica VotoController.registrarVoto()
// → Agrega log antes de guardar: System.out.println("candidatoNombre: " + votoRequest.getCandidatoNombre());

// Problema: "BD muestra NULL"
// Solución: Backend no está guardando estos campos
// → Verifica que VotoEmitido tenga setters:
//   setCandidatoNombre(String candidatoNombre)
//   setPartidoNombre(String partidoNombre)
// → Verifica que en VotoController se usen:
//   votoEmitido.setCandidatoNombre(votoRequest.getCandidatoNombre());
//   votoEmitido.setPartidoNombre(votoRequest.getPartidoNombre());

// APOYO:
// ======
// Si necesitas ver la estructura completa:
// Abre: FLUJO_CONGRESISTAS_SIMPLIFICADO.js
// Abre: VERIFICACION_CHECKLIST.js
// Abre: RESUMEN_SOLUCION_FINAL.js

// ¡ÉXITO! 🎉

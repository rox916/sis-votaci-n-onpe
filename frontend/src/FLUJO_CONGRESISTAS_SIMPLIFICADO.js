/**
 * FLUJO DE DATOS - CONGRESISTAS (VERSIÓN SIMPLIFICADA)
 * ===================================================
 * 
 * 1. BACKEND PROVEE CANDIDATOS
 *    - API: GET /candidatos/congresistas
 *    - Devuelve: Array[{ idCandidato, nombreCompleto, partidoNombre, foto, distrito, ... }]
 *    - Ejemplo: { idCandidato: 401, nombreCompleto: "Adriana Tudela", partidoNombre: "Avanza País", ... }
 * 
 * 2. FRONTEND CARGA CANDIDATOS
 *    - candidatosService.fetchCandidatosParaVotacion()
 *    - Transforma el array a estructura local:
 *      {
 *        id: 401,
 *        nombre: "Adriana Tudela",
 *        partidoNombre: "Avanza País",
 *        distrito: "San Isidro",
 *        foto: "...",
 *        propuestas: [...],
 *        biografia: "..."
 *      }
 *    - Almacena en: candidatosData.congresistas
 * 
 * 3. VOTAR.JSX RENDERIZA CONGRESISTAS
 *    - Pasa: <Congresistas candidatos={candidatosData.congresistas} ... />
 *    - Congresistas recibe array completo de candidatos DEL BACKEND
 * 
 * 4. USUARIO SELECCIONA EN CONGRESISTAS.JSX
 *    - Click en candidato → handleCandidateSelect(401, "Adriana Tudela")
 *    - Estado: votosSeleccionados = [401] (hasta 2)
 *    - Log: "Click en candidato ID: 401, nombre: Adriana Tudela"
 * 
 * 5. USUARIO CONFIRMA
 *    - handleConfirmar() → busca candidatos en array recibido
 *    - candidatosSeleccionados = candidatos.filter(c => c.id === 401)
 *    - Construye votoCongresal:
 *      {
 *        id: 401,
 *        nombre: "Adriana Tudela",
 *        partidoNombre: "Avanza País",
 *        preferenciales: [401],
 *        candidatos: [{ id: 401, nombre: "Adriana Tudela", partidoNombre: "Avanza País", ... }],
 *        ...
 *      }
 *    - Llama: onConfirmarVoto(votoCongresal)
 * 
 * 6. VOTAR.JSX RECIBE EN CONFIRMARVOTOS DIRECTO
 *    - candidatoVotado = votoCongresal
 *    - Detecta: candidatoVotado.preferenciales (es array)
 *    - Loop: for (const idPref of [401]) {
 *        - candidatoEncontrado = candidatos.find(c => c.id === 401)
 *        - nombre = "Adriana Tudela" ✓
 *        - partido = "Avanza País" ✓
 *        - Llama: registrarVoto(dni, 401, "Congresistas", "Adriana Tudela", "Avanza País")
 *      }
 * 
 * 7. VOTOSERVICE.JS REGISTRA
 *    - Body enviado:
 *      {
 *        "dniVotante": "73659841",
 *        "idCandidato": 401,
 *        "cargoVotado": "Congresistas",
 *        "candidatoNombre": "Adriana Tudela",
 *        "partidoNombre": "Avanza País"
 *      }
 * 
 * 8. BACKEND RECIBE Y GUARDA
 *    - VotoController.registrarVoto() recibe el JSON anterior
 *    - Valida: idCandidato !== null ✓ (es 401)
 *    - Busca candidato: candidatoRepository.findById(401) ✓
 *    - Obtiene: nombreCompleto = "Adriana Tudela", partidoNombre = "Avanza País"
 *    - Pero TAMBIÉN usa los parámetros recibidos:
 *      candidatoNombre = "Adriana Tudela" (del request)
 *      partidoNombre = "Avanza País" (del request)
 *    - Crea VotoEmitido:
 *      {
 *        idCandidato: 401,
 *        candidatoNombre: "Adriana Tudela",
 *        partidoNombre: "Avanza País",
 *        cargoVotado: "Congresistas",
 *        ...
 *      }
 *    - Guarda en BD ✓
 * 
 * PUNTOS CRÍTICOS:
 * ================
 * 1. candidatos DEBE venir del backend, NO del mockCongresistas local
 * 2. candidatos DEBE tener: id, nombre, partidoNombre, foto, distrito
 * 3. Votar.jsx DEBE pasar candidatos DEL BACKEND a Congresistas
 * 4. Congresistas DEBE construir votoCongresal con candidatos array incluido
 * 5. Votar.jsx DEBE extraer nombre y partido del candidatos array
 * 6. votosService DEBE enviar nombre y partido en el body JSON
 * 7. Backend DEBE usar ambos: idCandidato para búsqueda + nombre/partido para registro
 */

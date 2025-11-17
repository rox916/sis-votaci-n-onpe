// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  FileText,
  Shield,
  CheckCircle2,
  Vote,
  HelpCircle,
  Info,
  Lock,
  Server,
} from "lucide-react";

export default function VotoDigital() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const secciones = [
    {
      id: "fechas",
      titulo: "Fechas importantes",
      icono: Calendar,
      accent: "border-t-blue-500",
      items: [
        { titulo: "Fecha de elecciones", descripcion: "12 de abril de 2026." },
        { titulo: "Inicio de campaña", descripcion: "1 de marzo de 2026." },
        { titulo: "Cierre de campaña", descripcion: "10 de abril de 2026." },
        { titulo: "Publicación de resultados", descripcion: "13 de abril de 2026." },
      ],
    },
    {
      id: "requisitos",
      titulo: "Requisitos para votar",
      icono: CheckCircle2,
      accent: "border-t-emerald-500",
      items: [
        { titulo: "DNI vigente", descripcion: "Documento Nacional de Identidad actualizado." },
        { titulo: "Estar en el padrón", descripcion: "Verificar tu inscripción en el padrón electoral." },
        { titulo: "Mayoría de edad", descripcion: "Tener 18 años cumplidos al día de las elecciones." },
        { titulo: "Conexión a internet", descripcion: "Contar con una conexión estable para el voto digital." },
      ],
    },
    {
      id: "proceso",
      titulo: "Etapas del proceso",
      icono: FileText,
      accent: "border-t-indigo-500",
      items: [
        { titulo: "1. Autenticación", descripcion: "Ingreso al sistema con tu DNI y verificación de identidad." },
        { titulo: "2. Selección", descripcion: "Elección de las cédulas y cargos que te corresponden." },
        { titulo: "3. Emisión del voto", descripcion: "Marcación de tus opciones de forma segura y secreta." },
        { titulo: "4. Confirmación", descripcion: "Revisión del resumen de tu voto antes de enviarlo." },
      ],
    },
    {
      id: "seguridad",
      titulo: "Seguridad del sistema",
      icono: Shield,
      accent: "border-t-sky-500",
      items: [
        { titulo: "Encriptación", descripcion: "Los votos viajan cifrados de extremo a extremo." },
        { titulo: "Anonimato", descripcion: "Tu identidad se guarda separada de tu elección de voto." },
        { titulo: "Auditoría", descripcion: "El sistema puede ser revisado por organismos independientes." },
        { titulo: "Integridad", descripcion: "Una vez registrado, el voto no puede ser alterado ni eliminado." },
      ],
    },
  ];

  const pasosVotoDigital = [
    {
      paso: 1,
      titulo: "Acceso al sistema",
      descripcion:
        "Ingresas con tu DNI y los datos que el sistema te solicita para validar tu identidad.",
    },
    {
      paso: 2,
      titulo: "Verificación de datos",
      descripcion:
        "El sistema verifica que estés en el padrón y que no hayas emitido tu voto previamente.",
    },
    {
      paso: 3,
      titulo: "Selección de opciones",
      descripcion:
        "Visualizas las cédulas correspondientes y marcas tus preferencias de manera confidencial.",
    },
    {
      paso: 4,
      titulo: "Revisión del voto",
      descripcion:
        "Se muestra un resumen de tu voto para que confirmes que todo es correcto.",
    },
    {
      paso: 5,
      titulo: "Envío y registro",
      descripcion:
        "Al confirmar, tu voto se cifra y se registra en los servidores del sistema electoral.",
    },
    {
      paso: 6,
      titulo: "Comprobante digital",
      descripcion:
        "Recibes un comprobante digital que confirma que tu voto fue recibido por el sistema.",
    },
  ];

  const preguntasFrecuentes = [
    {
      pregunta: "¿El voto digital tiene la misma validez que el voto presencial?",
      respuesta:
        "Sí. El voto emitido a través del sistema digital tiene plena validez legal y se contabiliza de la misma forma que el voto presencial.",
    },
    {
      pregunta: "¿Qué pasa si se corta mi conexión a internet mientras voto?",
      respuesta:
        "Si la conexión se interrumpe antes de confirmar, el voto no se registra. Deberás ingresar nuevamente y repetir el proceso.",
    },
    {
      pregunta: "¿Necesito usuario y contraseña?",
      respuesta:
        "No. El acceso se realiza con tu DNI y los mecanismos de verificación definidos por el sistema electoral, junto con un código de seguridad en pantalla.",
    },
    {
      pregunta: "¿Puedo votar desde mi celular?",
      respuesta:
        "Sí. Puedes votar desde cualquier computadora, tablet o smartphone con conexión a internet y un navegador actualizado.",
    },
    {
      pregunta: "¿Puedo volver a ingresar después de votar?",
      respuesta:
        "Puedes ingresar para consultar, pero el sistema no permitirá registrar un segundo voto. Solo se contabiliza un voto por persona.",
    },
    {
      pregunta: "¿Quién tiene acceso a mis datos personales?",
      respuesta:
        "Tus datos se utilizan únicamente para validar tu identidad y evitar fraudes. Se almacenan bajo estrictas políticas de seguridad y confidencialidad.",
    },
  ];

  return (
    <div className="bg-[#F8FAFC] text-gray-800">
      {/* HERO similar al Home */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white text-center py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#13203d] to-[#0F172A] opacity-95" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            ¿Qué es el voto digital?
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 leading-relaxed">
            Es la modalidad que te permite participar en las elecciones a través de internet,
            usando un sistema oficial, seguro y auditable.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/votar"
              className="bg-[#2563EB] hover:bg-[#1E40AF] px-7 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-900/30 flex items-center gap-2"
            >
              <Vote className="w-4 h-4" />
              Ir al sistema de votación
            </Link>
            <a
              href="#proceso"
              className="border border-blue-200 text-blue-100 px-7 py-2.5 rounded-lg text-sm md:text-base font-medium hover:bg-white hover:text-[#0F172A] transition-all flex items-center gap-2"
            >
              Conocer cómo funciona
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 3 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_#2563EB,_transparent_60%)]"
        />
      </section>

      {/* INFORMACIÓN CLAVE (Fechas / Requisitos / Proceso / Seguridad) */}
      <section className="py-20 px-6 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">
              Información clave del voto digital
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Antes de votar, revisa estas secciones con los aspectos más importantes sobre
              fechas, requisitos, etapas y seguridad del sistema.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {secciones.map((seccion, index) => {
              const Icono = seccion.icono;
              return (
                <motion.article
                  key={seccion.id}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeUp}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`bg-[#F8FAFC] rounded-2xl border border-gray-200 shadow-sm p-6 md:p-7 ${seccion.accent}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                      <Icono className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1E3A8A]">
                      {seccion.titulo}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {seccion.items.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-1" />
                        <div>
                          <p className="font-medium text-sm text-slate-900">
                            {item.titulo}
                          </p>
                          <p className="text-sm text-gray-600">{item.descripcion}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESO PASO A PASO + SEGURIDAD */}
      <section id="proceso" className="py-20 px-6 bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">
              ¿Cómo funciona el voto digital?
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              El proceso está pensado para ser claro y sencillo. Estos son los pasos que seguirás
              el día de las elecciones.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pasosVotoDigital.map((item, index) => (
              <motion.div
                key={item.paso}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-semibold text-[#2563EB]">
                    {item.paso}
                  </div>
                  <h3 className="font-semibold text-sm text-[#1E3A8A]">
                    {item.titulo}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.descripcion}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* PREGUNTAS FRECUENTES + CTA FINAL (no desplegable) */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
              <HelpCircle className="w-6 h-6 text-[#2563EB]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2">
              Preguntas frecuentes sobre el voto digital
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Si tienes dudas, es probable que la respuesta esté aquí. Lee con calma
              antes de ingresar al sistema.
            </p>
          </motion.div>

          {/* FAQs en tarjetas simples */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {preguntasFrecuentes.map((faq, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-5"
              >
                <p className="font-semibold text-slate-900 mb-1">
                  {faq.pregunta}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {faq.respuesta}
                </p>
              </div>
            ))}
          </motion.div>

            <br/>

          {/* CTA compacto arriba de las FAQs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="bg-[#F8FAFC] border border-blue-100 rounded-2xl px-5 py-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Vote className="w-4 h-4 text-[#2563EB]" />
                </div> 
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-slate-900">
                    ¿Listo para ejercer tu derecho al voto digital?
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Cuando el proceso electoral esté habilitado podrás ingresar con tu DNI
                    y registrar tu voto de forma rápida y segura.
                  </p>
                </div>
              </div>

              <div className="md:flex-shrink-0">
                <Link
                  to="/votar"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1E40AF] transition-colors"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Ir al sistema de votación
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

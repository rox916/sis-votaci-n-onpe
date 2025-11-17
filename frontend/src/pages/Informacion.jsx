import { motion } from "framer-motion";
import { Shield, BookOpen, CheckCircle2, FileText } from "lucide-react";

export default function Informacion() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const valores = [
    {
      titulo: "Transparencia",
      descripcion:
        "Operamos con total apertura y claridad en todos nuestros procesos, permitiendo la verificación y auditoría del sistema.",
    },
    {
      titulo: "Inclusión",
      descripcion:
        "Diseñamos servicios accesibles para todos los ciudadanos, sin importar su nivel tecnológico o ubicación.",
    },
    {
      titulo: "Innovación",
      descripcion:
        "Nos mantenemos a la vanguardia tecnológica para ofrecer la mejor experiencia de votación digital.",
    },
    {
      titulo: "Seguridad",
      descripcion:
        "Protegemos la integridad de cada voto y la privacidad de cada ciudadano con tecnología de encriptación de última generación.",
    },
    {
      titulo: "Integridad",
      descripcion:
        "Actuamos con honestidad y ética en cada decisión, garantizando procesos justos para todos.",
    },
    {
      titulo: "Servicio",
      descripcion:
        "Nos dedicamos a servir a la ciudadanía con excelencia, respondiendo a sus necesidades y preocupaciones.",
    },
  ];

  const politicas = [
    {
      titulo: "Política de Privacidad",
      descripcion:
        "Nos comprometemos a proteger la información personal de todos los usuarios. Los datos de identificación se utilizan exclusivamente para verificar la identidad del votante y prevenir el fraude electoral. El voto es completamente anónimo y no puede ser rastreado hasta el votante individual.",
    },
    {
      titulo: "Política de Seguridad",
      descripcion:
        "Implementamos protocolos de seguridad de nivel bancario, incluyendo encriptación SSL/TLS, autenticación de dos factores y auditorías de seguridad regulares. Nuestros servidores están protegidos contra ataques cibernéticos y cuentan con respaldo constante.",
    },
    {
      titulo: "Política de Accesibilidad",
      descripcion:
        "El sistema está diseñado siguiendo las pautas WCAG 2.1 para garantizar el acceso a personas con discapacidades. Ofrecemos soporte técnico gratuito para asistir a cualquier ciudadano que necesite ayuda para votar.",
    },
    {
      titulo: "Política de Transparencia",
      descripcion:
        "Todos los resultados electorales son públicos y verificables. Los algoritmos de conteo son auditados por organismos independientes y los ciudadanos pueden solicitar información sobre el proceso mediante los canales oficiales.",
    },
    {
      titulo: "Política de Irreversibilidad del Voto",
      descripcion:
        "Una vez que el voto es confirmado, este se registra de manera permanente y no puede ser modificado o anulado. Esta política garantiza la integridad del proceso electoral y previene manipulaciones posteriores.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Título principal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">
            Información Institucional
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Conoce nuestra misión, visión y los valores que guían el Sistema Electoral Digital del Perú.
          </p>
        </motion.div>

        {/* ¿Qué hacemos? */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-12"
        >
          <h3 className="text-xl font-semibold mb-4">¿Qué hacemos?</h3>
          <p className="text-gray-700 leading-relaxed">
            Somos la plataforma dedicada a modernizar y democratizar el proceso electoral mediante
            el uso de tecnología digital segura y accesible. El sistema permite a los ciudadanos
            peruanos ejercer su derecho al voto de manera remota, manteniendo altos estándares de
            seguridad, transparencia e integridad electoral.
          </p>
          <p className="text-gray-700 leading-relaxed mt-6">
            Trabajamos en coordinación con los organismos electorales nacionales para garantizar que
            cada voto cuente y que el proceso democrático se fortalezca a través de la innovación
            tecnológica. Nuestro objetivo es que la participación ciudadana sea accesible para todos,
            sin importar su ubicación o situación personal.
          </p>
        </motion.div>

        {/* Misión / Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-8"
          >
            <div className="inline-flex items-center mb-4">
              <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Misión</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Facilitar el ejercicio democrático del voto mediante una plataforma digital segura,
              transparente y accesible que fortalezca la participación ciudadana y garantice la
              integridad de los procesos electorales en el Perú.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-8"
          >
            <div className="inline-flex items-center mb-4">
              <div className="w-12 h-12 rounded-md bg-purple-50 flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold">Visión</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Ser el sistema electoral digital referente en la región, reconocido por su innovación,
              seguridad y aporte a la consolidación democrática, alcanzando una participación ciudadana
              amplia y confiable en cada proceso electoral.
            </p>
          </motion.div>
        </div>

        {/* Valores */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-12"
        >
          <div className="inline-flex items-center mb-6">
            <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center mr-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Nuestros Valores</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valores.map((valor, index) => (
              <div key={index} className="flex">
                <div className="w-1 bg-blue-500 mr-4 rounded" />
                <div>
                  <h4 className="font-semibold">{valor.titulo}</h4>
                  <p className="text-gray-700">{valor.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Políticas del sistema */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8"
        >
          <div className="inline-flex items-center mb-6">
            <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center mr-4">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold">Políticas del Sistema</h3>
          </div>

          <div className="space-y-6">
            {politicas.map((p, index) => (
              <div key={index}>
                <h4 className="font-semibold">{p.titulo}</h4>
                <p className="text-gray-700">{p.descripcion}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Calendar, Users, Building2, Vote, FileSearch, CheckCircle2, Zap, Shield, Eye } from "lucide-react";

// --- Importamos FOTOS y LOGOS ---
import fotoRLA from "../assets/images/rafael_lopez_aliaga.jpg";
import fotoKeiko from "../assets/images/keiko_fujimori.jpg";
import fotoAcuna from "../assets/images/cesar_acuna.jpg";
import fotoAlvarez from "../assets/images/carlos_alvarez.jpg";
import fotoLopezChau from "../assets/images/alfonso_lopez_chau.jpg";
import fotoButters from "../assets/images/phillip_butters.jpg";
import fotoPerezTello from "../assets/images/marisol_perez_tello.jpg";
import fotoJulioChavez from "../assets/images/Julio_Chavez.jpg";

import logoRenovacion from "../assets/logos/renovacion_popular.png";
import logoFuerza from "../assets/logos/fuerza_popular.png";
import logoAPP from "../assets/logos/app.png";
import logoPaisTodos from "../assets/logos/pais_para_todos.png";
import logoAhoraNacion from "../assets/logos/ahora_nacion.png";
import logoAvanza from "../assets/logos/avanza_pais.png";
import logoPrimeroGente from "../assets/logos/primero_la_gente.png";
import logoAccionPopular from "../assets/logos/accion-popular.png";

export default function Home() {
  const candidatos = [
    {
      id: 0,
      nombre: "Julio Chávez",
      partido: "ACCIÓN POPULAR",
      image: fotoJulioChavez,
      logoPartido: logoAccionPopular 
    },
    {
      id: 1,
      nombre: "Rafael López Aliaga",
      partido: "RENOVACIÓN POPULAR",
      image: fotoRLA,
      logoPartido: logoRenovacion 
    },
    {
      id: 2,
      nombre: "Keiko Fujimori",
      partido: "FUERZA POPULAR",
      image: fotoKeiko,
      logoPartido: logoFuerza
    },
    {
      id: 3,
      nombre: "César Acuña",
      partido: "ALIANZA PARA EL PROGRESO",
      image: fotoAcuna,
      logoPartido: logoAPP
    },
    {
      id: 4,
      nombre: "Carlos Álvarez",
      partido: "PAÍS PARA TODOS",
      image: fotoAlvarez,
      logoPartido: logoPaisTodos
    },
    {
      id: 5,
      nombre: "Alfonso López Chau",
      partido: "AHORA NACIÓN",
      image: fotoLopezChau,
      logoPartido: logoAhoraNacion
    },
    {
      id: 6,
      nombre: "Phillip Butters",
      partido: "AVANZA PAÍS",
      image: fotoButters,
      logoPartido: logoAvanza
    },
    {
      id: 7,
      nombre: "Marisol Pérez Tello",
      partido: "PRIMERO LA GENTE",
      image: fotoPerezTello,
      logoPartido: logoPrimeroGente
    },
  ];

  const fechaElecciones = new Date("2026-04-12T00:00:00").getTime();
  const ahora = new Date().getTime();
  const diferencia = fechaElecciones - ahora;
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const meses = Math.floor(dias / 30);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-[#F8FAFC] text-gray-800">
      {/* ===== HERO CON CARRUSEL INFINITO ===== */}
      <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
        {/* FILA SUPERIOR - Carrusel infinito */}
        <div className="w-full overflow-hidden mb-12">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...candidatos, ...candidatos, ...candidatos].map((candidato, idx) => (
              <motion.div
                key={`top-${idx}`}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-w-max flex flex-col rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all"
              >
                <div
                  className="w-56 h-72 relative flex flex-col items-end justify-end p-6 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${candidato.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Logo del partido */}
                  <img
                    src={candidato.logoPartido}
                    alt={`Logo ${candidato.partido}`}
                    className="absolute top-4 left-4 w-10 h-10 object-contain rounded-full bg-white/20 p-1 shadow-lg z-10"
                  />

                  {/* Contenido de candidato */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-white text-center w-full"
                  >
                    <h3 className="text-lg font-extrabold mb-2 drop-shadow-lg leading-tight">
                      {candidato.nombre}
                    </h3>
                    <p className="text-xs text-blue-200 font-semibold drop-shadow-md">
                      {candidato.partido}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* FILA INFERIOR - Carrusel inverso */}
        <div className="w-full overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["-100%", "0%"] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...candidatos, ...candidatos, ...candidatos].map((candidato, idx) => (
              <motion.div
                key={`bottom-${idx}`}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-w-max flex flex-col rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all"
              >
                <div
                  className="w-56 h-72 relative flex flex-col items-end justify-end p-6 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${candidato.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Logo del partido */}
                  <img
                    src={candidato.logoPartido}
                    alt={`Logo ${candidato.partido}`}
                    className="absolute top-4 left-4 w-10 h-10 object-contain rounded-full bg-white/20 p-1 shadow-lg z-10"
                  />

                  {/* Contenido de candidato */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-white text-center w-full"
                  >
                    <h3 className="text-lg font-extrabold mb-2 drop-shadow-lg leading-tight">
                      {candidato.nombre}
                    </h3>
                    <p className="text-xs text-blue-200 font-semibold drop-shadow-md">
                      {candidato.partido}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contenido Central - Hero Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-center max-w-2xl px-12 text-white bg-gradient-to-r from-black/70 to-transparent"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Sistema Electoral Digital Nacional
          </h1>
          <p className="text-blue-100 text-lg mb-10 drop-shadow-md leading-relaxed">
            Participa en las Elecciones Generales 2026 del Perú. 
            Elige tu modalidad de voto — presencial o digital — y ejerce tu derecho 
            con seguridad, transparencia y confianza.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2563EB] hover:bg-[#1E40AF] px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2 text-white"
            >
              <Vote className="w-5 h-5" />
              Ir a Votar Ahora
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-blue-200 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white hover:text-[#0F172A] transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <FileSearch className="w-5 h-5" />
              Información Electoral
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ===== INFORMACIÓN DE ELECCIONES ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="py-20 text-center px-6 bg-white border-b border-gray-200"
      >
        <motion.h2 variants={staggerItem} className="text-3xl font-bold text-[#1E3A8A] mb-6">
          Elecciones Generales y Parlamento Andino 2026
        </motion.h2>
        <motion.p variants={staggerItem} className="text-gray-700 max-w-3xl mx-auto mb-10">
          Las Elecciones Generales del Perú se llevarán a cabo el{" "}
          <span className="font-semibold text-[#1E3A8A]">12 de abril de 2026</span>. 
          En esta jornada los ciudadanos elegirán al Presidente, Vicepresidentes, Congresistas 
          y Representantes ante el Parlamento Andino.
        </motion.p>

        <motion.div variants={staggerContainer} className="flex justify-center gap-16">
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div>
              <Calendar className="w-10 h-10 text-[#2563EB] mx-auto mb-2" />
            </div>
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-bold text-[#1E3A8A]"
            >
              {meses}
            </motion.p>
            <p className="text-gray-600">Meses</p>
          </motion.div>
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div>
              <Zap className="w-10 h-10 text-[#2563EB] mx-auto mb-2" />
            </div>
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="text-4xl font-bold text-[#1E3A8A]"
            >
              {dias % 30}
            </motion.p>
            <p className="text-gray-600">Días</p>
          </motion.div>
        </motion.div>

        <motion.p
          variants={staggerItem}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-gray-600"
        >
          Faltan <span className="font-semibold">{dias}</span> días para las Elecciones Generales 2026.
        </motion.p>
      </motion.section>

      {/* ===== MODALIDADES DE VOTO ===== */}
      <section className="relative py-24 bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0] px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
          ></motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10"
        >
          <motion.div variants={staggerItem}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full">
                Modalidades Disponibles
              </span>
            </motion.div>
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-6">
              Modalidades de Votación
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed text-lg">
              En las Elecciones Generales 2026 podrás participar de dos maneras: 
              <strong className="text-[#1E3A8A]"> voto presencial</strong> y <strong className="text-[#1E3A8A]">voto digital</strong>. 
              Ambas modalidades aseguran accesibilidad y transparencia en el proceso.
            </p>
            <ul className="space-y-4 text-gray-700 mb-8">
              {[
                {
                  label: "Voto presencial",
                  desc: "Acércate a tu local de votación asignado con tu DNI vigente.",
                  icon: Building2,
                },
                {
                  label: "Voto digital",
                  desc: "Emite tu voto en línea de forma segura desde cualquier dispositivo conectado a Internet.",
                  icon: Vote,
                },
                {
                  label: "Verificación",
                  desc: "Confirma tu modalidad en el padrón electoral oficial.",
                  icon: CheckCircle2,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 10, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)" }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <Icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E3A8A] mb-1">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all shadow-lg"
              >
                Conocer voto digital
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="relative group"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity"
            ></motion.div>
            <motion.div
              whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(37, 99, 235, 0.3)" }}
              className="relative bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-100 rounded-3xl p-10 text-center hover:shadow-3xl transition-all"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 flex justify-center"
              >
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Vote className="w-16 h-16 text-white" />
                </div>
              </motion.div>
              <h3 className="text-3xl font-bold text-[#1E3A8A] mb-4">Tu voto cuenta</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                El voto es un derecho y un deber ciudadano. Participa activamente 
                en la construcción del futuro de nuestro país.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
              >
                <p className="text-gray-600 italic text-sm font-medium">
                  "Una democracia fuerte se construye con la participación de todos."
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== ETAPAS DEL PROCESO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="bg-white py-24 px-6 border-t border-gray-200"
      >
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center mb-12">
          Etapas del Proceso Electoral
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: <Users className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />,
              title: "Convocatoria",
              desc: "Inicio del proceso electoral y registro de candidatos por los partidos políticos.",
            },
            {
              icon: <Building2 className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />,
              title: "Campaña Electoral",
              desc: "Difusión de planes de gobierno y propuestas bajo las normas vigentes.",
            },
            {
              icon: <Vote className="w-10 h-10 text-[#2563EB] mx-auto mb-3" />,
              title: "Jornada Electoral",
              desc: "Los ciudadanos emiten su voto presencial o digital de forma transparente.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-8 shadow-xl transition-all"
            >
              {item.icon}
              <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
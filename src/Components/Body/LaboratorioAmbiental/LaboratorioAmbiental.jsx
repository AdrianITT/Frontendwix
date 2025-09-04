import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./lab.css";

const SECCIONES = [
  {
    key: 1,
    titulo: "MUESTREO Y ANÁLISIS DE AGUAS",
    icon: "bi-droplet-half",
    items: ["Residuales", "Potables"],
  },
  {
    key: 2,
    titulo: "FUENTES FIJAS",
    icon: "bi-wind",
    items: [
      "Humedad en ductos",
      "Gases de combustión",
      "Partículas suspendidas totales perimetrales",
      "PM10 perimetrales",
      "Óxidos de nitrógeno",
      "SO₂, SO₃ y neblinas ácidas/alcalinas",
      "Compuestos orgánicos volátiles",
      "Ruido de fuentes fijas",
    ],
  },
  {
    key: 3,
    titulo: "LABORAL",
    icon: "bi-briefcase",
    items: [
      "Ruido laboral",
      "Temperaturas extremas y abatidas",
      "Sustancias químicas",
      "Iluminación",
      "Resistencia de tierras físicas y continuidad",
      "Vibraciones",
    ],
  },
  {
    key: 4,
    titulo: "OTROS",
    icon: "bi-bezier",
    items: [
      "Hidrocarburos totales rango diésel (fracción media)",
      "Hidrocarburos totales rango gasolina (fracción ligera)",
      "Hidrocarburos totales rango aceite (fracción pesada)",
      "Análisis CRIT",
    ],
  },
];

export default function LaboratorioAmbiental() {
  const [activeKey, setActiveKey] = useState(null);
  const secRef = useRef(null);

  const toggleCollapse = (key) => setActiveKey((k) => (k === key ? null : key));

  // Reveal on scroll
  useEffect(() => {
    const els = secRef.current?.querySelectorAll(".reveal") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
      { threshold: 0.16 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lab-sec py-5" ref={secRef}>
      <div className="container">
        <div className="text-center mb-4 reveal">
          <h2 className="fw-bold text-primary m-0">LABORATORIO AMBIENTAL</h2>
          <div className="divider-anim mx-auto my-3" aria-hidden="true" />
          <p className="text-muted">Servicios especializados de análisis ambiental</p>
        </div>

        <div className="accordion gap-3 d-grid reveal">
          {SECCIONES.map((sec) => {
            const open = activeKey === sec.key;
            return (
              <div className={`accordion-item glass shadow-sm rounded-4 ${open ? "is-open" : ""}`} key={sec.key}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button rounded-4 ${open ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleCollapse(sec.key)}
                    aria-expanded={open}
                  >
                    <i className={`me-2 ${sec.icon}`}></i>
                    {sec.titulo}
                    <i className={`bi bi-chevron-down ms-auto chevron ${open ? "rot" : ""}`} />
                  </button>
                </h2>

                <div className={`accordion-collapse collapse ${open ? "show" : ""}`}>
                  <div className="accordion-body">
                    <div className="chip-wrap">
                      {sec.items.map((it) => (
                        <span key={it} className="badge rounded-pill text-bg-light border chip">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="text-center mt-4 reveal">
          <a href="#Contacto" className="btn btn-primary btn-lg rounded-pill me-2">
            Solicitar cotización
          </a>
          <a href="#Acreditaciones" className="btn btn-outline-primary rounded-pill">
            Ver acreditaciones
          </a>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./acerca.css";

const AcercaNosotros = () => {
  const secRef = useRef(null);
  const imgWrapRef = useRef(null);

  // Reveal on scroll
  useEffect(() => {
    const els = secRef.current?.querySelectorAll(".reveal") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("show")),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Tilt en la imagen
  const handleMouseMove = (e) => {
    const el = imgWrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -8;
    const ry = ((x - r.width / 2) / r.width) * 8;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const handleMouseLeave = () => {
    const el = imgWrapRef.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };

  return (
    <section className="about-sec py-5" id="Empresa" ref={secRef}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Imagen */}
          <div className="col-md-5">
            <div
              className="about-media shadow-sm rounded-4 reveal"
              ref={imgWrapRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src="/Luz2Muestreo.jpeg"
                alt="INADE"
                className="w-100 h-100 rounded-4 object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* chips flotantes */}
              <div className="chips">
                <span className="chip">SPA — Laboratorio Ambiental</span>
                <span className="chip">EMA — Acreditación</span>
                <span className="chip">NMX-17025</span>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="col-md-7">
            <div className="reveal">
              <h2 className="fw-bold text-primary mb-2">Acerca de Nosotros</h2>
              <div className="accent-divider mb-3" aria-hidden="true"></div>

              <p className="text-justify lead mb-3">
                <strong>INGENIERÍA Y ADMINISTRACIÓN ESTRATÉGICA, S.A. DE C.V. (INADE LAB)</strong> es una empresa de
                servicios de ingeniería ambiental con sede en Tijuana, operando proyectos en la República Mexicana.
              </p>
              <p className="text-justify mb-3">
                Nos enfocamos en proyectos ambientales e ingenieriles, cumpliendo con los requerimientos de nuestros
                clientes para formar parte de su cadena productiva. INADE está registrado como Laboratorio Ambiental
                aprobado por la Secretaría de Protección al Ambiente del Estado de Baja California (SPA).
              </p>
              <p className="text-justify mb-4">
                Contamos con registros como peritos en monitoreo y mantenemos la calidad bajo los requisitos de la
                <strong> NMX-17025</strong>, acreditados por la Entidad Mexicana de Acreditación, A.C.
              </p>

              {/* bullets de valor */}
              <ul className="about-bullets mb-4">
                <li>
                  <span className="ico" aria-hidden="true">✔</span>
                  Cumplimiento normativo y trazabilidad de resultados.
                </li>
                <li>
                  <span className="ico" aria-hidden="true">✔</span>
                  Enfoque en calidad bajo estándares reconocidos.
                </li>
                <li>
                  <span className="ico" aria-hidden="true">✔</span>
                  Atención ágil y coordinación con la operación del cliente.
                </li>
              </ul>

              {/* CTAs */}
              <div className="d-flex flex-wrap gap-2">
                <a href="#Contacto" className="btn btn-primary btn-lg rounded-pill">
                  Contáctanos
                </a>
                <a href="#Acreditaciones" className="btn btn-outline-primary rounded-pill">
                  Ver acreditaciones
                </a>
              </div>

              <p className="fw-semibold text-success mt-4 mb-0">
                ¡Comunícate con nosotros!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcercaNosotros;

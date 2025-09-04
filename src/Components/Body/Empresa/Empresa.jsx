import React, { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./empresa.css";

const SEDES = ["Tijuana", "Mexicali", "Monterrey", "Veracruz", "Los Cabos"];

// Ajusta estos números a tu realidad
const METRICAS = [
  { id: "anios", label: "Años de experiencia", value: 8 },
  { id: "sedes", label: "Sedes en México", value: 5 },
  { id: "proyectos", label: "Proyectos ejecutados", value: 400 },
  { id: "muestras", label: "Muestreos / año", value: 600 },
];

function useReveal() {
  const rootRef = useRef(null);
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll(".reveal") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
      { threshold: 0.16 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return rootRef;
}

function Counter({ to = 0, duration = 1200, start = false }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, startTs;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);
  return <>{val.toLocaleString("es-MX")}</>;
}

export default function Empresa() {
  const ref = useReveal();
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  // Observa la sección de métricas para disparar los contadores
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setStatsInView(e.isIntersecting),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sedesChips = useMemo(
    () =>
      SEDES.map((s) => (
        <span key={s} className="badge rounded-pill text-bg-light border chip">
          {s}
        </span>
      )),
    []
  );

  return (
    <section className="empresa-sec py-5" ref={ref}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-4 reveal">
          <h2 className="fw-bold text-primary m-0">Bienvenidos a INADE</h2>
          <div className="divider-anim mx-auto my-3" aria-hidden="true" />
          <p className="lead text-muted m-0">Ingeniería y Administración Estratégica</p>
        </div>

        {/* Card principal */}
        <div className="row justify-content-center">
          <div className="col-lg-10 reveal">
            <div className="card glass border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <p className="card-text">
                  El mercado actual exige empresas de alta calidad, orientadas al trabajo colaborativo para alcanzar
                  resultados óptimos. En <strong>INADE</strong>, respondemos mediante un sistema de gestión de calidad
                  basado en la norma <strong>NMX-EC-17025-IMNC-2018</strong>.
                </p>
                <p className="card-text">
                  Con presencia en <strong>Tijuana, Mexicali, Monterrey, Veracruz</strong> y{" "}
                  <strong>Los Cabos</strong>, conformamos equipos en conjunto con nuestros clientes para lograr
                  objetivos comunes con excelencia operativa.
                </p>

                {/* Sedes */}
                <div className="d-flex flex-wrap gap-2 my-3">{sedesChips}</div>

                {/* Bullets de valor */}
                <ul className="list-unstyled about-bullets my-4">
                  <li>
                    <span className="ico">✔</span>
                    Enfoque en calidad y trazabilidad bajo estándares reconocidos.
                  </li>
                  <li>
                    <span className="ico">✔</span>
                    Atención ágil, coordinación y comunicación continua con el cliente.
                  </li>
                  <li>
                    <span className="ico">✔</span>
                    Soluciones integrales en laboratorio ambiental, fuentes fijas y seguridad laboral.
                  </li>
                </ul>

                {/* Métricas */}
                <div className="row g-3 mt-2" ref={statsRef}>
                  {METRICAS.map((m) => (
                    <div className="col-6 col-md-3" key={m.id}>
                      <div className="stat-card rounded-4 text-center p-3">
                        <div className="display-6 fw-bold text-primary">
                          <Counter to={m.value} start={statsInView} />+
                        </div>
                        <div className="small text-muted">{m.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <a href="#Ingeniería" className="btn btn-primary btn-lg rounded-pill">
                    Ver servicios
                  </a>
                  <a href="#Contacto" className="btn btn-outline-primary rounded-pill">
                    Contáctanos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </section>
  );
}

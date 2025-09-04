import React, { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ourteam.css";

const VACANTES = [
  {
    id: "qa",
    titulo: "Ingeniero de Calidad",
    area: "Calidad",
    modalidad: "Tiempo completo",
    ubicacion: "Tijuana, BC",
    img: "/Cakidad.jpeg",
    resumen:
      "Participa en mejora continua y aseguramiento de calidad. Elaboración de reportes y control de estándares.",
    requisitos: [
      "Ing. Industrial/Calidad o afín",
      "Conocimiento en ISO 9001",
      "Manejo de indicadores (KPIs)",
    ],
  },
  {//Muestreo.jpeg
    id: "muestreo",
    titulo: "Muestreo",
    area: "Laboratorio",
    modalidad: "Turnos",
    ubicacion: "Campo / Sitio",
    img: "/aguasMuestras.jpeg",
    resumen:
      "Apoyo en monitoreo ambiental y seguridad. Recolección de muestras y bitácoras.",
    requisitos: ["Licencia de conducir", "Disponibilidad de horario", "Trabajo en campo"],
  },
  {
    id: "admin",
    titulo: "Administración",
    area: "Administración",
    modalidad: "Híbrido",
    ubicacion: "Tijuana, BC",
    img: "/Licenciatura-en-Administración-de-Recursos-Humanos.jpg",
    resumen:
      "Gestión documental, coordinación con clientes, control de presupuestos y soporte a proyectos internos.",
    requisitos: ["Excel intermedio", "Gestión de clientes", "Comunicación efectiva"],
  },
];

export default function OurTeam() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Todas");
  const [active, setActive] = useState(null);
  const contRef = useRef(null);

  // Animación on-scroll
  useEffect(() => {
    const els = contRef.current?.querySelectorAll(".reveal") ?? [];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
      { threshold: 0.16 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const areas = useMemo(
    () => ["Todas", ...Array.from(new Set(VACANTES.map((v) => v.area)))],
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VACANTES.filter((v) => {
      const okArea = area === "Todas" || v.area === area;
      const okQ =
        !q ||
        v.titulo.toLowerCase().includes(q) ||
        v.resumen.toLowerCase().includes(q) ||
        v.requisitos.some((r) => r.toLowerCase().includes(q));
      return okArea && okQ;
    });
  }, [query, area]);

  const mailto = (v) => {
    const subject = encodeURIComponent(`Postulación - ${v.titulo}`);
    const body = encodeURIComponent(
      `Hola INADE,\n\nMe interesa la vacante "${v.titulo}" (${v.area}).\nAdjunto mi CV.\n\nSaludos,`
    );
    return `mailto:hlarreta@me.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="container my-5" ref={contRef}>
      {/* Header */}
      <div className="text-center mb-5 reveal">
        <h1 className="fw-bold">NUESTRO EQUIPO</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: 820 }}>
          En Ingeniería y Administración Estratégica conformamos un equipo para atender sus necesidades
          de seguridad e higiene, medio ambiente, gestión y cumplimiento normativo.
        </p>
      </div>

      {/* Oportunidades + filtros */}
      <div className="mb-4 reveal">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center justify-content-between">
          <div>
            <h2 className="fw-bold text-success m-0">OPORTUNIDADES DE EMPLEO</h2>
            <small className="text-muted">Aplica filtros o busca por palabra clave.</small>
          </div>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Buscar (p. ej. ISO, Excel, campo)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="form-select"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              aria-label="Filtrar por área"
            >
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {results.map((v, i) => (
          <div className="col reveal" style={{ transitionDelay: `${i * 70}ms` }} key={v.id}>
            <article className="card h-100 shadow-sm border-0 card-lift">
              <div className="ratio ratio-4x3 overflow-hidden">
                <img src={v.img} alt={v.titulo} className="w-100 h-100 object-cover" loading="lazy" />
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                  <h5 className="card-title text-primary fw-bold m-0">{v.titulo}</h5>
                  <span className="badge text-bg-light border">{v.area}</span>
                </div>
                <p className="card-text">{v.resumen}</p>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className="badge rounded-pill text-bg-primary-subtle border">{v.modalidad}</span>
                  <span className="badge rounded-pill text-bg-success-subtle border">{v.ubicacion}</span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary" onClick={() => setActive(v)}>
                    Ver detalles
                  </button>
                  <a className="btn btn-primary" href={mailto(v)}>
                    Postular
                  </a>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Mensaje final */}
      <div className="mt-5 reveal">
        <p className="mb-1">
          Si estas oportunidades coinciden con tu perfil, ¡postúlate! También puedes escribirnos a{" "}
          <strong>oficina@inade.mx</strong> o <strong>inade@inade.mx</strong>.
        </p>
      </div>

      {/* Modal simple (sin librería extra) */}
      {active && (
        <div className="ot-modal" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div
            className="ot-modal-card shadow-lg rounded-4 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="btn btn-sm btn-light position-absolute end-0 m-2" onClick={() => setActive(null)}>
              ✕
            </button>
            <div className="row g-0">
              <div className="col-md-5 p-3">
                <img src={active.img} alt={active.titulo} className="w-100 rounded-3" />
              </div>
              <div className="col-md-7 p-4">
                <h4 className="fw-bold">{active.titulo}</h4>
                <div className="d-flex gap-2 flex-wrap mb-2">
                  <span className="badge text-bg-light border">{active.area}</span>
                  <span className="badge rounded-pill text-bg-primary-subtle border">{active.modalidad}</span>
                  <span className="badge rounded-pill text-bg-success-subtle border">{active.ubicacion}</span>
                </div>
                <p className="text-muted">{active.resumen}</p>
                <h6 className="fw-bold">Requisitos</h6>
                <ul className="small">
                  {active.requisitos.map((r) => <li key={r}>{r}</li>)}
                </ul>
                <div className="d-flex gap-2 mt-3">
                  <a className="btn btn-primary" href={mailto(active)}>Postular por correo</a>
                  <button className="btn btn-outline-secondary" onClick={() => setActive(null)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

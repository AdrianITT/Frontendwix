import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./acreditaciones.css";

const CARDS = [
  { title: "AMBIENTE LABORAL", src: "/amb-lab_med.png", alt: "Ambiente Laboral" },
  { title: "AGUA", src: "/aguas-inade_med-2.jpeg", alt: "Agua" },
  { title: "FUENTES FIJAS", src: "/fuentes-fijas-inade_med-2.jpeg", alt: "Fuentes Fijas" },
];

export default function Acreditaciones() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const els = sectionRef.current?.querySelectorAll(".reveal") || [];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e, idx) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotX = ((y - midY) / midY) * -6; // rango aprox -6° a 6°
    const rotY = ((x - midX) / midX) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    card.style.transition = "transform 60ms linear";
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    card.style.transition = "transform 300ms ease";
  };

  const openModal = (i) => setActiveIndex(i);
  const closeModal = () => setActiveIndex(null);
  const prev = () => setActiveIndex((i) => (i === 0 ? CARDS.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === CARDS.length - 1 ? 0 : i + 1));

  return (
    <section ref={sectionRef} className="acred-sec py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-2 reveal">ACREDITACIONES</h2>
        <div className="divider-anim reveal mx-auto mb-4" aria-hidden="true" />
        <p className="mx-auto lead reveal" style={{ maxWidth: 820 }}>
          INADE cuenta con registro como Laboratorio Ambiental aprobado por la Secretaría de Protección al Ambiente del
          Estado de Baja California (SPA), con registros como Peritos en Monitoreo y recientemente acreditados por la
          Entidad Mexicana de Acreditación, A.C. en las ramas de:
        </p>

        <div className="row mt-5 g-4">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              className="col-12 col-md-4 d-flex reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <article
                className="card-tilt shadow-sm rounded-4 overflow-hidden w-100"
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-3">
                  <h5 className="mb-3">{card.title}</h5>
                </div>

                <div
                  className="position-relative overflow-hidden"
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(i)}
                  onKeyDown={(e) => (e.key === "Enter" ? openModal(i) : null)}
                  aria-label={`Ver imagen de ${card.title}`}
                >
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="img-fluid w-100"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="img-overlay d-flex align-items-center justify-content-center">
                    <span className="btn btn-light px-3 py-2 rounded-pill">Ver</span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Lightbox simple sin librerías */}
      {activeIndex !== null && (
        <div
          className="lightbox d-flex align-items-center justify-content-center"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          onClick={closeModal}
        >
          <button className="lb-close btn btn-light position-absolute top-0 end-0 m-3" onClick={closeModal}>
            ✕
          </button>
          <button className="lb-nav lb-prev btn btn-light" onClick={(e) => { e.stopPropagation(); prev(); }}>
            ‹
          </button>
          <img
            src={CARDS[activeIndex].src}
            alt={CARDS[activeIndex].alt}
            className="lb-img shadow-lg rounded-4"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lb-nav lb-next btn btn-light" onClick={(e) => { e.stopPropagation(); next(); }}>
            ›
          </button>
          <div className="lb-caption text-white mt-3 text-center">
            <strong>{CARDS[activeIndex].title}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

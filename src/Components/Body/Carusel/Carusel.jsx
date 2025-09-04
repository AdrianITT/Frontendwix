import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "bootstrap/js/dist/carousel";
import "./carousel.css";

export default function Carusel() {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const instance = new Carousel(ref.current, {
      interval: prefersReduced ? false : 2000,
      ride: prefersReduced ? false : "carousel",
      pause: prefersReduced ? true : "hover",
      touch: true,
      wrap: true,
      keyboard: true,
    });
    const onVis = () => (document.hidden ? instance.pause() : instance.cycle());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      instance.dispose();
    };
  }, []);

  return (
    // Si tu carrusel está dentro de un .container, esta clase hace que “rompa” a 100vw
    <section aria-label="Carrusel principal" className="full-bleed">
      <div
        id="heroCarousel"
        ref={ref}
        className="carousel slide carousel-fade hero-carousel"
        data-bs-touch="true"
        aria-roledescription="carousel"
      >
        {/* Indicadores */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-label="Slide 1" />
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2" />
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3" />
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          {/* SLIDE 1 */}
          <div className="carousel-item active">
            <div className="hero-mask" />
            <img
              src="/slide1-inade.jpg"
              className="d-block w-100 hero-img"
              alt="Profesionales de laboratorio manipulando muestras"
              loading="eager"
              decoding="async"
            />
            {/* Centro absoluto con CTA */}
            <div className="hero-center text-center text-white">
              <h1 className="fw-bold mb-2">Ingeniería Ambiental</h1>
              <p className="mb-3">Soluciones confiables y trazables.</p>
              <a href="#Empresa" className="btn btn-primary btn-lg">Conocer la empresa</a>
            </div>
          </div>

          {/* SLIDE 2 */}
          <div className="carousel-item">
            <div className="hero-mask" />
            <img
              src="/logoIa.png"
              className="d-block w-100 hero-img"
              alt="Logotipo INADE y equipo especializado"
              loading="lazy"
              decoding="async"
            />
            <div className="hero-center text-center text-white">
              <h1 className="fw-bold mb-2">Compromiso con la calidad</h1>
              <p className="mb-3">NMX-17025 • EMA • SPA</p>
              <a href="#Empresa" className="btn btn-primary btn-lg">Conocer la empresa</a>
            </div>
          </div>

          {/* SLIDE 3 */}
          <div className="carousel-item">
            <div className="hero-mask" />
            <img
              src="/inadeMuestreo_1.png"
              className="d-block w-100 hero-img"
              alt="Logotipo INADE y equipo de muestreo"
              loading="lazy"
              decoding="async"
            />
            <div className="hero-center text-center text-white">
              <h1 className="fw-bold mb-2">Compromiso con la calidad</h1>
              <p className="mb-3">NMX-17025 • EMA • SPA</p>
              <a href="#Empresa" className="btn btn-primary btn-lg">Conocer la empresa</a>
            </div>
          </div>
        </div>

        {/* Controles inadeMuestreo.png*/}
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon control-icon" aria-hidden="true" />
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon control-icon" aria-hidden="true" />
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </section>
  );
}

import React from "react";


const IngenieriaAmbiental = () => {
  const servicios = [
    "Manifestación de impacto ambiental",
    "Informe preventivo",
    "Estudios de riesgo",
    "Programa de prevención de accidentes",
    "Cédula de operación anual",
    "Permisos de descarga de aguas residuales",
    "Inscripción/Revalidación del Programa Atrapa la Grasa",
    "Permisos de emisiones a la atmósfera",
    "Plan de manejo de RME",
    "Inscripción como generador RME",
    "Reporte anual como generador RME",
    "Actualización de registro de generador RME",
    "Actualización al plan de manejo de RME",
  ];

  const imagenesCarrusel = [
  "/IMG_0639.png",
  "/IMG_0386.png"
];

  return (
    <div className="my-5">
      <div className="row align-items-center shadow rounded-4 overflow-hidden bg-white">
        {/* Columna de imagen */}
        <div className="col-md-6 p-0">
         <div id="carruselAmbiental" className="carousel slide carousel-fade h-100" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-inner h-100">
              {imagenesCarrusel.map((src, index) => (
                <div
                  className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="d-block w-100 h-100 object-fit-cover"
                    style={{ minHeight: "300px", maxHeight: "100%" }}
                  />
                </div>
              ))}
            </div>

              {/* Botones de control opcionales */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carruselAmbiental"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carruselAmbiental"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Siguiente</span>
              </button>
          </div>
          </div>
        {/* <div className="col-md-6 p-0">
          <img
            src="/IMG_0639.png"
            alt="Ingeniería Ambiental"
            className="img-fluid w-100 h-100 object-fit-cover"
            style={{ maxHeight: "100%", minHeight: "300px" }}
          />
        </div> */}

        {/* Columna de contenido */}
        <div className="col-md-6 p-4">
          <h2 className="text-success fw-bold mb-4 text-center text-md-start">
            GESTION AMBIENTAL
          </h2>

          <h5 className="fw-semibold text-primary mb-3">
            <i className="bi bi-gear-wide-connected me-2"></i>
            Servicios ofrecidos
          </h5>

          <ul className="list-group list-group-flush">
            {servicios.map((servicio, index) => (
              <li
                key={index}
                className="list-group-item border-0 ps-0 d-flex align-items-start gap-2"
              >
                <i className="bi bi-check-circle-fill text-success mt-1"></i>
                <span>{servicio}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IngenieriaAmbiental;

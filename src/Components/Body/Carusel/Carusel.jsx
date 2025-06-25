import React from "react";

const Carusel = () => {
  return (
    <div
      id="carouselExampleInterval"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{ maxHeight: "450px", overflow: "hidden" }}
    >
      <div className="carousel-inner" style={{ height: "450px" }}>
        <div className="carousel-item active" data-bs-interval="2000">
          <img
            src="/slide1-inade.jpg"
            className="d-block w-100"
            alt="INGENIEROS"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <img
            src="/gotaInade.png"
            className="d-block w-100"
            alt="EQUIPO"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>
        {/* <div className="carousel-item" data-bs-interval="2000">
          <img
            src="/team.png"
            className="d-block w-100"
            alt="TRABAJO"
            style={{ objectFit: "cover", height: "100%",objectPosition: "center"  }}
          />
        </div> */}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleInterval"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleInterval"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carusel;

import React, { useMemo, useState } from "react";

// ✅ PON AQUÍ TU CORREO EMPRESARIAL (destino)
const TO_EMAIL = "calidad@inade.mx";

// ✅ Opcional: URL a donde mandar después de enviar (página de gracias)
const NEXT_URL = ""; // ej: "https://tusitio.com/gracias"

const initial = {
  tipo: "Queja",
  nombre: "",
  correo: "",
  telefono: "",
  mensaje: "",
  website: "", // honeypot
};

export default function Feedback() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const canSend = useMemo(() => {
    const ok =
      form.tipo &&
      form.nombre.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo) &&
      form.mensaje.trim().length >= 10 &&
      !form.website; // honeypot vacío
    return ok;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!canSend) {
      setStatus({
        type: "error",
        msg: "Revisa los campos: correo válido y mensaje mínimo de 10 caracteres.",
      });
      return;
    }

    // ✅ Anti-bots (si llenan el honeypot, no enviamos)
    if (form.website) return;

    setLoading(true);

    try {
      // Enviar a FormSubmit (POST)
      const url = `https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`;

      const payload = new FormData();
      // ✅ campos del usuario
      payload.append("tipo", form.tipo);
      payload.append("nombre", form.nombre);
      payload.append("correo", form.correo);
      payload.append("telefono", form.telefono || "N/A");
      payload.append("mensaje", form.mensaje);

      // ✅ Asunto = tipo
      payload.append("_subject", form.tipo);

      // ✅ Opcionales útiles
      payload.append("_captcha", "false"); // quita captcha (puedes poner "true" si quieres)
      if (NEXT_URL) payload.append("_next", NEXT_URL);

      // Puedes forzar “reply-to” en algunos handlers:
      payload.append("_replyto", form.correo);

      const res = await fetch(url, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();

      if (data?.success) {
        setStatus({ type: "success", msg: "¡Listo! Tu mensaje fue enviado correctamente." });
        setForm(initial);
      } else {
        setStatus({
          type: "error",
          msg: "No se pudo enviar el mensaje. Verifica el correo destino y vuelve a intentar.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        msg: "No se pudo enviar el mensaje. Intenta de nuevo en unos minutos.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-1">Quejas, Felicitación o Sugerencias</h3>
              <p className="text-muted mb-4">
                Selecciona el tipo y envíanos tu mensaje. Te responderemos al correo proporcionado.
              </p>

              {status.msg ? (
                <div
                  className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`}
                  role="alert"
                >
                  {status.msg}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                {/* Honeypot oculto */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="mb-3">
                  <label className="form-label">Tipo</label>
                  <select
                    className="form-select"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="Queja">Queja</option>
                    <option value="Felicitación">Felicitación</option>
                    <option value="Sugerencia">Sugerencia</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-control"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    disabled={loading}
                    required
                    minLength={2}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    className="form-control"
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="[email protected]"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Teléfono (opcional)</label>
                  <input
                    className="form-control"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="664..."
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea
                    className="form-control"
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Escribe tu mensaje (mínimo 10 caracteres)"
                    disabled={loading}
                    required
                    minLength={10}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !canSend}
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>

                {/* <small className="d-block text-muted mt-3">
                  * El asunto del correo se enviará como: <b>{form.tipo}</b>
                </small>

                <small className="d-block text-muted mt-1">
                  * La primera vez, FormSubmit te pedirá confirmar el correo destino.
                </small> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

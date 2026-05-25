import StickyHeader from "@/app/components/StickyHeader";
import styles from "@/app/legal.module.css";

export const metadata = {
  title: "Política de Cookies — Cruz Blanca",
  description: "Política de cookies del Restaurante Cruz Blanca, Lucena (Córdoba).",
};

export default function PoliticaCookiesPage() {
  return (
    <>
      <StickyHeader />
      <main className={styles.page}>
        <div className={styles.inner}>

          <span className={styles.eyebrow}>› Navegación y rastreo</span>
          <h1 className={styles.title}>Política de Cookies</h1>
          <div className={styles.divider} />
          <p className={styles.updated}>Última actualización: mayo de 2025</p>

          <div className={styles.body}>

            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños ficheros de texto que se almacenan en el dispositivo del
              usuario cuando visita un sitio web. Permiten recordar preferencias, analizar el
              comportamiento de navegación y personalizar la experiencia.
            </p>

            <h2>2. Cookies utilizadas en este sitio</h2>
            <p>
              Actualmente este sitio web utiliza únicamente cookies <strong>técnicas y
              estrictamente necesarias</strong> para el correcto funcionamiento de la página
              (sesión, preferencias de idioma, seguridad del formulario). No se utilizan cookies
              de publicidad ni de rastreo de terceros.
            </p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.8rem", fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-text)" }}>Nombre</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.8rem", fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-text)" }}>Tipo</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.8rem", fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-text)" }}>Duración</th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.8rem", fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-text)" }}>Finalidad</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", fontFamily: "var(--font-body)", color: "var(--color-text-mid)" }}>_session</td>
                  <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", fontFamily: "var(--font-body)", color: "var(--color-text-mid)" }}>Técnica</td>
                  <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", fontFamily: "var(--font-body)", color: "var(--color-text-mid)" }}>Sesión</td>
                  <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", fontFamily: "var(--font-body)", color: "var(--color-text-mid)" }}>Gestión de sesión de usuario</td>
                </tr>
              </tbody>
            </table>

            <h2>3. Cómo gestionar las cookies</h2>
            <p>
              El usuario puede configurar su navegador para bloquear o eliminar las cookies. A
              continuación se enlazan las instrucciones de los navegadores más habituales:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
            <p>
              Tenga en cuenta que deshabilitar ciertas cookies puede afectar al correcto
              funcionamiento del sitio web.
            </p>

            <h2>4. Actualización de esta política</h2>
            <p>
              Restaurante Cruz Blanca se reserva el derecho a modificar esta Política de Cookies en
              cualquier momento para adaptarla a cambios legislativos o técnicos. Se recomienda
              revisarla periódicamente.
            </p>

          </div>

          <a href="/" className={styles.back}>← Volver al inicio</a>

        </div>
      </main>
    </>
  );
}

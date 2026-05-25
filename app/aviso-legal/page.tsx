import StickyHeader from "@/app/components/StickyHeader";
import styles from "@/app/legal.module.css";

export const metadata = {
  title: "Aviso Legal — Cruz Blanca",
  description: "Aviso legal del Restaurante Cruz Blanca, Lucena (Córdoba).",
};

export default function AvisoLegalPage() {
  return (
    <>
      <StickyHeader />
      <main className={styles.page}>
        <div className={styles.inner}>

          <span className={styles.eyebrow}>› Información legal</span>
          <h1 className={styles.title}>Aviso Legal</h1>
          <div className={styles.divider} />
          <p className={styles.updated}>Última actualización: mayo de 2025</p>

          <div className={styles.body}>

            <h2>1. Datos identificativos</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
              Sociedad de la Información y Comercio Electrónico (LSSICE), se facilitan los datos del
              titular del sitio web:
            </p>
            <ul>
              <li><strong>Denominación social:</strong> Restaurante Cruz Blanca</li>
              <li><strong>Domicilio:</strong> C. San Francisco, 85, 14900 Lucena, Córdoba</li>
              <li><strong>Teléfono:</strong> 957 05 24 29 / 628 59 25 52</li>
              <li><strong>Correo electrónico:</strong> info@cruzblancalucena.es</li>
            </ul>

            <h2>2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso y el uso del sitio web{" "}
              <strong>cruzblancalucena.es</strong> (en adelante, «el Sitio»), así como los servicios
              de información puestos a disposición de los usuarios. El acceso y la utilización del
              Sitio implica la aceptación expresa y sin reservas de todas las condiciones aquí
              recogidas.
            </p>

            <h2>3. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del Sitio —textos, fotografías, logotipos, diseño gráfico, código
              fuente y demás elementos— son propiedad de Restaurante Cruz Blanca o de sus respectivos
              titulares, y están protegidos por la normativa española e internacional de propiedad
              intelectual e industrial.
            </p>
            <p>
              Queda expresamente prohibida su reproducción, distribución, comunicación pública o
              transformación sin la autorización previa y escrita del titular.
            </p>

            <h2>4. Exclusión de garantías y responsabilidad</h2>
            <p>
              Restaurante Cruz Blanca no garantiza la disponibilidad, continuidad ni infalibilidad
              del Sitio, y no se responsabiliza de los daños o perjuicios causados por la
              indisponibilidad, errores o falta de utilidad de los contenidos.
            </p>
            <p>
              Los precios y platos mostrados en este sitio web son meramente informativos y pueden
              variar sin previo aviso.
            </p>

            <h2>5. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para la resolución de
              cualquier controversia, las partes se someten a los Juzgados y Tribunales de Lucena
              (Córdoba), con renuncia a cualquier otro fuero que pudiera corresponderles.
            </p>

          </div>

          <a href="/" className={styles.back}>← Volver al inicio</a>

        </div>
      </main>
    </>
  );
}

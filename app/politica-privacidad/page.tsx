import StickyHeader from "@/app/components/StickyHeader";
import styles from "@/app/legal.module.css";

export const metadata = {
  title: "Política de Privacidad — Cruz Blanca",
  description: "Política de privacidad del Restaurante Cruz Blanca, Lucena (Córdoba).",
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <StickyHeader />
      <main className={styles.page}>
        <div className={styles.inner}>

          <span className={styles.eyebrow}>› Protección de datos</span>
          <h1 className={styles.title}>Política de Privacidad</h1>
          <div className={styles.divider} />
          <p className={styles.updated}>Última actualización: mayo de 2025</p>

          <div className={styles.body}>

            <h2>1. Responsable del tratamiento</h2>
            <ul>
              <li><strong>Denominación:</strong> Restaurante Cruz Blanca</li>
              <li><strong>Dirección:</strong> C. San Francisco, 85, 14900 Lucena, Córdoba</li>
              <li><strong>Contacto:</strong> info@cruzblancalucena.es</li>
            </ul>

            <h2>2. Datos que recabamos</h2>
            <p>
              Únicamente tratamos los datos personales que el usuario nos facilita voluntariamente a
              través del formulario de reservas o por contacto directo (correo electrónico o
              teléfono):
            </p>
            <ul>
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Preferencias o solicitudes especiales para la reserva</li>
            </ul>

            <h2>3. Finalidad y base legal del tratamiento</h2>
            <p>
              Los datos se tratan exclusivamente para gestionar las reservas de mesa y atender las
              consultas recibidas. La base jurídica es la ejecución del contrato (reserva) y el
              interés legítimo para la comunicación comercial puntual. No se tomarán decisiones
              automatizadas ni se elaborarán perfiles.
            </p>

            <h2>4. Conservación de los datos</h2>
            <p>
              Los datos se conservarán durante el tiempo necesario para gestionar la reserva y, como
              máximo, durante los plazos legalmente exigidos por la normativa fiscal y mercantil
              aplicable.
            </p>

            <h2>5. Cesión de datos a terceros</h2>
            <p>
              No cedemos datos personales a terceros, salvo obligación legal. Los datos no serán
              transferidos a países fuera del Espacio Económico Europeo.
            </p>

            <h2>6. Derechos del interesado</h2>
            <p>
              El usuario puede ejercer en cualquier momento sus derechos de acceso, rectificación,
              supresión, oposición, limitación del tratamiento y portabilidad, escribiendo a{" "}
              <a href="mailto:info@cruzblancalucena.es">info@cruzblancalucena.es</a>. También tiene
              derecho a presentar una reclamación ante la{" "}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                Agencia Española de Protección de Datos (AEPD)
              </a>
              .
            </p>

            <h2>7. Seguridad</h2>
            <p>
              Aplicamos las medidas técnicas y organizativas adecuadas para proteger los datos
              personales contra pérdidas, accesos no autorizados o divulgaciones indebidas, conforme
              al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
            </p>

          </div>

          <a href="/" className={styles.back}>← Volver al inicio</a>

        </div>
      </main>
    </>
  );
}

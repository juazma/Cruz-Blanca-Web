import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contacto" aria-label="Pie de página">
      <div className={styles.inner}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Cruz Blanca" className={styles.logo} width={220} height={22} />
        </div>

        {/* Info columns */}
        <div className={styles.cols}>

          <div className={styles.col}>
            <span className={styles.label}>Dirección</span>
            <p>C. San Francisco, 85</p>
            <p>14900 Lucena, Córdoba</p>
          </div>

          <div className={styles.col}>
            <span className={styles.label}>Horario</span>
            <p>Lunes – Domingo</p>
            <p>13:00 – 16:30</p>
            <p>20:00 – 23:30</p>
          </div>

          <div className={styles.col}>
            <span className={styles.label}>Contacto</span>
            <a href="tel:+34957052429" className={styles.contactLink}>957 05 24 29</a>
            <a href="tel:+34628592552" className={styles.contactLink}>628 59 25 52</a>
            <a
              href="https://maps.google.com/?q=C.+San+Francisco+85+Lucena+Córdoba"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              Ver en Google Maps →
            </a>
          </div>

        </div>

      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Cruz Blanca · Lucena, Córdoba</span>
      </div>
    </footer>
  );
}

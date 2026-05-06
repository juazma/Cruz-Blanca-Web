"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import styles from "./MapSection.module.css";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function MapSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className={styles.section} id="contacto" aria-label="Ubicación y contacto" ref={ref}>

      <div className={styles.mapWrap}>
        <iframe
          className={styles.map}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3138.0!2d-4.4862!3d37.3889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6c9e7c5e7b1fa7%3A0x5a3d4e6a7b8c9d0e!2sC.%20San%20Francisco%2C%2085%2C%2014900%20Lucena%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Cruz Blanca"
        />

        {/* CARD — overlaid on map */}
        <motion.div
          className={styles.card}
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className={styles.cardBody}>

            <div className={styles.block}>
              <p className={styles.label}>Dirección</p>
              <p className={styles.value}>C. San Francisco, 85</p>
              <p className={styles.value}>14900 Lucena, Córdoba</p>
            </div>

            <div className={styles.block}>
              <p className={styles.label}>Teléfono</p>
              <a href="tel:+34957052429" className={styles.link}>957 05 24 29</a>
              <a href="tel:+34628592552" className={styles.link}>628 59 25 52</a>
            </div>

            <div className={styles.block}>
              <p className={styles.label}>Horario</p>
              <p className={styles.value}>Lun – Dom</p>
              <p className={styles.value}>13:00 – 16:30 · 20:00 – 23:30</p>
            </div>

          </div>

          <a href="/reservar" className={styles.cta}>
            › Reservar mesa
          </a>
        </motion.div>
      </div>

    </section>
  );
}

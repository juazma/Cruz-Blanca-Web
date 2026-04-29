"use client";

import { useRef, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import styles from "./SobreSection.module.css";

// ── TEXT TO ANIMATE ────────────────────────────────────────────────────────

const WORDS =
  "Restaurante Cruz Blanca en el corazón de Lucena. Una casa donde la cocina andaluza se sirve con producto de la tierra y recetas honestas. Te esperamos en la calle San Francisco 85 para comer, cenar o simplemente tomar algo."
    .split(" ");

// ── WORD SUBCOMPONENT — memoized to avoid re-renders ──────────────────────

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}

const Word = memo(function Word({ word, progress, start, end }: WordProps) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);

  return (
    <motion.span className={styles.word} style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
});

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function SobreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Animation will finish super fast (in the first 35% of the scroll)
  const LEAD  = 0.05;
  const RANGE = 0.35;

  return (
    // Outer div — tall, gives scroll room
    <div ref={sectionRef} className={styles.scrollTrack}>

      {/* Inner div — sticky viewport panel */}
      <div className={styles.sticky}>
        <div className={styles.inner}>

          {/* Eyebrow — static, always visible */}
          <span className={styles.eyebrow}>› Sobre el restaurante</span>

          {/* Animated editorial paragraph */}
          <p className={styles.editorial} aria-label={WORDS.join(" ")}>
            {WORDS.map((word, i) => {
              const total = WORDS.length;
              // Each word animates over its own window of scrollYProgress
              const start = LEAD + (i / total) * RANGE;
              const end   = LEAD + ((i + 1) / total) * RANGE;
              return (
                <Word
                  key={i}
                  word={word}
                  progress={scrollYProgress}
                  start={start}
                  end={end}
                />
              );
            })}
          </p>

          {/* Contact grid — static, always visible */}
          <div className={styles.grid}>
            <div className={styles.col}>
              <span className={styles.label}>Dirección</span>
              <p>C. San Francisco, 85</p>
              <p>14900 Lucena, Córdoba</p>
            </div>
            <div className={styles.col}>
              <span className={styles.label}>Teléfono</span>
              <a href="tel:+34957052429" className={styles.colLink}>957 05 24 29</a>
              <a href="tel:+34628592552" className={styles.colLink}>628 59 25 52</a>
            </div>
            <div className={styles.col}>
              <span className={styles.label}>Horario</span>
              <p>Lun – Dom</p>
              <p>13:00 – 16:30 · 20:00 – 23:30</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

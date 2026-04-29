"use client";

import { motion } from "framer-motion";
import styles from "./LoadingScreen.module.css";

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  return (
    <motion.div
      className={styles.overlay}
      exit={{
        opacity: 0,
        transition: { duration: 0.55, delay: 0.25, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      <div className={styles.center}>
        {/* Logo with layoutId — will animate to hero position on exit */}
        <motion.img
          layoutId="main-logo"
          src="/logo-cream.svg"
          alt="Cruz Blanca"
          className={styles.logo}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        />

        {/* Progress bar */}
        <div className={styles.barTrack} aria-hidden="true">
          <div
            className={styles.barFill}
            onAnimationEnd={onComplete}
          />
        </div>
      </div>
    </motion.div>
  );
}

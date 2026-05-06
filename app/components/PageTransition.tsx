"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./PageTransition.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.75;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>

        {/* ── CURTAIN IN — grows from right, covers screen ── */}
        <motion.div
          className={styles.curtain}
          style={{ transformOrigin: "right" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 1 }}
          transition={{ duration: DURATION, ease: EASE }}
          aria-hidden="true"
        />

        {/* ── CURTAIN OUT — shrinks to left, reveals new page ── */}
        <motion.div
          className={styles.curtain}
          style={{ transformOrigin: "left" }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: DURATION, ease: EASE }}
          aria-hidden="true"
        />

        {children}

      </motion.div>
    </AnimatePresence>
  );
}

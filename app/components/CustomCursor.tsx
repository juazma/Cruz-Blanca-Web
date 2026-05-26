"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const [isClicked,  setIsClicked]  = useState(false);
  const [isVisible,  setIsVisible]  = useState(false);
  // null = aún no sabemos (SSR), true = táctil → no renderizar, false = ratón → renderizar
  const [isTouch,    setIsTouch]    = useState<boolean | null>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const y = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Detectar dispositivo táctil / sin puntero fino en el cliente
    const mq = window.matchMedia("(pointer: fine)");
    setIsTouch(!mq.matches);

    // Actualizar si el usuario conecta/desconecta un ratón
    const onChange = (e: MediaQueryListEvent) => setIsTouch(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // No registrar eventos si es táctil
    if (isTouch) return;

    const onMove  = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    const onDown  = () => setIsClicked(true);
    const onUp    = () => setIsClicked(false);
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [isTouch, mouseX, mouseY, isVisible]);

  // No renderizar nada hasta saber el tipo de puntero, ni en táctil
  if (isTouch !== false) return null;

  return (
    <motion.div
      className={styles.cursor}
      style={{ x, y }}
      animate={{
        scale:           isClicked ? 0.5 : 1,
        backgroundColor: isClicked ? "#a87550" : "#1c1009",
        opacity:         isVisible ? 1 : 0,
      }}
      transition={{
        scale:           { type: "spring", stiffness: 400, damping: 10 },
        backgroundColor: { type: "spring", stiffness: 400, damping: 10 },
        opacity:         { duration: 0.15 },
      }}
      aria-hidden="true"
    />
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuData } from "@/app/data/menuData";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format&fit=crop";
import styles from "./QuizRecomendador.module.css";

// ── TYPES ──────────────────────────────────────────────────────────────────

type Answers = {
  saciedad: string | null;
  sabor: string | null;
  base: string | null;
  alergenos: string[];
};

type Dish = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  alergenos: string[];
  tags: {
    saciedad: string;
    sabor: string[];
    base: string;
    ocasion: string;
  };
};

// ── CONTENT ────────────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Empecemos...",
  "Bien, seguimos...",
  "Ya casi estamos...",
  "Último paso...",
];

const STEP_IMAGES = [
  "/images/imageninicioquiz.png",
  "/images/paso1.png",
  "/images/galeria1.png",
  "/images/paso3.png",
  "/images/paso4.png",
];

const Q1_OPTIONS = [
  { emoji: "🫒", text: "Solo quiero picar algo", value: "ligero" },
  { emoji: "🍽️", text: "Tengo hambre normal", value: "medio" },
  { emoji: "🐂", text: "Podría comerme un toro", value: "contundente" },
];
const Q2_OPTIONS = [
  { emoji: "🫕", text: "Algo de toda la vida, de guiso", value: "tradicional" },
  { emoji: "🌿", text: "Algo fresco y ligero", value: "fresco" },
  { emoji: "🔥", text: "Algo con sabor intenso", value: "intenso" },
  { emoji: "✨", text: "Sorpréndeme con algo diferente", value: "creativo" },
];
const Q3_OPTIONS = [
  { emoji: "🥩", text: "Carne", value: "carne" },
  { emoji: "🐟", text: "Pescado o marisco", value: "pescado" },
  { emoji: "🥗", text: "Verduras o sin carne", value: "verdura" },
  { emoji: "🎲", text: "Me da igual, lo que sea", value: null },
];
const Q4_OPTIONS = [
  { emoji: "✅", text: "Ninguna", value: "ninguna" },
  { emoji: "🌾", text: "Sin gluten", value: "gluten" },
  { emoji: "🥛", text: "Sin lactosa", value: "lactosa" },
  { emoji: "🥚", text: "Sin huevo", value: "huevo" },
  { emoji: "🦐", text: "Sin marisco", value: "marisco" },
];

// ── RECOMMENDATION ENGINE ──────────────────────────────────────────────────

function recommend(answers: Answers): Dish {
  const { saciedad, sabor, base, alergenos } = answers;

  const dishes = menuData as Dish[];

  // 1. Exclude beverages, desserts and allergens
  const filtered = dishes.filter((d) => {
    if (["bebidas", "postres"].includes(d.categoria)) return false;
    if (alergenos.length && alergenos.some((a) => d.alergenos.includes(a))) return false;
    return true;
  });

  // 2. Score
  const scored = filtered.map((d) => {
    let score = 0;
    if (saciedad && d.tags.saciedad === saciedad) score += 3;
    if (sabor && d.tags.sabor.includes(sabor)) score += 2;
    if (base) {
      const hit =
        base === "pescado"
          ? d.tags.base === "pescado" || d.tags.base === "marisco"
          : d.tags.base === base;
      if (hit) score += 1;
    }
    return { d, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.d ?? (dishes.find((d) => d.id === 1) as Dish);
}

// ── ANIMATION VARIANTS ─────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as number[] } },
  exit: (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0, transition: { duration: 0.22 } }),
};

const fadeVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as number[] } },
};

// ── COMPONENT ──────────────────────────────────────────────────────────────

export default function QuizRecomendador() {
  const [step, setStep] = useState(0);          // 0=intro 1-4=questions 5=result
  const [dir, setDir] = useState(1);
  const [pendingVal, setPendingVal] = useState<string | null>(null);
  const [alergenos, setAlergenos] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({
    saciedad: null, sabor: null, base: null, alergenos: [],
  });

  const result = useMemo(
    () => (step === 5 ? recommend(answers) : null),
    [step, answers],
  );

  const imgSrc = STEP_IMAGES[Math.min(step, STEP_IMAGES.length - 1)];
  const progress = step === 0 ? 0 : step >= 5 ? 100 : (step / 4) * 100;

  // Advance after brief "selected" flash
  function advance(key: keyof Answers, value: string | null) {
    const flash = value ?? "__null__";
    setPendingVal(flash);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setPendingVal(null);
      setDir(1);
      setStep((s) => s + 1);
    }, 280);
  }

  function confirmAlergenos() {
    const resolved = alergenos.includes("ninguna") || alergenos.length === 0
      ? [] : alergenos;
    setAnswers((prev) => ({ ...prev, alergenos: resolved }));
    setDir(1);
    setStep(5);
  }

  function reset() {
    setDir(-1);
    setStep(0);
    setAnswers({ saciedad: null, sabor: null, base: null, alergenos: [] });
    setAlergenos([]);
    setPendingVal(null);
  }

  function toggleAlergeno(val: string) {
    setAlergenos((prev) => {
      if (val === "ninguna") return ["ninguna"];
      const without = prev.filter((a) => a !== "ninguna");
      return without.includes(val) ? without.filter((a) => a !== val) : [...without, val];
    });
  }

  // Generic option button
  function OptionBtn({
    emoji, text, value, selected, onClick,
  }: { emoji: string; text: string; value: string | null; selected: boolean; onClick: () => void }) {
    return (
      <button
        className={`${styles.option} ${selected ? styles.selected : ""}`}
        onClick={onClick}
      >
        <span className={styles.emoji}>{emoji}</span>
        <span>{text}</span>
      </button>
    );
  }

  return (
    <section className={styles.section} id="quiz" aria-label="Recomendador de platos">
      <div className={styles.inner}>

        {/* ── LEFT PANEL — Image ──────────────────────────── */}
        <div className={styles.imagePanel}>
          <AnimatePresence mode="wait">
            <motion.img
              key={imgSrc}
              src={imgSrc}
              alt="Plato del restaurante Cruz Blanca"
              className={styles.panelImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
            />
          </AnimatePresence>
          <div className={styles.imgOverlay} />
        </div>

        {/* ── RIGHT PANEL — Quiz ──────────────────────────── */}
        <div className={styles.quizPanel}>

          {/* Header */}
          <div className={styles.quizHeader}>
            <span className={styles.eyebrow}>› Menú a medida</span>
            <h2 className={styles.heading}>
              ¿Buscas tu próximo <strong>plato favorito?</strong>
            </h2>
            <p className={styles.subheading}>
              Deja que nuestro algoritmo encuentre{" "}
              <strong>la combinación perfecta</strong> para tu paladar.
            </p>
          </div>

          {/* Card */}
          <div className={styles.card}>
            <AnimatePresence mode="wait" custom={dir}>

              {/* ── PASO 0 — Inicio ──────────────────────── */}
              {step === 0 && (
                <motion.div
                  key="intro"
                  className={styles.cardInner}
                  variants={slideVariants}
                  custom={dir}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <p className={styles.ctaText}>
                    ¿Listo para descubrir<br />qué vas a comer hoy?
                  </p>
                  <button
                    className={`${styles.startBtn} ${styles.pulse}`}
                    onClick={() => { setDir(1); setStep(1); }}
                  >
                    › Iniciar encuesta
                  </button>
                </motion.div>
              )}

              {/* ── PASOS 1–4 — Preguntas ────────────────── */}
              {step >= 1 && step <= 4 && (
                <motion.div
                  key={`step-${step}`}
                  className={styles.cardInner}
                  variants={slideVariants}
                  custom={dir}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Progress */}
                  <div className={styles.progressWrap}>
                    <span className={styles.progressLabel}>{STEP_LABELS[step - 1]}</span>
                    <div className={styles.progressBar}>
                      <motion.div
                        className={styles.progressFill}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <p className={styles.question}>
                    {step === 1 && "¿Cuánta hambre tienes?"}
                    {step === 2 && "¿Qué te apetece hoy?"}
                    {step === 3 && "¿Prefieres...?"}
                    {step === 4 && "¿Tienes alguna intolerancia?"}
                  </p>

                  {/* Options */}
                  <div className={styles.options}>
                    {step === 1 && Q1_OPTIONS.map((o) => (
                      <OptionBtn key={o.value} {...o}
                        selected={pendingVal === o.value}
                        onClick={() => advance("saciedad", o.value)}
                      />
                    ))}
                    {step === 2 && Q2_OPTIONS.map((o) => (
                      <OptionBtn key={o.value} {...o}
                        selected={pendingVal === o.value}
                        onClick={() => advance("sabor", o.value)}
                      />
                    ))}
                    {step === 3 && Q3_OPTIONS.map((o) => (
                      <OptionBtn key={String(o.value)} {...o}
                        selected={pendingVal === (o.value ?? "__null__")}
                        onClick={() => advance("base", o.value)}
                      />
                    ))}
                    {step === 4 && (
                      <>
                        {Q4_OPTIONS.map((o) => (
                          <OptionBtn key={o.value} {...o}
                            selected={alergenos.includes(o.value)}
                            onClick={() => toggleAlergeno(o.value)}
                          />
                        ))}
                        <button
                          className={styles.confirmBtn}
                          onClick={confirmAlergenos}
                          disabled={alergenos.length === 0}
                        >
                          Ver mi recomendación →
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── PASO 5 — Resultado ───────────────────── */}
              {step === 5 && result && (
                <motion.div
                  key="result"
                  className={styles.cardInner}
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Progress (100%) */}
                  <div className={styles.progressWrap}>
                    <span className={styles.progressLabel}>Tu plato ideal es...</span>
                    <div className={styles.progressBar}>
                      <motion.div
                        className={styles.progressFill}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Dish image — real when set, placeholder otherwise */}
                  <div className={styles.resultImgWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.imagen || PLACEHOLDER}
                      alt={result.nombre}
                      className={styles.resultImg}
                    />
                  </div>

                  {/* Dish info */}
                  <div className={styles.resultInfo}>
                    <p className={styles.resultName}>{result.nombre}</p>
                    <p className={styles.resultDesc}>{result.descripcion}</p>
                    <p className={styles.resultPrice}>
                      {result.precio.toFixed(2).replace(".", ",")} €
                    </p>
                  </div>

                  {/* Actions */}
                  <div className={styles.resultActions}>
                    <a href="/menu" className={styles.resultCta}>› Ver en la carta</a>
                    <button className={styles.resetBtn} onClick={reset}>
                      Volver a empezar
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

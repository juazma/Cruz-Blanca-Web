import { getPlatosPublico }                             from "@/app/actions/carta";
import MenuClient, { type MenuDish, type MenuCategoria } from "./MenuClient";
import type { Plato }                                    from "@/app/generated/prisma/client";

// ── Orden y etiquetas de categorías ────────────────────────────────────────

const CAT_ORDER = ["entrantes", "primeros", "pescados", "carnes", "postres", "bebidas"];

const CAT_LABEL: Record<string, string> = {
  entrantes: "Para empezar",
  primeros:  "Primeros platos",
  pescados:  "Pescados",
  carnes:    "Carnes",
  postres:   "Postres",
  bebidas:   "Vinos",
};

// ── Page ────────────────────────────────────────────────────────────────────

export default async function MenuPage() {
  const rawPlatos = await getPlatosPublico();

  // Map DB platos to MenuDish shape (parse alergenos JSON string)
  const platos: MenuDish[] = rawPlatos.map((p: Plato) => {
    let alergenos: string[] = [];
    try { alergenos = JSON.parse(p.alergenos); } catch { /* keep [] */ }

    return {
      id:          p.id,
      nombre:      p.nombre,
      descripcion: p.descripcion,
      precio:      p.precio,
      categoria:   p.categoria,
      imagen:      p.imagen ?? "",
      alergenos,
      disponible:  p.disponible,
    };
  });

  // Derive unique ordered categories that actually have platos
  const catsPresentes = new Set(platos.map((p) => p.categoria));
  const categorias: MenuCategoria[] = CAT_ORDER
    .filter((id) => catsPresentes.has(id))
    .map((id) => ({ id, label: CAT_LABEL[id] ?? id }));

  // Add any unknown categories not in CAT_ORDER (e.g. custom ones added from admin)
  for (const cat of catsPresentes) {
    if (!CAT_ORDER.includes(cat)) {
      categorias.push({ id: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) });
    }
  }

  return <MenuClient platos={platos} categorias={categorias} />;
}

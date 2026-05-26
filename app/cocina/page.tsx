import { getComandasActivas } from "@/app/actions/comandasActions";
import CocinaClient from "./CocinaClient";

export default async function CocinaPage() {
  const comandas = await getComandasActivas();
  return <CocinaClient comandas={comandas} />;
}

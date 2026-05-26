import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getComandasActivas, getPlatosDisponibles } from "@/app/actions/comandasActions";
import CamareroClient from "./CamareroClient";

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export default async function CamarerosPage() {
  /* Decode camarero name from JWT */
  let camarero = "camarero";
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("staff_session")?.value;
    if (token) {
      const { payload } = await jwtVerify(token, getSecret());
      camarero = (payload.sub as string) ?? "camarero";
    }
  } catch {
    // middleware already guards this route
  }

  const [comandas, platos] = await Promise.all([
    getComandasActivas(),
    getPlatosDisponibles(),
  ]);

  return (
    <CamareroClient
      comandas={comandas}
      platos={platos}
      camarero={camarero}
    />
  );
}

import type { ReactNode } from "react";

export const metadata = {
  title: "Cocina · Cruz Blanca",
};

export default function CocinaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

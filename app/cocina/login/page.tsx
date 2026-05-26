import { redirect } from "next/navigation";

// Cocina uses the same login form as camareros
export default function CocinaLoginRedirect() {
  redirect("/camareros/login");
}

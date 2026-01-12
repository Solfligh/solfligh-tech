import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function FXCOPilotRedirectPage() {
  redirect("https://fxco-pilot.solflightech.org");
}

import { redirect } from "next/navigation";

export default function LegacyAdminIdPage() {
  redirect("/admin/users");
}
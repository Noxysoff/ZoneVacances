import { redirect } from "next/navigation";
import { isLocale } from "@/lib/locale";

export default async function LocaleIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect("/fr/home");
  }

  redirect(`/${locale}/home`);
}

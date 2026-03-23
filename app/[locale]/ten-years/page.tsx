import { notFound } from "next/navigation";
import { TenYearOutlook } from "@/components/dashboard/ten-year-outlook";
import { getTenYearVacationData } from "@/lib/dashboard-data";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

function formatSyncTime(locale: string, isoString: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export default async function TenYearsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const data = await getTenYearVacationData(locale);

  return (
    <main className="page-shell">
      <section className="page-heading page-heading--stack">
        <div>
          <p className="page-kicker">ZoneVacances</p>
          <h1 className="page-title">{dictionary.common.tenYears}</h1>
        </div>

        <div className="page-copy page-copy--wide">
          <p>{dictionary.common.tenYears}</p>
          <p>
            {dictionary.countryPage.updatedAt} {formatSyncTime(locale, data.generatedAt)}
          </p>
        </div>
      </section>

      <TenYearOutlook data={data} error={null} isLoading={false} />
    </main>
  );
}

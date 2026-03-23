"use client";

import { usePathname } from "next/navigation";

type SiteFooterProps = {
  legalLabel: string;
  sourcesLabel: string;
};

const FOOTER_LINKS = [
  {
    href: "https://data.education.gouv.fr/explore/dataset/fr-en-calendrier-scolaire",
    label: "Education France",
  },
  {
    href: "https://calendrier.api.gouv.fr/jours-feries/",
    label: "Jours feries FR",
  },
  {
    href: "https://www.openholidaysapi.org/",
    label: "OpenHolidays API",
  },
  {
    href: "https://date.nager.at/API",
    label: "Nager.Date",
  },
  {
    href: "https://geo.api.gouv.fr/",
    label: "API Geo",
  },
];

export function SiteFooter({ legalLabel, sourcesLabel }: SiteFooterProps) {
  const pathname = usePathname();

  if (pathname.endsWith("/home")) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__sources">
          <p className="page-footer__label">{sourcesLabel}</p>
          <div className="source-row source-row--footer">
            {FOOTER_LINKS.map((link) => (
              <a
                className="source-link"
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <p className="site-footer__legal">{legalLabel}</p>
      </div>
    </footer>
  );
}

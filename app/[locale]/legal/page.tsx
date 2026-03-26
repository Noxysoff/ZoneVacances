import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import type { AppLocale } from "@/lib/types";

type TermsSection = {
  body: string[];
  bodyAfterBullets?: string[];
  bullets?: string[];
  title: string;
};

type TermsContent = {
  intro: string;
  sections: TermsSection[];
  updatedAt: string;
};

function getTermsContent(locale: AppLocale): TermsContent {
  if (locale === "fr") {
    return {
      intro:
        "Le site ZoneVacances est une plateforme permettant de consulter les periodes de vacances scolaires dans differents pays d'Europe. Les informations presentes sur le site sont fournies a titre informatif.",
      sections: [
        {
          body: [
            "En accedant et en utilisant le site ZoneVacances, l'utilisateur accepte pleinement et sans reserve les presentes conditions d'utilisation.",
            "Si l'utilisateur n'accepte pas ces conditions, il est invite a ne pas utiliser le site.",
          ],
          title: "1. Acceptation des conditions",
        },
        {
          body: [
            "Le site est accessible gratuitement a tout utilisateur disposant d'un acces a Internet.",
            "L'editeur du site ne pourra etre tenu responsable en cas :",
          ],
          bullets: [
            "d'interruption du site",
            "de maintenance technique",
            "de probleme reseau ou serveur",
          ],
          title: "2. Acces au site",
        },
        {
          body: [
            "L'utilisateur s'engage a utiliser le site de maniere conforme aux lois et reglements en vigueur.",
            "Il est interdit de :",
          ],
          bullets: [
            "perturber le fonctionnement du site",
            "tenter d'acceder de maniere non autorisee aux systemes du site",
            "utiliser le site a des fins frauduleuses ou illegales",
            "copier massivement les donnees du site sans autorisation",
          ],
          title: "3. Utilisation du site",
        },
        {
          body: [
            "ZoneVacances s'efforce de fournir des informations aussi precises que possible concernant les vacances scolaires.",
            "Cependant :",
          ],
          bodyAfterBullets: [
            "Les utilisateurs sont invites a verifier les informations aupres des sources officielles si necessaire.",
          ],
          bullets: [
            "certaines informations peuvent contenir des erreurs",
            "les dates peuvent etre modifiees par les autorites officielles",
          ],
          title: "4. Exactitude des informations",
        },
        {
          body: [
            "L'ensemble du contenu du site, y compris les textes, le design, le logo, le code et la structure, est protege par les lois relatives a la propriete intellectuelle.",
            "Sauf autorisation prealable, toute reproduction, modification ou distribution du contenu du site est interdite.",
          ],
          title: "5. Propriete intellectuelle",
        },
        {
          body: [
            "Le site peut contenir des liens vers des sites externes.",
            "ZoneVacances ne peut etre tenu responsable du contenu ou du fonctionnement de ces sites tiers.",
          ],
          title: "6. Liens externes",
        },
        {
          body: [
            "Les presentes conditions d'utilisation peuvent etre modifiees a tout moment.",
            "Les utilisateurs sont invites a consulter regulierement cette page afin de prendre connaissance des eventuelles modifications.",
          ],
          title: "7. Modification des conditions",
        },
      ],
      updatedAt: "Derniere mise a jour : 26 mars 2026",
    };
  }

  if (locale === "pl") {
    return {
      intro:
        "ZoneVacances to platforma pozwalajaca sprawdzac okresy ferii szkolnych w roznych krajach Europy. Informacje publikowane w serwisie maja charakter informacyjny.",
      sections: [
        {
          body: [
            "Uzyskujac dostep do serwisu ZoneVacances i korzystajac z niego, uzytkownik w pelni i bez zastrzezen akceptuje niniejsze warunki korzystania.",
            "Jesli uzytkownik nie akceptuje tych warunkow, powinien nie korzystac z serwisu.",
          ],
          title: "1. Akceptacja warunkow",
        },
        {
          body: [
            "Serwis jest dostepny bezplatnie dla kazdego uzytkownika posiadajacego dostep do Internetu.",
            "Wlasciciel serwisu nie ponosi odpowiedzialnosci w przypadku:",
          ],
          bullets: [
            "przerw w dzialaniu serwisu",
            "prac technicznych",
            "problemow sieciowych lub serwerowych",
          ],
          title: "2. Dostep do serwisu",
        },
        {
          body: [
            "Uzytkownik zobowiazuje sie korzystac z serwisu zgodnie z obowiazujacym prawem i przepisami.",
            "Zabronione jest:",
          ],
          bullets: [
            "zaklocanie dzialania serwisu",
            "probowanie uzyskania nieautoryzowanego dostepu do systemow serwisu",
            "wykorzystywanie serwisu do celow oszukanczych lub nielegalnych",
            "masowe kopiowanie danych z serwisu bez zgody",
          ],
          title: "3. Korzystanie z serwisu",
        },
        {
          body: [
            "ZoneVacances doklada staran, aby przekazywac jak najdokladniejsze informacje o feriach szkolnych.",
            "Jednak:",
          ],
          bodyAfterBullets: [
            "W razie potrzeby uzytkownicy powinni sprawdzac informacje w oficjalnych zrodlach.",
          ],
          bullets: [
            "niektore informacje moga zawierac bledy",
            "daty moga zostac zmienione przez wladze oficjalne",
          ],
          title: "4. Dokladnosc informacji",
        },
        {
          body: [
            "Calosc tresci serwisu, w tym teksty, design, logo, kod i struktura, jest chroniona przepisami dotyczacymi wlasnosci intelektualnej.",
            "Bez wczesniejszej zgody jakiekolwiek powielanie, modyfikowanie lub rozpowszechnianie tresci serwisu jest zabronione.",
          ],
          title: "5. Wlasnosc intelektualna",
        },
        {
          body: [
            "Serwis moze zawierac linki do stron zewnetrznych.",
            "ZoneVacances nie ponosi odpowiedzialnosci za tresc ani dzialanie stron trzecich.",
          ],
          title: "6. Linki zewnetrzne",
        },
        {
          body: [
            "Niniejsze warunki korzystania moga zostac zmienione w dowolnym momencie.",
            "Uzytkownicy sa proszeni o regularne odwiedzanie tej strony, aby zapoznac sie z ewentualnymi zmianami.",
          ],
          title: "7. Zmiana warunkow",
        },
      ],
      updatedAt: "Ostatnia aktualizacja: 26 marca 2026",
    };
  }

  return {
    intro:
      "ZoneVacances is a platform for consulting school holiday periods in different European countries. The information available on the site is provided for informational purposes.",
    sections: [
      {
        body: [
          "By accessing and using ZoneVacances, the user fully and unreservedly accepts these terms of use.",
          "If the user does not accept these terms, they should not use the site.",
        ],
        title: "1. Acceptance of the terms",
      },
      {
        body: [
          "The site is accessible free of charge to any user with Internet access.",
          "The site publisher cannot be held responsible in the event of:",
        ],
        bullets: [
          "site interruptions",
          "technical maintenance",
          "network or server issues",
        ],
        title: "2. Access to the site",
      },
      {
        body: [
          "The user agrees to use the site in compliance with applicable laws and regulations.",
          "The following is prohibited:",
        ],
        bullets: [
          "disrupting the operation of the site",
          "attempting unauthorized access to the site's systems",
          "using the site for fraudulent or illegal purposes",
          "mass copying data from the site without authorization",
        ],
        title: "3. Use of the site",
      },
      {
        body: [
          "ZoneVacances strives to provide information about school holidays as accurately as possible.",
          "However:",
        ],
        bodyAfterBullets: [
          "Users are encouraged to verify information with official sources whenever necessary.",
        ],
        bullets: [
          "some information may contain errors",
          "dates may be changed by official authorities",
        ],
        title: "4. Accuracy of information",
      },
      {
        body: [
          "All content on the site, including text, design, logo, code and structure, is protected by intellectual property laws.",
          "Unless prior authorization is granted, any reproduction, modification or distribution of the site's content is prohibited.",
        ],
        title: "5. Intellectual property",
      },
      {
        body: [
          "The site may contain links to external websites.",
          "ZoneVacances cannot be held responsible for the content or operation of third-party sites.",
        ],
        title: "6. External links",
      },
      {
        body: [
          "These terms of use may be modified at any time.",
          "Users are invited to consult this page regularly in order to stay informed of any changes.",
        ],
        title: "7. Changes to the terms",
      },
    ],
    updatedAt: "Last updated: March 26, 2026",
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const content = getTermsContent(locale);

  return (
    <main className="page-shell legal-page">
      <section className="page-heading page-heading--stack legal-page__heading">
        <p className="page-kicker">ZoneVacances</p>
        <h1 className="page-title legal-page__title">{dictionary.legalPage.title}</h1>
        <p className="page-copy page-copy--wide legal-page__intro">{dictionary.legalPage.subtitle}</p>
        <p className="page-copy page-copy--wide legal-page__meta">{content.updatedAt}</p>
        <p className="page-copy page-copy--wide legal-page__intro">{content.intro}</p>
      </section>

      <section className="legal-terms">
        {content.sections.map((section) => (
          <section className="legal-terms__section" key={section.title}>
            <h2 className="legal-terms__title">{section.title}</h2>

            <div className="legal-terms__body">
              {section.body.map((paragraph) => (
                <p className="legal-terms__text" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="legal-terms__list">
                  {section.bullets.map((bullet) => (
                    <li className="legal-terms__item" key={bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.bodyAfterBullets?.map((paragraph) => (
                <p className="legal-terms__text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

import type { AppLocale } from "@/lib/types";

type Dictionary = {
  nav: {
    allLanguages: string;
    availableCountries: string;
    countries: string;
    home: string;
    language: string;
    selectLanguage: string;
  };
  home: {
    helper: string;
    subtitle: string;
    title: string;
  };
  countriesPage: {
    openCountry: string;
    subtitle: string;
    title: string;
  };
  languagePage: {
    auto: string;
    current: string;
    subtitle: string;
    title: string;
  };
  countryPage: {
    nextVacations: string;
    noPublicHolidays: string;
    noRemainingVacations: string;
    noVacationData: string;
    publicHolidays: string;
    remainingVacations: string;
    updatedAt: string;
  };
  countdown: {
    current: string;
    days: string;
    ended: string;
    hours: string;
    minutes: string;
    past: string;
    remaining: string;
    seconds: string;
    startsIn: string;
    upcoming: string;
  };
  common: {
    allRightsReserved: string;
    holiday: string;
    noData: string;
    publicSources: string;
    search: string;
    tenYears: string;
    unavailable: string;
  };
};

const LANGUAGE_NATIVE_LABELS: Record<string, string> = {
  sq: "Shqip",
  bg: "Български",
  bs: "Bosanski",
  ca: "Català",
  cs: "Čeština",
  cy: "Cymraeg",
  da: "Dansk",
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  es: "Español",
  et: "Eesti",
  fi: "Suomi",
  fr: "Français",
  ga: "Gaeilge",
  hr: "Hrvatski",
  hu: "Magyar",
  is: "Íslenska",
  it: "Italiano",
  lb: "Lëtzebuergesch",
  lt: "Lietuvių",
  lv: "Latviešu",
  mk: "Македонски",
  mt: "Malti",
  nl: "Nederlands",
  no: "Norsk",
  pl: "Polski",
  pt: "Português",
  ro: "Română",
  ru: "Русский",
  sk: "Slovenčina",
  sl: "Slovenščina",
  sr: "Српски",
  sv: "Svenska",
  tr: "Türkçe",
  uk: "Українська",
};

const ENGLISH_DICTIONARY: Dictionary = {
  nav: {
    allLanguages: "All languages",
    availableCountries: "Available countries",
    countries: "Countries",
    home: "Home",
    language: "Language",
    selectLanguage: "Choose language",
  },
  home: {
    helper: "Every European country page is available from the map and the countries menu.",
    subtitle: "Interactive European school holiday map",
    title: "Find your holidays",
  },
  countriesPage: {
    openCountry: "Open country page",
    subtitle: "Browse every available European country page.",
    title: "Countries",
  },
  languagePage: {
    auto: "Browser language detection is enabled.",
    current: "Current language",
    subtitle: "Choose any supported European language.",
    title: "Languages",
  },
  countryPage: {
    nextVacations: "Next school breaks",
    noPublicHolidays: "No upcoming public holidays right now.",
    noRemainingVacations: "No more school breaks remain this year.",
    noVacationData: "School holiday data is temporarily unavailable.",
    publicHolidays: "Public holidays",
    remainingVacations: "Remaining breaks this year",
    updatedAt: "Last sync",
  },
  countdown: {
    current: "Current",
    days: "Days",
    ended: "Ended",
    hours: "Hours",
    minutes: "Minutes",
    past: "Past",
    remaining: "Time left",
    seconds: "Seconds",
    startsIn: "Starts in",
    upcoming: "Upcoming",
  },
  common: {
    allRightsReserved:
      "ZoneVacances. All rights reserved. Calendars and school zones are provided for information only.",
    holiday: "Public holiday",
    noData: "No data",
    publicSources: "Public sources",
    search: "Search",
    tenYears: "10 years",
    unavailable: "Temporarily unavailable",
  },
};

const PARTIAL_DICTIONARIES: Record<string, Partial<Dictionary>> = {
  de: {
    nav: {
      allLanguages: "Alle Sprachen",
      availableCountries: "Verfugbare Lander",
      countries: "Lander",
      home: "Home",
      language: "Sprache",
      selectLanguage: "Sprache wahlen",
    },
    home: {
      helper: "Jede europaische Landerseite ist uber die Karte und das Landermenue verfugbar.",
      subtitle: "Interaktive europaische Schulferienkarte",
      title: "Finde deine Ferien",
    },
    countriesPage: {
      openCountry: "Landesseite offnen",
      subtitle: "Durchsuche alle verfugbaren europaischen Landesseiten.",
      title: "Lander",
    },
    languagePage: {
      auto: "Die Browsersprache wird automatisch erkannt.",
      current: "Aktuelle Sprache",
      subtitle: "Wahle eine beliebige unterstutzte europaische Sprache.",
      title: "Sprachen",
    },
    countryPage: {
      nextVacations: "Nachste Ferien",
      noPublicHolidays: "Derzeit keine bevorstehenden Feiertage.",
      noRemainingVacations: "Keine weiteren Ferien in diesem Jahr.",
      noVacationData: "Schulferiendaten sind vorubergehend nicht verfugbar.",
      publicHolidays: "Feiertage",
      remainingVacations: "Verbleibende Ferien dieses Jahr",
      updatedAt: "Letzte Aktualisierung",
    },
    countdown: {
      current: "Aktuell",
      days: "Tage",
      ended: "Beendet",
      hours: "Stunden",
      minutes: "Minuten",
      past: "Vorbei",
      remaining: "Verbleibend",
      seconds: "Sekunden",
      startsIn: "Beginn in",
      upcoming: "Bevorstehend",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Alle Rechte vorbehalten. Kalender und Schulzonen dienen nur zur Information.",
      holiday: "Feiertag",
      noData: "Keine Daten",
      publicSources: "Offentliche Quellen",
      search: "Suche",
      tenYears: "10 Jahre",
      unavailable: "Vorubergehend nicht verfugbar",
    },
  },
  en: ENGLISH_DICTIONARY,
  es: {
    nav: {
      allLanguages: "Todos los idiomas",
      availableCountries: "Paises disponibles",
      countries: "Paises",
      home: "Inicio",
      language: "Idioma",
      selectLanguage: "Elegir idioma",
    },
    home: {
      helper: "Todas las paginas de paises europeos estan disponibles desde el mapa y el menu.",
      subtitle: "Mapa interactivo europeo de vacaciones escolares",
      title: "Encuentra tus vacaciones",
    },
    countriesPage: {
      openCountry: "Abrir pagina del pais",
      subtitle: "Explora todas las paginas europeas disponibles.",
      title: "Paises",
    },
    languagePage: {
      auto: "La deteccion del idioma del navegador esta activada.",
      current: "Idioma actual",
      subtitle: "Elige cualquier idioma europeo compatible.",
      title: "Idiomas",
    },
    countryPage: {
      nextVacations: "Proximas vacaciones escolares",
      noPublicHolidays: "No hay proximos festivos por ahora.",
      noRemainingVacations: "No quedan mas vacaciones escolares este ano.",
      noVacationData: "Los datos de vacaciones escolares no estan disponibles temporalmente.",
      publicHolidays: "Festivos",
      remainingVacations: "Vacaciones restantes del ano",
      updatedAt: "Ultima sincronizacion",
    },
    countdown: {
      current: "Actual",
      days: "Dias",
      ended: "Terminado",
      hours: "Horas",
      minutes: "Minutos",
      past: "Pasado",
      remaining: "Tiempo restante",
      seconds: "Segundos",
      startsIn: "Empieza en",
      upcoming: "Proximo",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Todos los derechos reservados. Los calendarios y zonas escolares se ofrecen a titulo informativo.",
      holiday: "Festivo",
      noData: "Sin datos",
      publicSources: "Fuentes publicas",
      search: "Buscar",
      tenYears: "10 anos",
      unavailable: "Temporalmente no disponible",
    },
  },
  fr: {
    nav: {
      allLanguages: "Toutes les langues",
      availableCountries: "Pays disponibles",
      countries: "Pays",
      home: "Home",
      language: "Langue",
      selectLanguage: "Choisir la langue",
    },
    home: {
      helper: "Toutes les pages pays europe sont accessibles depuis la carte et le menu des pays.",
      subtitle: "Carte interactive europeenne des vacances scolaires",
      title: "Trouve tes vacances",
    },
    countriesPage: {
      openCountry: "Ouvrir la page pays",
      subtitle: "Parcours toutes les pages pays disponibles en Europe.",
      title: "Pays",
    },
    languagePage: {
      auto: "La detection de la langue du navigateur est activee.",
      current: "Langue actuelle",
      subtitle: "Choisis n'importe quelle langue europeenne disponible.",
      title: "Langues",
    },
    countryPage: {
      nextVacations: "Prochaines vacances",
      noPublicHolidays: "Aucun jour ferie a venir pour le moment.",
      noRemainingVacations: "Aucune autre periode de vacances cette annee.",
      noVacationData: "Les donnees de vacances scolaires sont temporairement indisponibles.",
      publicHolidays: "Jours feries",
      remainingVacations: "Vacances restantes cette annee",
      updatedAt: "Derniere synchro",
    },
    countdown: {
      current: "Actuellement",
      days: "Jours",
      ended: "Termine",
      hours: "Heures",
      minutes: "Minutes",
      past: "Passe",
      remaining: "Temps restant",
      seconds: "Secondes",
      startsIn: "Debut dans",
      upcoming: "A venir",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Tous droits reserves. Calendriers et zones scolaires fournis a titre indicatif.",
      holiday: "Jour ferie",
      noData: "Aucune donnee",
      publicSources: "Sources publiques",
      search: "Recherche",
      tenYears: "10 ans",
      unavailable: "Temporairement indisponible",
    },
  },
  it: {
    nav: {
      allLanguages: "Tutte le lingue",
      availableCountries: "Paesi disponibili",
      countries: "Paesi",
      home: "Home",
      language: "Lingua",
      selectLanguage: "Scegli lingua",
    },
    home: {
      helper: "Tutte le pagine dei paesi europei sono disponibili dalla mappa e dal menu.",
      subtitle: "Mappa interattiva europea delle vacanze scolastiche",
      title: "Trova le tue vacanze",
    },
    countriesPage: {
      openCountry: "Apri la pagina del paese",
      subtitle: "Esplora tutte le pagine dei paesi europei disponibili.",
      title: "Paesi",
    },
    languagePage: {
      auto: "Il rilevamento automatico della lingua del browser e attivo.",
      current: "Lingua attuale",
      subtitle: "Scegli qualsiasi lingua europea supportata.",
      title: "Lingue",
    },
    countryPage: {
      nextVacations: "Prossime vacanze scolastiche",
      noPublicHolidays: "Nessuna prossima festivita al momento.",
      noRemainingVacations: "Non restano altre vacanze scolastiche quest'anno.",
      noVacationData: "I dati sulle vacanze scolastiche sono temporaneamente non disponibili.",
      publicHolidays: "Festivita",
      remainingVacations: "Vacanze restanti dell'anno",
      updatedAt: "Ultimo aggiornamento",
    },
    countdown: {
      current: "Attuale",
      days: "Giorni",
      ended: "Terminato",
      hours: "Ore",
      minutes: "Minuti",
      past: "Passato",
      remaining: "Tempo restante",
      seconds: "Secondi",
      startsIn: "Inizia tra",
      upcoming: "In arrivo",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Tutti i diritti riservati. Calendari e zone scolastiche sono forniti a titolo informativo.",
      holiday: "Festivita",
      noData: "Nessun dato",
      publicSources: "Fonti pubbliche",
      search: "Ricerca",
      tenYears: "10 anni",
      unavailable: "Temporaneamente non disponibile",
    },
  },
  nl: {
    nav: {
      allLanguages: "Alle talen",
      availableCountries: "Beschikbare landen",
      countries: "Landen",
      home: "Home",
      language: "Taal",
      selectLanguage: "Taal kiezen",
    },
    home: {
      helper: "Alle Europese landpagina's zijn beschikbaar via de kaart en het landenmenu.",
      subtitle: "Interactieve Europese schoolvakantiekaart",
      title: "Vind je vakanties",
    },
    countriesPage: {
      openCountry: "Landpagina openen",
      subtitle: "Bekijk alle beschikbare Europese landpagina's.",
      title: "Landen",
    },
    languagePage: {
      auto: "Browsertaaldetectie is ingeschakeld.",
      current: "Huidige taal",
      subtitle: "Kies elke ondersteunde Europese taal.",
      title: "Talen",
    },
    countryPage: {
      nextVacations: "Volgende schoolvakanties",
      noPublicHolidays: "Op dit moment geen komende feestdagen.",
      noRemainingVacations: "Er zijn dit jaar geen schoolvakanties meer over.",
      noVacationData: "Schoolvakantiegegevens zijn tijdelijk niet beschikbaar.",
      publicHolidays: "Feestdagen",
      remainingVacations: "Resterende vakanties dit jaar",
      updatedAt: "Laatste synchronisatie",
    },
    countdown: {
      current: "Huidig",
      days: "Dagen",
      ended: "Voorbij",
      hours: "Uren",
      minutes: "Minuten",
      past: "Afgelopen",
      remaining: "Resterende tijd",
      seconds: "Seconden",
      startsIn: "Begint over",
      upcoming: "Komend",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Alle rechten voorbehouden. Kalenders en schoolzones zijn alleen ter informatie.",
      holiday: "Feestdag",
      noData: "Geen gegevens",
      publicSources: "Openbare bronnen",
      search: "Zoeken",
      tenYears: "10 jaar",
      unavailable: "Tijdelijk niet beschikbaar",
    },
  },
  pl: {
    nav: {
      allLanguages: "Wszystkie jezyki",
      availableCountries: "Dostepne kraje",
      countries: "Kraje",
      home: "Home",
      language: "Jezyk",
      selectLanguage: "Wybierz jezyk",
    },
    home: {
      helper: "Wszystkie strony krajow europejskich sa dostepne z mapy i menu krajow.",
      subtitle: "Interaktywna europejska mapa ferii szkolnych",
      title: "Znajdz swoje wakacje",
    },
    countriesPage: {
      openCountry: "Otworz strone kraju",
      subtitle: "Przegladaj wszystkie dostepne strony krajow europejskich.",
      title: "Kraje",
    },
    languagePage: {
      auto: "Automatyczne wykrywanie jezyka przegladarki jest wlaczone.",
      current: "Aktualny jezyk",
      subtitle: "Wybierz dowolny obslugiwany jezyk europejski.",
      title: "Jezyki",
    },
    countryPage: {
      nextVacations: "Najblizsze ferie szkolne",
      noPublicHolidays: "Brak zblizajacych sie swiat.",
      noRemainingVacations: "W tym roku nie ma juz pozostalych ferii szkolnych.",
      noVacationData: "Dane o feriach szkolnych sa tymczasowo niedostepne.",
      publicHolidays: "Swieta",
      remainingVacations: "Pozostale ferie w tym roku",
      updatedAt: "Ostatnia synchronizacja",
    },
    countdown: {
      current: "Obecnie",
      days: "Dni",
      ended: "Zakonczone",
      hours: "Godziny",
      minutes: "Minuty",
      past: "Minelo",
      remaining: "Pozostaly czas",
      seconds: "Sekundy",
      startsIn: "Poczatek za",
      upcoming: "Nadchodzace",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Wszelkie prawa zastrzezone. Kalendarze i strefy szkolne maja charakter informacyjny.",
      holiday: "Swieto",
      noData: "Brak danych",
      publicSources: "Zrodla publiczne",
      search: "Szukaj",
      tenYears: "10 lat",
      unavailable: "Tymczasowo niedostepne",
    },
  },
  pt: {
    nav: {
      allLanguages: "Todas as linguas",
      availableCountries: "Paises disponiveis",
      countries: "Paises",
      home: "Home",
      language: "Idioma",
      selectLanguage: "Escolher idioma",
    },
    home: {
      helper: "Todas as paginas dos paises europeus estao disponiveis no mapa e no menu.",
      subtitle: "Mapa interativo europeu das ferias escolares",
      title: "Encontra as tuas ferias",
    },
    countriesPage: {
      openCountry: "Abrir pagina do pais",
      subtitle: "Explora todas as paginas europeias disponiveis.",
      title: "Paises",
    },
    languagePage: {
      auto: "A deteccao do idioma do navegador esta ativa.",
      current: "Idioma atual",
      subtitle: "Escolhe qualquer idioma europeu suportado.",
      title: "Idiomas",
    },
    countryPage: {
      nextVacations: "Proximas ferias escolares",
      noPublicHolidays: "Sem proximos feriados por agora.",
      noRemainingVacations: "Nao restam mais ferias escolares este ano.",
      noVacationData: "Os dados de ferias escolares estao temporariamente indisponiveis.",
      publicHolidays: "Feriados",
      remainingVacations: "Ferias restantes este ano",
      updatedAt: "Ultima sincronizacao",
    },
    countdown: {
      current: "Atual",
      days: "Dias",
      ended: "Terminado",
      hours: "Horas",
      minutes: "Minutos",
      past: "Passado",
      remaining: "Tempo restante",
      seconds: "Segundos",
      startsIn: "Comeca em",
      upcoming: "Proximo",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Todos os direitos reservados. Calendarios e zonas escolares sao fornecidos apenas para informacao.",
      holiday: "Feriado",
      noData: "Sem dados",
      publicSources: "Fontes publicas",
      search: "Pesquisar",
      tenYears: "10 anos",
      unavailable: "Temporariamente indisponivel",
    },
  },
  ro: {
    nav: {
      allLanguages: "Toate limbile",
      availableCountries: "Tari disponibile",
      countries: "Tari",
      home: "Home",
      language: "Limba",
      selectLanguage: "Alege limba",
    },
    home: {
      helper: "Toate paginile tarilor europene sunt disponibile din harta si meniul tarilor.",
      subtitle: "Harta interactiva europeana a vacantelor scolare",
      title: "Gaseste-ti vacantele",
    },
    countriesPage: {
      openCountry: "Deschide pagina tarii",
      subtitle: "Exploreaza toate paginile europene disponibile.",
      title: "Tari",
    },
    languagePage: {
      auto: "Detectarea limbii browserului este activa.",
      current: "Limba curenta",
      subtitle: "Alege orice limba europeana acceptata.",
      title: "Limbi",
    },
    countryPage: {
      nextVacations: "Urmatoarele vacante scolare",
      noPublicHolidays: "Nu exista sarbatori legale apropiate momentan.",
      noRemainingVacations: "Nu mai exista vacante scolare ramase anul acesta.",
      noVacationData: "Datele despre vacantele scolare sunt temporar indisponibile.",
      publicHolidays: "Sarbatori legale",
      remainingVacations: "Vacante ramase anul acesta",
      updatedAt: "Ultima sincronizare",
    },
    countdown: {
      current: "Actual",
      days: "Zile",
      ended: "Terminat",
      hours: "Ore",
      minutes: "Minute",
      past: "Trecut",
      remaining: "Timp ramas",
      seconds: "Secunde",
      startsIn: "Incepe in",
      upcoming: "In curand",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Toate drepturile rezervate. Calendarele si zonele scolare sunt oferite doar informativ.",
      holiday: "Sarbatoare legala",
      noData: "Fara date",
      publicSources: "Surse publice",
      search: "Cautare",
      tenYears: "10 ani",
      unavailable: "Temporar indisponibil",
    },
  },
  ru: {
    nav: {
      allLanguages: "Vse yazyki",
      availableCountries: "Dostupnye strany",
      countries: "Strany",
      home: "Home",
      language: "Yazyk",
      selectLanguage: "Vybrat yazyk",
    },
    home: {
      helper: "Vse stranitsy evropeyskikh stran dostupny s karty i iz menyu stran.",
      subtitle: "Interaktivnaya evropeyskaya karta shkolnykh kanikul",
      title: "Naydi svoi kanikuly",
    },
    countriesPage: {
      openCountry: "Otkryt stranu strany",
      subtitle: "Prosmatrivay vse dostupnye stranitsy evropeyskikh stran.",
      title: "Strany",
    },
    languagePage: {
      auto: "Opredelenie yazyka brauzera vklyucheno.",
      current: "Tekushchiy yazyk",
      subtitle: "Vyberi lyuboy podderzhivaemyy evropeyskiy yazyk.",
      title: "Yazyki",
    },
    countryPage: {
      nextVacations: "Blizhayshie shkolnye kanikuly",
      noPublicHolidays: "Seychas net blizhayshikh prazdnikov.",
      noRemainingVacations: "V etom godu bolshe net ostavshikhsya kanikul.",
      noVacationData: "Dannye o shkolnykh kanikulakh vremenno nedostupny.",
      publicHolidays: "Prazdniki",
      remainingVacations: "Ostavshiesya kanikuly v etom godu",
      updatedAt: "Poslednyaya sinhronizatsiya",
    },
    countdown: {
      current: "Seichas",
      days: "Dni",
      ended: "Zaversheno",
      hours: "Chasy",
      minutes: "Minuty",
      past: "Proshlo",
      remaining: "Ostalos",
      seconds: "Sekundy",
      startsIn: "Nachnetsya cherez",
      upcoming: "Skoro",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Vse prava zashchishcheny. Kalendari i shkolnye zony predostavlyayutsya v spravochnykh tselyakh.",
      holiday: "Prazdnik",
      noData: "Net dannykh",
      publicSources: "Publichnye istochniki",
      search: "Poisk",
      tenYears: "10 let",
      unavailable: "Vremenno nedostupno",
    },
  },
  tr: {
    nav: {
      allLanguages: "Tum diller",
      availableCountries: "Mevcut ulkeler",
      countries: "Ulkeler",
      home: "Home",
      language: "Dil",
      selectLanguage: "Dil sec",
    },
    home: {
      helper: "Tum Avrupa ulke sayfalari harita ve ulkeler menusu uzerinden acilabilir.",
      subtitle: "Etkilesimli Avrupa okul tatili haritasi",
      title: "Tatilini bul",
    },
    countriesPage: {
      openCountry: "Ulke sayfasini ac",
      subtitle: "Tum mevcut Avrupa ulke sayfalarina goz at.",
      title: "Ulkeler",
    },
    languagePage: {
      auto: "Tarayici dil algilama acik.",
      current: "Guncel dil",
      subtitle: "Desteklenen herhangi bir Avrupa dilini sec.",
      title: "Diller",
    },
    countryPage: {
      nextVacations: "Sonraki okul tatilleri",
      noPublicHolidays: "Su anda yaklasan resmi tatil yok.",
      noRemainingVacations: "Bu yil kalan baska okul tatili yok.",
      noVacationData: "Okul tatili verileri gecici olarak kullanilamiyor.",
      publicHolidays: "Resmi tatiller",
      remainingVacations: "Bu yil kalan tatiller",
      updatedAt: "Son guncelleme",
    },
    countdown: {
      current: "Su anda",
      days: "Gun",
      ended: "Bitti",
      hours: "Saat",
      minutes: "Dakika",
      past: "Gecti",
      remaining: "Kalan sure",
      seconds: "Saniye",
      startsIn: "Baslangica kalan",
      upcoming: "Yaklasan",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Tum haklari saklidir. Takvimler ve okul bolgeleri yalnizca bilgilendirme amaclidir.",
      holiday: "Resmi tatil",
      noData: "Veri yok",
      publicSources: "Acik kaynaklar",
      search: "Ara",
      tenYears: "10 yil",
      unavailable: "Gecici olarak kullanilamiyor",
    },
  },
  uk: {
    nav: {
      allLanguages: "Usi movy",
      availableCountries: "Dostupni krainy",
      countries: "Krainy",
      home: "Home",
      language: "Mova",
      selectLanguage: "Obraty movu",
    },
    home: {
      helper: "Usi storinky yevropeiskykh krain dostupni z karty ta menyu krain.",
      subtitle: "Interaktyvna yevropeiska karta shkilnykh kanikul",
      title: "Znaidy svoi kanikuly",
    },
    countriesPage: {
      openCountry: "Vidkryty storinku krainy",
      subtitle: "Perehlyadai vsi dostupni storinky yevropeiskykh krain.",
      title: "Krainy",
    },
    languagePage: {
      auto: "Avtomatychne vyznachennia movy brauzera aktyvne.",
      current: "Potochna mova",
      subtitle: "Obyrai bud-yaku pidtrymuvanu yevropeisku movu.",
      title: "Movy",
    },
    countryPage: {
      nextVacations: "Nastupni shkilni kanikuly",
      noPublicHolidays: "Zaraz nemaie naiblyzhchykh sviat.",
      noRemainingVacations: "Tsogo roku bilshe nemaie zalyshkovykh kanikul.",
      noVacationData: "Dani pro shkilni kanikuly tymchasovo nedostupni.",
      publicHolidays: "Sviatkovi dni",
      remainingVacations: "Zalyshok kanikul tsogo roku",
      updatedAt: "Ostannia synkhronizatsiia",
    },
    countdown: {
      current: "Zaraz",
      days: "Dni",
      ended: "Zaversheno",
      hours: "Hodyny",
      minutes: "Khvylyny",
      past: "Mynulo",
      remaining: "Zalyshylosia",
      seconds: "Sekundy",
      startsIn: "Pochatok cherez",
      upcoming: "Nezabarom",
    },
    common: {
      allRightsReserved:
        "ZoneVacances. Usi prava zakhyshcheni. Kalendarі ta shkilni zony nadani lyshe dlia informatsii.",
      holiday: "Sviatkovyi den",
      noData: "Nemaie danykh",
      publicSources: "Publichni dzherela",
      search: "Poshuk",
      tenYears: "10 rokiv",
      unavailable: "Tymchasovo nedostupno",
    },
  },
};

function mergeDictionary(base: Dictionary, partial?: Partial<Dictionary>): Dictionary {
  if (!partial) {
    return base;
  }

  return {
    nav: {
      ...base.nav,
      ...partial.nav,
    },
    home: {
      ...base.home,
      ...partial.home,
    },
    countriesPage: {
      ...base.countriesPage,
      ...partial.countriesPage,
    },
    languagePage: {
      ...base.languagePage,
      ...partial.languagePage,
    },
    countryPage: {
      ...base.countryPage,
      ...partial.countryPage,
    },
    countdown: {
      ...base.countdown,
      ...partial.countdown,
    },
    common: {
      ...base.common,
      ...partial.common,
    },
  };
}

export function getDictionary(locale: AppLocale) {
  return mergeDictionary(ENGLISH_DICTIONARY, PARTIAL_DICTIONARIES[locale]);
}

export function getLocalizedCountryName(
  isoCode: string,
  locale: AppLocale,
  fallback: string,
) {
  try {
    const displayNames = new Intl.DisplayNames([locale], {
      type: "region",
    });

    return displayNames.of(isoCode.toUpperCase()) ?? fallback;
  } catch {
    return fallback;
  }
}

export function getLanguageNativeLabel(locale: AppLocale) {
  const staticLabel = LANGUAGE_NATIVE_LABELS[locale];

  if (staticLabel) {
    return staticLabel;
  }

  try {
    const displayNames = new Intl.DisplayNames([locale], {
      type: "language",
    });

    return displayNames.of(locale) ?? locale.toUpperCase();
  } catch {
    return locale.toUpperCase();
  }
}

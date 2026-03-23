"use client";

import { useEffect } from "react";
import type { AppLocale } from "@/lib/types";

export function LocaleHtmlUpdater({ locale }: { locale: AppLocale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

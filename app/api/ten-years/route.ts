import { NextResponse } from "next/server";
import { getTenYearVacationData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getTenYearVacationData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Impossible de recuperer les vacances scolaires sur 10 ans.",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}

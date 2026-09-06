import type { APIRoute } from "astro";
import { isDatabaseConfigured } from "@/db/client";
import { listMatches, saveMatch } from "@/db/repositories/matches";
import { matchStateSchema } from "@/domain/match";

export const GET: APIRoute = async ({ url }) => {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { data: [], storage: "local", message: "Neon no está configurado." },
      { status: 200 },
    );
  }

  const limit = Number(url.searchParams.get("limit") ?? 30);
  const data = await listMatches(limit);
  return Response.json({ data, storage: "neon" });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { message: "Neon no está configurado." },
      { status: 503 },
    );
  }

  const parsed = matchStateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { message: "El combate no es válido.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  return Response.json({ data: await saveMatch(parsed.data) }, { status: 201 });
};

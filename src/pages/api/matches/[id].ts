import type { APIRoute } from "astro";
import { isDatabaseConfigured } from "@/db/client";
import { findMatch, saveMatch } from "@/db/repositories/matches";
import { matchStateSchema } from "@/domain/match";

export const GET: APIRoute = async ({ params }) => {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { message: "Neon no está configurado." },
      { status: 503 },
    );
  }

  const match = await findMatch(params.id ?? "");
  if (!match) {
    return Response.json(
      { message: "Combate no encontrado." },
      { status: 404 },
    );
  }
  return Response.json({ data: match });
};

export const PUT: APIRoute = async ({ params, request }) => {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { message: "Neon no está configurado." },
      { status: 503 },
    );
  }

  const parsed = matchStateSchema.safeParse(await request.json());
  if (!parsed.success || parsed.data.id !== params.id) {
    return Response.json(
      { message: "El combate no es válido." },
      { status: 400 },
    );
  }

  return Response.json({ data: await saveMatch(parsed.data) });
};

# Contribuir a Tatami Score

## Flujo de trabajo

1. Lee `README.md` y `docs/ARCHITECTURE.md`.
2. Mantén cada cambio enfocado en una sola capacidad.
3. Si cambia el comportamiento del producto, actualiza `docs/PRODUCT.md`.
4. Si cambia el esquema, genera y revisa una migración Drizzle.
5. Ejecuta `npm run check` y `npm run build` antes de entregar.
6. Para atletas o ranking, respeta el plan y las reglas versionadas de
   `docs/ATHLETES_AND_RANKING.md`; no ajustes puntajes directamente en componentes.

## Convenciones

- TypeScript estricto; evita `any`.
- Componentes en `PascalCase` y funciones en `camelCase`.
- Los componentes visuales no contienen reglas del deporte.
- Las reglas y cálculos deben ser funciones puras dentro de `src/domain`.
- Los accesos a datos pasan por repositorios en `src/db/repositories`.
- Valida entradas externas con Zod.
- Todo botón solo-icono debe tener nombre accesible.
- El objetivo táctil mínimo es 44 px; para puntuar se prefieren 56 px.
- No importes archivos desde `stitch_tatami_score_bjj/` en producción.

## Commits sugeridos

Usa mensajes cortos e imperativos, por ejemplo:

```text
feat: agrega control del cronómetro
fix: conserva el tiempo al pausar
docs: explica el flujo de migraciones
```

## Cambios de base de datos

Nunca edites producción de forma manual. Modifica `src/db/schema.ts`, genera la
migración y pruébala primero en una rama de Neon.

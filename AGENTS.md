# Instrucciones para agentes

- Lee `README.md`, `docs/ARCHITECTURE.md` y `docs/PRODUCT.md` antes de cambiar el producto.
- Conserva `stitch_tatami_score_bjj/` como referencia; no lo uses como fuente de producción.
- Mantén TypeScript estricto y reglas de dominio fuera de los componentes.
- Usa `apply_patch` para ediciones manuales.
- No escribas secretos ni cadenas de conexión en el repositorio.
- Para cambios de esquema, usa Drizzle y genera una migración versionada.
- Antes de entregar, ejecuta `npm run check` y `npm run build`.
- Actualiza la documentación cuando cambien arquitectura, datos o alcance.

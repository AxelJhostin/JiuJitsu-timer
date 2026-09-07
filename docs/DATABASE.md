# Base de datos y Neon

## Elección

Se usa Lakebase Postgres en Neon. El volumen inicial es pequeño y relacional:
combates y sus acciones. No se necesita almacenamiento de objetos porque no se
guardan fotos ni archivos.

Drizzle es la única herramienta autorizada para administrar el esquema y las
migraciones.

## Modelo inicial

```text
matches 1 ─── N match_events
```

### `matches`

Guarda configuración, estado y resultado consolidado del combate.

- Identificador UUID.
- Torneo, tatami y categoría.
- Modalidad y reglamento/version.
- Datos mínimos de las dos esquinas.
- Duración y tiempo restante.
- Marcadores consolidados.
- Estado, ganador y método de victoria.
- Fechas de creación, inicio y finalización.

### `match_events`

Bitácora ordenada de acciones.

- Identificador UUID y combate padre.
- Esquina afectada.
- Tipo de acción y valor.
- Etiqueta técnica.
- Tiempo restante al registrar la acción.
- Fecha y orden secuencial.

## Conexiones

- `DATABASE_URL`: conexión agrupada (`-pooler`) para el tráfico normal.
- `DATABASE_URL_UNPOOLED`: conexión directa para migraciones.

No intercambies estas variables. Las migraciones requieren estado de sesión que
el pool transaccional no garantiza.

## Configuración

1. Crea o selecciona un proyecto en Neon.
2. Vincula el proyecto con `neon link` si utilizas la CLI.
3. Obtén las variables con `neon env pull`.
4. Verifica que `.env` esté ignorado por Git.
5. Genera la migración con `npm run db:generate`.
6. Prueba la migración en una rama de Neon.
7. Aplica con `npm run db:migrate`.

### Variables en Vercel

Para que la sincronización funcione en los despliegues, registra solamente
`DATABASE_URL` como variable de entorno de Vercel, tanto en Production como en
Preview. Usa la URL agrupada (`-pooler`) para esta variable. La URL directa
`DATABASE_URL_UNPOOLED` no se configura en Vercel: se reserva para ejecutar
migraciones desde un entorno seguro.

## Flujo por ramas

Cada rama Git que cambie el esquema debería usar una rama equivalente de Neon:

```text
git:  feat/match-history
neon: dev-match-history
```

Antes de integrar, revisa el diff de esquema y prueba contra datos parecidos a
producción.

## Privacidad y retención

No se almacenan imágenes, documentos, correos ni contraseñas. Los nombres de los
competidores siguen siendo datos personales: deben recolectarse únicamente para
la operación del torneo y eliminarse cuando la política del organizador lo
requiera.

## Evolución futura: academia y ranking

La próxima expansión introduce primero `academies`, `accounts`,
`academy_memberships` y `academy_invites`, y después `athletes`,
`athlete_belt_history`, `match_participants` y `ranking_entries`. `matches`
recibirá una referencia de academia durante la transición. Las entradas de
ranking serán derivadas, inmutables y versionadas por regla.

Todo dato interno se consultará con `academy_id` y una membresía validada en el
servidor. Los códigos de invitación se almacenarán como hashes, nunca como texto
plano ni contraseñas. El diseño completo está en el [Plan de academia, atletas,
cuentas y ranking interno](ATHLETES_AND_RANKING.md). No se incluyen todavía para
evitar modelar funciones que aún no son parte del producto actual.

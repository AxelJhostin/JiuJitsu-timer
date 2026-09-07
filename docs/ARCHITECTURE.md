# Arquitectura

## Resumen

Tatami Score utiliza Astro como marco de aplicación y React únicamente para las
superficies con interacción continua. Esto mantiene las páginas simples ligeras
y concentra la complejidad en el marcador.

En Vercel, Astro usa el adaptador `@astrojs/vercel`. Este transforma las rutas
renderizadas en servidor y los endpoints `/api/*` en funciones de Vercel. No se
usa un servidor Node standalone ni se publica `dist/` como un sitio estático.

```text
Navegador
  ├─ Páginas Astro renderizadas en servidor
  ├─ Isla React MatchController
  └─ almacenamiento local de respaldo
             │ HTTPS / JSON
             ▼
Endpoints Astro /api
  ├─ validación Zod
  ├─ servicios de aplicación
  └─ repositorios Drizzle
             │
             ▼
Lakebase Postgres en Neon
```

## Capas

### Presentación

`src/pages`, `src/layouts` y `src/components` contienen rutas y componentes. Los
componentes reciben datos y emiten eventos; no deciden reglas IBJJF.

### Dominio

`src/domain` contiene tipos, reglas de puntuación, desempate y reducción del
estado del combate. No importa Astro, React, Drizzle ni APIs del navegador.

### Aplicación

Los controladores coordinan casos de uso: crear combate, agregar acción,
deshacer y finalizar. La interfaz usa el mismo modelo tanto con persistencia
local como remota.

### Datos

`src/db` contiene el esquema Drizzle, cliente y repositorios. Solo se importa en
archivos ejecutados en el servidor. `DATABASE_URL` nunca llega al navegador.

## Límites de componentes

```text
AppShell
  ├─ Brand
  ├─ TopBar
  ├─ BottomNavigation
  └─ Page content

MatchController (React island)
  ├─ MatchTimer
  ├─ CompetitorScoreCard × 2
  │    ├─ ScoreDisplay
  │    ├─ MatchCounters
  │    └─ QuickScoreButtons
  ├─ LastAction
  ├─ MatchControls
  ├─ ActionSheet
  └─ FinishMatchDialog
```

## Estado del marcador

El estado se administra con `useReducer` alrededor de un reducer puro. Cada
cambio genera una acción de dominio inmutable. El historial permite revertir la
última acción sin cálculos inversos frágiles.

La fuente de verdad durante un combate activo es el navegador del operador. Se
crean instantáneas locales después de cada cambio y se persiste al servidor en
puntos seguros. Una futura sincronización en tiempo real podrá reemplazar el
adaptador sin cambiar los componentes.

Los botones de puntuación directa crean eventos genéricos (`Puntos +2`, `+3` o
`+4`). Si el operador dispone de tiempo, puede etiquetar el último evento con
una técnica compatible sin alterar su puntaje ni la cronología. La sugerencia
se puede silenciar por combate y esa preferencia queda guardada localmente con
el identificador del combate.

## Rutas

| Ruta                | Propósito                            |
| ------------------- | ------------------------------------ |
| `/`                 | Inicio y acceso rápido.              |
| `/combates/nuevo`   | Configuración completa.              |
| `/combates/rapido`  | Nombres y duración únicamente.       |
| `/marcador`         | Operación del combate activo.        |
| `/resumen`          | Último resultado.                    |
| `/historial`        | Resultados guardados.                |
| `/historial/[id]`   | Acta y cronología de un combate.     |
| `/proyeccion`       | Marcador público de pantalla grande. |
| `/reglas`           | Reglamento y tiempos configurados.   |
| `/api/matches`      | Crear/listar combates.               |
| `/api/matches/[id]` | Consultar/actualizar un combate.     |

## Escalabilidad

- Los reglamentos implementan una interfaz común y se identifican por versión.
- El almacenamiento se accede mediante repositorios intercambiables.
- Los eventos conservan la cronología necesaria para auditoría y tiempo real.
- Las entidades de torneo y bracket podrán agregarse sin alterar el marcador.
- Los estilos dependen de tokens semánticos, no de colores pegados a cada vista.

## Estrategia de pruebas

- Unitarias: reducer, puntuación, desempate y serialización del reloj.
- Componentes: acciones críticas y accesibilidad.
- Integración: endpoints y repositorios sobre una rama de Neon.
- E2E futura: crear, puntuar, pausar, deshacer y finalizar un combate.

## Señales del cronómetro

`src/lib/timer-feedback.ts` encapsula audio y vibración del navegador para que
el marcador no dependa de archivos multimedia. El operador recibe un tono al
iniciar o reanudar, señales y vibración breve durante los últimos diez segundos,
y una alarma con vibración al finalizar. Si el dispositivo o navegador no
permite audio/vibración, el cronómetro continúa funcionando sin bloquearse.

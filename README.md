# Tatami Score

Marcador web mobile-first para operar combates de Brazilian Jiu-Jitsu con una
interfaz rápida, legible y preparada para torneos. La primera versión sigue el
sistema de puntuación IBJJF y conserva la identidad visual creada en Google
Stitch.

## Estado del proyecto

Tatami Score está en construcción. El objetivo del primer hito es entregar un
flujo completo y usable:

1. Preparar un combate completo.
2. Iniciar un combate rápido indicando solo nombres y duración.
3. Iniciar y controlar el cronómetro.
4. Registrar puntos, ventajas y penalizaciones.
5. Deshacer acciones.
6. Finalizar el combate y determinar el resultado.
7. Consultar el resumen y el historial.
8. Mostrar una vista pública de proyección.

Los archivos originales exportados por Stitch permanecen en
`stitch_tatami_score_bjj/` como referencia de diseño. El código de producción
vive en `src/` y no depende del HTML generado por Stitch.

## Stack

- [Astro](https://astro.build/) para rutas, renderizado y endpoints.
- React para las islas interactivas del marcador y los formularios.
- TypeScript en modo estricto.
- CSS propio basado en tokens para conservar el sistema visual.
- Drizzle ORM para esquema y migraciones.
- Lakebase Postgres en Neon como persistencia.
- Zod para validar datos en los límites de la aplicación.

## Principios

- Mobile-first sin degradar la experiencia de escritorio.
- Componentes pequeños y reutilizables.
- La lógica IBJJF vive fuera de la interfaz.
- El servidor es la única capa que conoce las credenciales de la base de datos.
- El marcador puede seguir funcionando localmente si Neon no está configurado.
- Acciones críticas confirmables y toda puntuación reversible.
- Accesibilidad por teclado, objetivos táctiles amplios y contraste alto.

## Estructura prevista

```text
src/
  components/
    app/          Navegación y estructura global
    match/        Componentes del marcador
    ui/           Primitivas visuales reutilizables
  db/             Cliente, esquema y repositorios de Drizzle
  domain/         Reglas, tipos y funciones puras del combate
  layouts/        Layouts Astro
  pages/          Rutas y endpoints
  stores/         Estado interactivo del cliente
  styles/         Tokens y estilos globales
docs/             Documentación de producto y arquitectura
drizzle/          Migraciones SQL versionadas
public/           Recursos públicos y marca
stitch_tatami_score_bjj/
                  Material de referencia exportado por Stitch
```

La descripción detallada está en [Arquitectura](docs/ARCHITECTURE.md).

## Desarrollo local

Requisitos:

- Node.js 22 o superior.
- npm 10 o superior.

Instalación:

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

La aplicación funciona sin `DATABASE_URL`: en ese modo el historial se guarda
solo en el navegador. Para persistencia compartida, configura Neon según
[Base de datos](docs/DATABASE.md).

## Despliegue en Vercel

Tatami Score utiliza renderizado en servidor y endpoints para sincronizar
combates con Neon. El adaptador `@astrojs/vercel` empaqueta las páginas y la
API para Vercel; no configures un directorio de salida manual.

1. Importa el repositorio en Vercel con la raíz del proyecto como **Root
   Directory** y Astro como framework.
2. Conserva `npm run build` como comando de compilación y deja vacío **Output
   Directory**.
3. Define `DATABASE_URL` para los entornos Production y Preview si deseas
   persistencia remota. No subas el archivo `.env` ni `DATABASE_URL_UNPOOLED`.
4. Haz un nuevo despliegue después de subir los cambios.

Sin `DATABASE_URL`, la interfaz sigue funcionando con almacenamiento local. La
variable `DATABASE_URL_UNPOOLED` se usa exclusivamente desde una máquina segura
para ejecutar migraciones con Drizzle, nunca durante el despliegue.

## Instalar en el celular o computadora

Tatami Score es una aplicación web instalable (PWA). Tras visitar el sitio una
vez con conexión, Chrome y Edge mostrarán **Instalar aplicación** cuando esté
disponible. En iPhone o iPad usa Compartir → **Agregar a pantalla de inicio**.
La aplicación instalada se abre en su propia ventana y conserva los datos
locales del dispositivo; Neon seguirá sincronizando al finalizar el combate si
hay conexión.

## Comandos

| Comando                | Uso                                            |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Inicia Astro en desarrollo.                    |
| `npm run build`        | Compila la aplicación para producción.         |
| `npm run preview`      | Sirve localmente el build.                     |
| `npm run check`        | Valida Astro y TypeScript.                     |
| `npm test`             | Ejecuta pruebas del dominio de puntuación.     |
| `npm run format`       | Formatea Astro, TypeScript, CSS y Markdown.    |
| `npm run format:check` | Comprueba el formato sin modificar archivos.   |
| `npm run db:generate`  | Genera una migración desde el esquema Drizzle. |
| `npm run db:migrate`   | Aplica migraciones con la conexión directa.    |
| `npm run db:studio`    | Abre Drizzle Studio.                           |

## Variables de entorno

| Variable                | Requerida        | Uso                                                |
| ----------------------- | ---------------- | -------------------------------------------------- |
| `DATABASE_URL`          | No               | Conexión agrupada para consultas de la aplicación. |
| `DATABASE_URL_UNPOOLED` | Solo migraciones | Conexión directa para Drizzle Kit.                 |

Nunca uses variables `PUBLIC_` para credenciales. En Astro esas variables se
incluyen en el cliente.

## Documentación

- [Producto y alcance](docs/PRODUCT.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Base de datos y Neon](docs/DATABASE.md)
- [Sistema de diseño](docs/DESIGN_SYSTEM.md)
- [Decisiones técnicas](docs/DECISIONS.md)
- [Roadmap](docs/ROADMAP.md)
- [Plan de academia, atletas, cuentas y ranking interno](docs/ATHLETES_AND_RANKING.md)
- [Cómo contribuir](CONTRIBUTING.md)

## Seguridad y privacidad

Tatami Score no necesita fotografías ni documentos de los participantes. Se
guardan únicamente datos operativos del combate: nombres, academias opcionales,
categoría, tiempos, puntuación, resultado y cronología de acciones.

No subas archivos `.env`, cadenas de conexión ni datos reales sensibles al
repositorio.

## Referencia normativa

La aplicación ayuda a registrar decisiones; no sustituye el criterio del
árbitro. Los valores de puntuación se modelan como configurables para poder
actualizar el reglamento sin reescribir la interfaz.

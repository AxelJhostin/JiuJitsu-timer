# Sistema de diseño

## Origen

El sistema visual parte de la propuesta de Google Stitch ubicada en
`stitch_tatami_score_bjj/tatami_score/DESIGN.md`. Esta documentación normaliza
esa propuesta para componentes de producción.

## Personalidad

Instrumento deportivo, preciso y táctil. La interfaz debe sentirse sólida bajo
presión y seguir siendo legible en gimnasios iluminados o pantallas lejanas.

## Colores semánticos

| Token                    | Valor     | Uso                     |
| ------------------------ | --------- | ----------------------- |
| `--color-canvas`         | `#0b1118` | Fondo principal.        |
| `--color-surface`        | `#161c23` | Tarjetas.               |
| `--color-surface-raised` | `#252a32` | Controles elevados.     |
| `--color-border`         | `#2a3c50` | Separación estructural. |
| `--color-text`           | `#f4f7fb` | Información crítica.    |
| `--color-text-muted`     | `#94a3b8` | Metadatos.              |
| `--color-blue`           | `#4d8eff` | Esquina azul.           |
| `--color-red`            | `#ef334d` | Esquina roja.           |
| `--color-advantage`      | `#f6ad3c` | Ventajas.               |
| `--color-penalty`        | `#f43f5e` | Penalizaciones.         |
| `--color-live`           | `#34d399` | Reloj activo.           |

Nunca uses solo color para comunicar un estado. Acompáñalo con texto, icono o
posición consistente.

## Tipografía

- Oswald: títulos deportivos, competidores y puntuación.
- JetBrains Mono: reloj, valores y tiempos.
- Inter: formularios, navegación y texto auxiliar.

Se cargan con respaldo de sistema para que la interfaz siga siendo funcional sin
conexión a fuentes externas.

## Espacio y forma

- Escala base: 4, 8, 12, 16, 24, 32 y 48 px.
- Radio pequeño: 4 px.
- Radio de panel: 8 px.
- Radio grande excepcional: 12 px.
- Sin píldoras en controles principales.
- Bordes y cambio tonal antes que sombras difusas.

## Responsive

- Menos de 768 px: composición vertical, navegación inferior y formularios en
  una columna.
- Desde 768 px: tarjetas más amplias y acciones paralelas.
- Desde 1024 px: esquinas en dos columnas y navegación lateral/superior cuando
  beneficie la operación.
- Proyección: lienzo horizontal sin controles y tipografía fluida.

## Accesibilidad

- Objetivo táctil mínimo de 44 × 44 px.
- Botones de puntuación de al menos 56 px.
- Foco visible de 2 px.
- `aria-live` para reloj, última acción y confirmaciones.
- Modales con foco atrapado y cierre explícito.
- Respeto a `prefers-reduced-motion`.

## Logo

El emblema combina un tatami hexagonal, las esquinas azul/roja y un reloj. Debe
mantener espacio libre equivalente al 25 % de su ancho y no debe deformarse.

# Atletas, cuentas y ranking interno

**Estado:** planificado. Este documento no cambia todavía el marcador, las
rutas ni el esquema de producción.

## Objetivo

Extender Tatami Score para la operación interna de una academia: registrar
atletas, conservar su evolución de cintas, vincularlos a combates y ofrecer un
ranking comprensible que reconozca la dificultad relativa del rival.

El marcador actual seguirá aceptando competidores escritos manualmente. Eso
permite operar torneos, visitas o invitados sin crear una ficha.

## Principios acordados

- Ganar es ganar: una victoria por puntos, sumisión o decisión vale lo mismo.
- Vencer a una cinta superior vale más que vencer a una cinta inferior.
- El ranking se puede filtrar por categorías; Gi y No-Gi nunca se mezclan si el
  operador elige uno de esos filtros.
- La cinta usada para calcular un combate es la que cada atleta tenía el día
  del combate, no la cinta actual.
- Solo los combates que un responsable marque como válidos afectarán el
  ranking. Los rolls libres se pueden registrar sin puntuar.
- El ranking y el historial deben ser auditables: una corrección de combate o
  de cinta debe poder recalcular los resultados afectados.

## Atleta no es necesariamente cuenta

En la primera fase se crearán **fichas de atletas** administradas por la
academia. No se obligará a cada atleta a iniciar sesión para poder ser elegido
en un combate.

Las **cuentas** se incorporarán después para que un atleta pueda ver su propio
perfil, historial y ranking. No se almacenarán contraseñas: la autenticación se
delegará a un proveedor seguro. Los roles iniciales previstos son:

- Administrador: atletas, cintas, combates válidos y ranking.
- Operador o entrenador: crear combates y registrar resultados según permisos.
- Atleta: lectura de su propio perfil e historial.

## Ranking Academy Rating

Cada atleta tendrá un puntaje general interno llamado **Academy Rating**. La
clasificación se calcula exclusivamente con combates marcados como válidos para
ranking.

### Nivel de cinta

| Cinta  | Nivel |
| ------ | ----: |
| Blanca |     1 |
| Azul   |     2 |
| Morada |     3 |
| Marrón |     4 |
| Negra  |     5 |

### Puntaje por victoria

La puntuación inicial es deliberadamente fácil de explicar:

```text
puntos de victoria = limitar(12 + 4 × (nivel del rival - nivel propio), 4, 28)
```

`limitar` mantiene el resultado entre 4 y 28 puntos.

| Ejemplo               | Puntos |
| --------------------- | -----: |
| Blanca vence a blanca |     12 |
| Blanca vence a azul   |     16 |
| Blanca vence a morada |     20 |
| Blanca vence a negra  |     28 |
| Negra vence a blanca  |      4 |

El método de victoria no agrega ni quita puntos. No hay bonus por sumisión.

### Aspectos pendientes antes de programar el cálculo

- **Derrotas:** la recomendación inicial es que resten 0 puntos y aparezcan en
  el récord. Si la academia prefiere un sistema tipo Elo, se definirá una
  deducción explícita y se migrará el cálculo como una nueva versión.
- **Empates o decisiones sin ganador:** no entregan puntos hasta acordar una
  regla específica.
- **Temporadas:** la primera tabla puede ser histórica; los filtros por mes,
  trimestre o temporada se incorporarán cuando la academia defina su calendario.

Ninguna de estas decisiones se implementará de forma implícita.

## Filtros de la tabla

La pantalla de ranking tendrá como mínimo:

- General: todos los combates válidos.
- Cinta: resultados disputados mientras el atleta tenía la cinta elegida.
- Modalidad: Gi, No-Gi o ambas.

Peso, edad, género u otras categorías se incorporarán solamente cuando el
formulario de combate los guarde como campos estructurados. No se deben inferir
de la cadena de texto actual de `division`.

## Perfil del atleta

Cada ficha mostrará:

- Cinta actual y cronología de ascensos.
- Academy Rating, posición y filtros aplicables.
- Récord de victorias, derrotas y combates válidos.
- Historial completo de luchas con enlace a cada acta.
- Estadísticas separadas para Gi y No-Gi.

## Modelo de datos futuro

| Entidad                | Responsabilidad                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `athletes`             | Ficha mínima del atleta, estado activo y cinta actual.                              |
| `athlete_belt_history` | Ascensos con cinta, fecha y nota opcional.                                          |
| `match_participants`   | Relación entre un combate, cada esquina, el atleta opcional y la cinta instantánea. |
| `ranking_entries`      | Ajustes de rating inmutables por combate, para auditoría y recálculo.               |
| `accounts`             | Identidad externa y rol; se crea solo en la fase de acceso personal.                |

Los nombres y academias que hoy viven dentro de `matches` continuarán como
instantáneas históricas. Vincular un atleta no reescribe un combate anterior.

## Fases de implementación

1. **Registro interno:** fichas de atletas, buscador en la preparación de
   combate y opción de invitado manual.
2. **Cintas:** historial de ascensos y captura de cinta instantánea al iniciar
   un combate.
3. **Combates válidos:** marca de elegibilidad para ranking y validación de
   resultados.
4. **Ranking y perfiles:** cálculo versionado, filtros, récord e historial.
5. **Cuentas:** autenticación, roles y vista personal de atleta.

Cada fase tendrá migración Drizzle, pruebas de dominio y una revisión en una
rama de Neon antes de aplicarse a producción.

## Fuera de alcance inicial

- Pagos, inscripciones o perfiles públicos indexables.
- Datos médicos, documentos, fotografías o biometría.
- Ranking público abierto fuera de la academia.
- Cambiar automáticamente una cinta por resultados.

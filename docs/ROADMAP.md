# Roadmap

## Hito 1 — Marcador funcional

- Sistema visual y navegación responsive.
- Configuración de combate.
- Cronómetro resistente a pausas y cambios de pestaña.
- Puntuación, ventajas, penalizaciones y deshacer.
- Finalización, resumen e historial local.
- Modo proyección.
- Esquema y repositorios Neon preparados.

## Hito 2 — Persistencia compartida

- Proyecto y ramas de Neon.
- Migraciones aplicadas.
- API autenticada.
- Recuperación de combate activo desde otro dispositivo.
- Estados de sincronización y reconexión.

## Hito 3 — Academia: cuentas, atletas y ranking interno

Este hito se implementará por fases: base segura y reglas, academia/roles,
invitaciones, atletas/cintas, combates vinculados, ranking/perfil y piloto.
La especificación canónica está en el [Plan de academia, atletas, cuentas y
ranking interno](ATHLETES_AND_RANKING.md).

El ranking será privado por academia, no premiará el método de victoria y
ponderará únicamente la diferencia de cinta del rival. Los invitados manuales
se conservan, pero no aparecen en la clasificación.

## Hito 4 — Operación de torneo

- Torneos y múltiples tatamis.
- Asignación de combates a mesa.
- Roles de organizador, árbitro y pantalla pública.
- Resultados por categoría.

## Hito 5 — Llaves

- Brackets de eliminación.
- Avance automático del ganador.
- Reordenamiento y correcciones auditables.
- Exportación de resultados.

Las funcionalidades se incorporan solo después de validar el hito anterior en un
torneo real.

# Producto y alcance

## Problema

Los marcadores físicos y muchas aplicaciones de BJJ son difíciles de operar,
tienen poca jerarquía visual o mezclan puntuación con administración de torneos.
Tatami Score se concentra en el momento crítico: registrar un combate sin perder
atención del tatami.

## Usuarios

- Operador de mesa o árbitro: controla tiempo y puntuación.
- Organizador: configura el combate y consulta resultados.
- Espectador: observa el modo de proyección.

## Propuesta de valor

Un marcador claro, táctil y confiable que funciona en un teléfono, una tablet o
una pantalla grande, con historial persistente y reglas desacopladas.

## Alcance del primer producto

### Incluido

- Inicio con acceso al combate actual y al último resultado.
- Combate rápido solicitando únicamente nombres y duración.
- Configuración de competidores, academia, torneo, categoría, modalidad y tiempo.
- Puntuación IBJJF: +2, +3, +4, ventaja y penalización.
- Puntuación directa en un toque (+2, +3 o +4); la técnica concreta se puede
  etiquetar después de forma opcional, sin interrumpir la mesa ni volver a
  sugerirse si el operador la descarta para ese combate.
- Cronómetro con iniciar, pausar, reanudar y finalizar.
- Historial reversible de acciones.
- Final por puntos, sumisión, descalificación, abandono, lesión o decisión arbitral.
- Resumen y cronología del combate.
- Historial de combates con acceso al acta y la cronología de cada lucha.
- Señal sonora al iniciar, cuenta regresiva de los últimos diez segundos y
  alarma final con vibración cuando el dispositivo la admite.
- Modo de proyección sin controles operativos.
- Instalación como aplicación web en celular o computadora, con acceso básico
  a contenido visitado sin conexión.
- Persistencia local y sincronización con Neon cuando esté configurado.

### Fuera del primer alcance

- Registro de atletas o academias como entidades maestras.
- Fotografías, documentos o datos biométricos.
- Inscripciones y pagos.
- Brackets completos y avance automático de llaves.
- Streaming de video.
- Autenticación multiusuario y permisos por torneo.
- Sincronización en tiempo real entre varios dispositivos.

## Evolución interna planificada

La siguiente expansión convierte Tatami Score en una herramienta interna de
academia: un profesor crea su academia, invita alumnos con códigos revocables y
cada alumno posee una cuenta personal. Tendrá fichas de atleta, historial de
cintas, perfiles personales y Academy Rating privado filtrable por cinta y
modalidad. No habrá fotos ni archivos en esta etapa. El diseño, las decisiones,
el modelo de datos y las fases están en el [Plan de academia, atletas, cuentas y
ranking interno](ATHLETES_AND_RANKING.md). No forma parte todavía del marcador
actual.

## Flujo principal

```text
Inicio ─┬→ Combate rápido ────────┐
        └→ Preparar combate ──────┴→ Marcador en vivo → Finalizar → Resumen
                                          ↓                         ↓
                                   Modo proyección              Historial
```

## Regla de ganador por tiempo

1. Mayor puntuación.
2. Si empatan, más ventajas.
3. Si empatan, menos penalizaciones.
4. Si continúa el empate, decisión del árbitro.

La sumisión, la descalificación y otros finales explícitos tienen prioridad sobre
el cálculo automático.

## Criterios de experiencia

- Una acción de puntuación común debe requerir como máximo dos toques.
- El operador siempre debe saber si el reloj está activo o pausado.
- Deshacer debe revertir exactamente la última acción.
- No se permite puntuar un combate finalizado.
- El modo de proyección nunca debe exponer controles de edición.
- La interfaz debe seguir siendo legible al 200 % de zoom.

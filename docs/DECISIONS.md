# Decisiones técnicas

## ADR-001: Astro con islas React

**Estado:** aceptada.

Astro resuelve páginas, rutas y endpoints con poco JavaScript. React se limita a
las vistas donde el estado cambia constantemente: configuración y marcador.

## ADR-002: Dominio independiente de la interfaz

**Estado:** aceptada.

El reducer y las reglas IBJJF son TypeScript puro. Esto permite probarlas y
reutilizarlas en otra interfaz sin depender de React.

## ADR-003: Drizzle y Neon

**Estado:** aceptada.

El modelo es relacional, pequeño y auditable. Drizzle mantiene el esquema en
código y Neon aporta Postgres administrado, pooling y ramas de desarrollo.

## ADR-004: Persistencia progresiva

**Estado:** aceptada.

La aplicación inicia sin credenciales usando almacenamiento local. Cuando Neon
está disponible utiliza la API del servidor. Esto facilita desarrollo y protege
el combate activo frente a interrupciones de red.

## ADR-005: Eventos más estado consolidado

**Estado:** aceptada.

Cada acción se guarda como evento y el combate conserva su marcador consolidado.
La lectura es rápida y la cronología sigue disponible para auditoría.

## ADR-006: Sin autenticación en el primer hito

**Estado:** aceptada temporalmente.

La primera versión valida el producto en operación local. Antes de exponer
escrituras públicamente se añadirá autenticación y autorización por torneo.

## ADR-007: Adaptador de Astro para Vercel

**Estado:** aceptada.

La aplicación tiene páginas renderizadas en servidor y endpoints para Neon.
Por ello se usa `@astrojs/vercel` en lugar de `@astrojs/node`: Vercel requiere
que esas rutas se empaqueten como funciones de su plataforma. El adaptador de
Node standalone queda reservado para una futura publicación en infraestructura
propia.

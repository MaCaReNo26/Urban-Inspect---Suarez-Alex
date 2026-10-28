# UrbanInspect - Sistema de Inspección Urbana

Aplicación móvil híbrida desarrollada con **Ionic Framework (Standalone Components)** y **Capacitor**, diseñada para inspectores de campo encargados de registrar, geolocalizar, fotografiar y dar seguimiento a incidencias urbanas (baches, luminarias dañadas, etc.).

---

## Características Principales y Arquitectura
- **Listado y Paginación Remota (Tab 1):** Consumo de datos desde una API REST en la nube (**MockAPI**) con soporte de *Infinite Scroll* y *Pull-to-Refresh* manual para evitar problemas de caché en dispositivos móviles[cite: 1, 2].
- **Registro en Campo (Tab 2):** Formulario con validaciones estrictas, captura de coordenadas reales mediante `@capacitor/geolocation`, consulta meteorológica en tiempo real con **Open-Meteo API**, y compresión inteligente de evidencias fotográficas para evitar errores de servidor (*HTTP 413 Payload Too Large*)[cite: 1, 2].
- **Seguimiento Local (Tab 3):** Almacenamiento privado y persistente en el dispositivo mediante `@capacitor/preferences` para marcar incidencias prioritarias sin saturar el servidor central[cite: 1, 2].
- **Gestión de Estados (Modal de Detalles):** Visualización detallada de la incidencia con opción de actualizar estados (*Pendiente* ➔ *En Proceso* ➔ *Resuelta*) requiriendo obligatoriamente una observación de cierre[cite: 1, 2].
- **Diseño Monocromático Profesional:** Interfaz adaptada con una paleta de colores basada en negro y rojo, iconos personalizados y *Splash Screen* nativa generada con `@capacitor/assets`[cite: 1, 2].

---

## Requisitos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/MaCaReNo26/Urban-Inspect---Suarez-Alex.git](https://github.com/MaCaReNo26/Urban-Inspect---Suarez-Alex.git)
   cd urbaninspect

## Evidencia

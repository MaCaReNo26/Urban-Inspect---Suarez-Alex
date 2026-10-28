# UrbanInspect - Sistema de Inspección Urbana

Aplicación móvil híbrida desarrollada con **Ionic Framework (Standalone Components)** y **Capacitor**, diseñada para inspectores de campo encargados de registrar, geolocalizar, fotografiar y dar seguimiento a incidencias urbanas (baches, luminarias dañadas, etc.).

---

## Características Principales y Arquitectura
- **Listado y Paginación Remota (Tab 1):** Consumo de datos desde una API REST en la nube (**MockAPI**) con soporte de *Infinite Scroll* y *Pull-to-Refresh* manual para evitar problemas de caché en dispositivos móviles.
- **Registro en Campo (Tab 2):** Formulario con validaciones estrictas, captura de coordenadas reales mediante `@capacitor/geolocation`, consulta meteorológica en tiempo real con **Open-Meteo API**, y compresión inteligente de evidencias fotográficas para evitar errores de servidor (*HTTP 413 Payload Too Large*).
- **Seguimiento Local (Tab 3):** Almacenamiento privado y persistente en el dispositivo mediante `@capacitor/preferences` para marcar incidencias prioritarias sin saturar el servidor central.
- **Gestión de Estados (Modal de Detalles):** Visualización detallada de la incidencia con opción de actualizar estados (*Pendiente* ➔ *En Proceso* ➔ *Resuelta*) requiriendo obligatoriamente una observación de cierre.
- **Diseño Monocromático Profesional:** Interfaz adaptada con una paleta de colores basada en negro y rojo, iconos personalizados y *Splash Screen* nativa generada con `@capacitor/assets`.

---

## Requisitos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MaCaReNo26/Urban-Inspect---Suarez-Alex.git
   cd urbaninspect


## Tecnologías utilizadas

- **Ionic:** desarrollo de la interfaz de la aplicación móvil.
- **Angular:** estructura y lógica de la aplicación.
- **Capacitor:** integración y generación de la aplicación para Android.
- **MockAPI:** servicio utilizado para gestionar los datos de las incidencias.

## Ejecución del proyecto

Instalar las dependencias:

```bash
npm install
```

Ejecutar la aplicación en el navegador:

```bash
ionic serve
```

Compilar y sincronizar el proyecto Android:

```bash
ionic build
ionic capacitor add android
ionic capacitor open android
```

## Evidencia

Pantalla de Instalación & Splash / Icono

<p align="center">
  <img src="https://github.com/user-attachments/assets/4a54f632-9dec-4ec0-a564-5cbfbb164400" alt="Evidencia de instalación de UrbanInspect" width="320">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/89846fcc-5239-4361-9748-7cad7faf35a0" alt="Splash Screen de UrbanInspect" width="280">
  &nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/20520556-324d-4824-ad85-226f9ee9212d" alt="Icono y pantalla de inicio de UrbanInspect" width="280">
</p>

Permisos de Geolocalización

<p align="center">
  <img src="https://github.com/user-attachments/assets/7f38b17f-2299-4856-9e21-b3dd710a724a" alt="Solicitud de permisos de geolocalización" width="280">
</p>

Pestañas de Mostrar Incidencias, Ingresar Incidencias, Guardar Incidencias

<p align="center">
  <img src="https://github.com/user-attachments/assets/9246059b-9a5d-4404-b9cf-20800653c4db" alt="Pantalla de visualización de incidencias" width="280">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4d6550f9-2855-47ef-b9be-8818f198971b" alt="Formulario de registro de incidencias" width="280">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/cf97fde1-f931-4deb-b078-5b3a07d25a6a" alt="Pantalla de seguimiento de incidencias" width="280">
</p>


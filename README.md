Un Portal Inmobiliario robusto y ágil construido con Next.js, React, Node.js y MySQL, diseñado para la búsqueda avanzada de propiedades, la gestión de listados y la visualización de detalles. Ofrece una interfaz de usuario limpia y rápida gracias a Pico.css y React Query, con validaciones de datos y optimización para SEO.

Portal Inmobiliario Moderno

Captura de pantalla de la interfaz de usuario del portal.

Introducción

Este proyecto es un Portal Inmobiliario completo, diseñado para ofrecer una experiencia fluida y eficiente tanto para usuarios que buscan propiedades como para agentes que gestionan listados. Construido con un stack moderno y ligero, prioriza la velocidad, seguridad y una excelente experiencia de usuario (UI/UX), además de estar optimizado para los motores de búsqueda (SEO).

Características Actuales

🚀 Búsqueda Avanzada de Propiedades:

Permite a los usuarios filtrar propiedades por ciudad, tipo (Casa, Apartamento, Terreno, etc.), rango de precios y número mínimo de habitaciones. Los resultados se actualizan en tiempo real sin recargar la página.

🏡 Listado Detallado de Propiedades:

Muestra un listado atractivo de propiedades disponibles, con imágenes y un resumen clave.

🔍 Vista Detallada de Propiedad:

Cada propiedad tiene su propia página dedicada donde los usuarios pueden ver todos los detalles: descripción completa, precio, dirección, número de habitaciones y baños, área, tipo, estado e imágenes.

➕ Añadir Nuevas Propiedades:

Ofrece un formulario intuitivo para que los agentes puedan registrar nuevas propiedades en el sistema, incluyendo todos sus detalles relevantes y URLs de imágenes.

✅ Validación de Datos Robusta:

Implementa validaciones de datos en tiempo real tanto en el frontend (formulario) como en el backend (servidor) utilizando Zod, asegurando la integridad y calidad de la información.

⚡ Rendimiento Optimizado:

Diseñado para ser rápido y eficiente, incluso en dispositivos con recursos limitados. La carga de datos y la interacción se realizan sin recargas de página completas.

Tecnologías Utilizadas (El Stack)

Este portal ha sido construido utilizando las siguientes herramientas y tecnologías:

Frontend

Next.js: Framework de React para aplicaciones web robustas y optimizadas para SEO.

React: Biblioteca de JavaScript para construir interfaces de usuario interactivas y componentes reutilizables.

Pico.css: Un framework CSS minimalista y ligero que proporciona estilos limpios y accesibles con un tamaño total muy reducido, ideal para rendimiento en laptops antiguas.

React Query: Potente biblioteca para la gestión, caché y sincronización de estados del servidor en aplicaciones React.

React Hook Form: Librería eficiente para la gestión de formularios en React, con integración sencilla de validaciones.

Zod: Biblioteca de declaración y validación de esquemas TypeScript/JavaScript para asegurar la validez de los datos.

Backend

Node.js: Entorno de ejecución de JavaScript del lado del servidor.

Express: Framework de Node.js rápido, flexible y minimalista para construir APIs y servidores.

mysql2: Cliente de MySQL para Node.js, optimizado para rendimiento y seguridad (soporte para prepared statements).

Zod: Utilizado también en el backend para la validación de la entrada de datos API.

uuid: Utilidad para la generación de identificadores únicos universales (UUIDs).

CORS: Middleware para Express que gestiona las políticas de "Cross-Origin Resource Sharing", permitiendo la comunicación segura entre el frontend y el backend en diferentes puertos/dominios.

Base de Datos

MySQL: Sistema de gestión de bases de datos relacionales robusto y ampliamente utilizado. (Configurado para uso local, típicamente con XAMPP).

Cómo Empezar

Sigue estos pasos para poner el proyecto en marcha en tu máquina local.

1\. Prerequisitos

Node.js (v18.x o superior)

npm (viene con Node.js)

MySQL Server (instalado localmente, por ejemplo, usando XAMPP).

2\. Configuración de MySQL (con XAMPP)

Instala XAMPP: Descárgalo de apachefriends.org. Asegúrate de iniciar el módulo MySQL en el XAMPP Control Panel.

Crea la Base de Datos: Abre phpMyAdmin (botón "Admin" junto a MySQL en XAMPP Control Panel).

En la barra lateral izquierda, haz clic en "New" (Nuevo) o en la pestaña "Bases de datos".

Introduce miportaldb como nombre de la base de datos y haz clic en "Crear".

Crea las Tablas: Ve a la base de datos miportaldb (haz clic en ella en la barra lateral izquierda), luego haz clic en la pestaña "SQL". Pega y ejecuta el siguiente código SQL para crear las tablas necesarias:

\-- TABLA DE USUARIOS

CREATE TABLE IF NOT EXISTS User (

id VARCHAR(36) PRIMARY KEY,

email VARCHAR(255) UNIQUE NOT NULL,

password VARCHAR(255) NOT NULL,

name VARCHAR(255),

createdAt DATETIME DEFAULT CURRENT\_TIMESTAMP,

updatedAt DATETIME DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP

);

\-- TABLA DE AGENTES

CREATE TABLE IF NOT EXISTS Agent (

id VARCHAR(36) PRIMARY KEY,

userId VARCHAR(36) UNIQUE NOT NULL,

phone VARCHAR(20),

agency VARCHAR(255),

FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE

);

\-- TABLA DE PROPIEDADES

CREATE TABLE IF NOT EXISTS Property (

id VARCHAR(36) PRIMARY KEY,

title VARCHAR(255) NOT NULL,

description TEXT NOT NULL,

price FLOAT NOT NULL,

address VARCHAR(255) NOT NULL,

city VARCHAR(255) NOT NULL,

country VARCHAR(255) NOT NULL,

bedrooms INT NOT NULL,

bathrooms FLOAT NOT NULL,

areaSqFt FLOAT NOT NULL,

type ENUM('CASA', 'APARTAMENTO', 'TERRENO', 'OFICINA', 'LOCAL\_COMERCIAL', 'OTROS') NOT NULL,

status ENUM('EN\_VENTA', 'EN\_ALQUILER', 'VENDIDA', 'ALQUILADA', 'DESACTIVADA') NOT NULL,

imageUrl JSON,

createdAt DATETIME DEFAULT CURRENT\_TIMESTAMP,

updatedAt DATETIME DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP,

agentId VARCHAR(36) NOT NULL,

FOREIGN KEY (agentId) REFERENCES Agent(id) ON DELETE CASCADE

);

\-- TABLA PARA PROPIEDADES FAVORITAS (RELACIÓN MUCHOS A MUCHOS)

CREATE TABLE IF NOT EXISTS UserFavoriteProperties (

userId VARCHAR(36) NOT NULL,

propertyId VARCHAR(36) NOT NULL,

PRIMARY KEY (userId, propertyId),

FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,

FOREIGN KEY (propertyId) REFERENCES Property(id) ON DELETE CASCADE

);

3\. Instalación y Ejecución del Backend (Servidor)

Navega a la carpeta del servidor:

cd mi-portal-inmobiliario/server

Instala las dependencias del backend:

npm install

Inicia el servidor:

npm start

El servidor se ejecutará en http://localhost:3001. Mantén esta terminal abierta.

4\. Instalación y Ejecución del Frontend (Aplicación Next.js)

Abre una nueva terminal.

Navega a la carpeta raíz del proyecto:

cd mi-portal-inmobiliario/front

Instala las dependencias del frontend:

npm install

Crea el archivo de variables de entorno:

En la raíz de mi-portal-inmobiliario, crea un archivo llamado .env.local.

Añade la siguiente línea:

NEXT\_PUBLIC\_API\_URL=http://localhost:3001

Construye la aplicación (modo producción):

npm run build

Inicia la aplicación en modo desarrollo:

npm run dev

La aplicación se ejecutará en http://localhost:3000.

5\. ¡Visita el Portal!

Abre tu navegador web y ve a http://localhost:3000.

Podrás ver la página principal.

Haz clic en "Añadir Propiedad" para crear nuevos listados.

Las propiedades que añadas aparecerán en la página principal y podrás ver sus detalles.

Estructura del Proyecto

mi-portal-inmobiliario/

├── app/ # Contiene las rutas y componentes de Next.js (frontend)

│ ├── layout.tsx # Layout principal de la aplicación (navbar, providers)

│ ├── page.tsx # Página principal del listado y búsqueda de propiedades

│ ├── providers.tsx # Configuración global de React Query

│ └── add-property/ # Ruta para añadir nuevas propiedades

│ └── page.tsx # Componente del formulario para añadir propiedades

│ └── properties/ # Ruta dinámica para detalles de propiedades

│ └── \[id\]/ # Carpeta para IDs de propiedades

│ └── page.tsx # Componente de la página de detalles de una propiedad

├── public/ # Archivos estáticos

├── server/ # Contiene el backend de Node.js (el "cerebro")

│ ├── node\_modules/ # Dependencias del backend

│ ├── index.ts # Archivo principal del servidor (Express, MySQL, Zod)

│ ├── package.json # Dependencias y scripts del backend

│ └── tsconfig.json # Configuración de TypeScript para el backend

├── .env.local # Variables de entorno para Next.js (frontend)

├── .eslintrc.json # Configuración de ESLint para el frontend

├── package.json # Dependencias y scripts del frontend

├── next.config.mjs # Configuración de Next.js

├── tsconfig.json # Configuración de TypeScript para Next.js

└── README.md # Este archivo

Mejoras Futuras Potenciales

Autenticación de Usuarios y Agentes: Implementar Next-Auth para registro, inicio de sesión y protección de rutas.

Subida Directa de Imágenes: Integrar Cloudinary (o similar) para que los agentes puedan subir fotos de propiedades directamente en lugar de solo URLs.

Funcionalidades CRUD Completas: Añadir opciones para editar y eliminar propiedades existentes.

Paginación y Carga Infinita: Para manejar grandes volúmenes de propiedades de manera eficiente.

Mapas Interactivos: Integrar un servicio de mapas (ej. Google Maps) para visualizar la ubicación de las propiedades.

Gestión de Agentes: CRUD para gestionar la información de los agentes inmobiliarios.

Favoritos de Usuario: Permitir a los usuarios guardar propiedades en una lista de favoritos.

Mejoras de UI/UX: Animaciones, transiciones, componentes más interactivos.

Testing: Añadir pruebas unitarias y de integración para asegurar la robustez del código.

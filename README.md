# 📚 README del Proyecto: Vida Plena - "Tu Guía Esencial"
Este archivo describe la estructura, funcionalidad y tecnologías utilizadas en el proyecto de comercio electrónico y portal informativo Vida Plena: "Tu Guía Esencial"
# 🎯 Descripción General
Vida Plena es una plataforma web que combina portal informativo sobre bienestar (Fitness, Nutrición, Belleza) con una tienda de productos de comercio electrónico. El proyecto utiliza un diseño responsive (adaptable) basado en Flexbox y CSS Grid.

### La funcionalidad principal del comercio electrónico incluye:

**Catálogo Dinámico**: Carga productos de una API externa (simulada) mediante un desplazamiento infinito (Infinite Scroll).

**Carrito de Compras:** Permite agregar, eliminar y calcular el total de los productos.

**Proceso de Compra Avanzado:** Solicita datos del cliente y simula el envío de notificaciones por email al cliente (comprobante) y al vendedor (alerta de nueva venta).

# 🛠️ Tecnologías y Características Clave

## 💻 Desarrollo Frontend

HTML5, CSS3, JavaScript (ES6+):

Estructura, estilo y lógica del lado del cliente.

Diseño (Responsivo): Flexbox y CSS Grid: Usados para crear un diseño adaptable (responsive design) que se ve bien en diferentes dispositivos.

## 💾 Gestión de Datos y Persistencia
Datos (API Externa Simulada):

Fuente de datos: Utilizada para cargar dinálogos de productos al catálogo (ej. consumiendo un servicio como dummyjson.com).

Persistencia:

localStorage: Mecanismo del navegador usado para guardar los productos del carrito de compras entre sesiones del usuario.

## 📧 Sistema de Notificaciones y Carrito
Carrito de Compras:

Almacena los productos seleccionados, permite eliminarlos y calcula el total de la compra.

Notificaciones (Simulación de Email):

Formspree (simulado): Servicio de terceros utilizado para gestionar el envío de formularios de contacto y, fundamentalmente, para simular el envío de notificaciones por email al finalizar la compra.

Envía un comprobante o factura al correo del cliente (a través del Autoresponder de Formspree).

Envía una notificación de compra exitosa al vendedor (al correo configurado en Formspree), incluyendo los datos del cliente y el detalle de la compra.

# 📂 Estructura del Proyecto
El proyecto Vida Plena está organizado en archivos que separan la estructura (HTML), el estilo (CSS) y la lógica (JavaScript) para mantener un código limpio y modular.

## 📄 Archivos HTML (Estructura de Contenido)
index.html

Página principal del sitio.

Contiene el catálogo de productos con funcionalidad de Carga Infinita (Infinite Scroll).

Incluye las secciones de blog (Fitness, Nutrición, Belleza) y el enlace al carrito.

carrito.html

Página dedicada al Carrito de Compras.

Permite revisar, eliminar ítems, calcular el total y ejecutar el Proceso de Finalización de Compra.

contacto.html

Página simple que contiene el Formulario de Contacto.

## 🎨 Archivos de Estilo (Diseño)
style.css

Hoja de estilos principal.

Define el diseño responsivo (adaptable), utilizando técnicas de Flexbox y CSS Grid.

Aplica el estilo específico para el catálogo de productos y la interfaz del carrito.

## 🧠 Archivos de Lógica (JavaScript)
script.js

Lógica principal de la Página de Inicio (index.html).

Maneja la carga de productos desde la API externa y la funcionalidad de Desplazamiento Infinito.

Implementa la función para agregar productos al carrito (localStorage).

carrito.js

Lógica central del Carrito de Compras (carrito.html).

Encargado de la renderización de productos, eliminación, cálculo del total y, más importante, el proceso de finalización de compra/notificaciones.

Gestiona la solicitud de datos del cliente (Nombre, Apellido, Email).

Simula el envío de notificaciones al cliente y al vendedor (utilizando el servicio Formspree).

# 🛒 Funcionalidad del Carrito de Compras (Detalle)
La lógica de compra reside principalmente en carrito.js e incluye:

Datos del Cliente: Al presionar "Finalizar Compra", se solicita al cliente:

Nombre

Apellido

Correo electrónico (_replyto para Formspree)

Preparación de la Factura: Se capturan el Total a Pagar y el Detalle de la Compra (lista de productos y cantidades) y se envían junto con los datos del cliente.

Simulación de Notificación (Vendedor): El alert() final simula la notificación que recibe el vendedor, mostrando:

Confirmación de éxito.

Aviso de envío de comprobante al cliente.

Datos completos del cliente (Nombre, Apellido, Email).

Detalle del comprobante/factura (Total y Productos).

Comprobante (Cliente): La integración con Formspree se utiliza para que, mediante su función de Autoresponder (Respuesta Automática), se envíe el comprobante de la compra al email del cliente.

# ⚠️ Configuración Necesaria
Para que el envío de emails funcione (simulación de comprobante y notificación), debe configurar el formulario en carrito.html y contacto.html con un endpoint activo de Formspree (o de un servicio de backend real).

Reemplace YOUR_FORMSPREE_ENDPOINT en carrito.html con su clave única de Formspree
# Bot Automatizado para Cambridge One

Este proyecto contiene un bot automatizado que puede iniciar sesión en la plataforma Cambridge One y está preparado para ser extendido para realizar ejercicios automáticamente.

## Requisitos previos

Antes de usar este bot, necesitas tener instalado:

1. [Node.js](https://nodejs.org/) (versión 14 o superior)
2. NPM (viene incluido con Node.js)

## Instalación

1. Clona o descarga este repositorio
2. Abre una terminal en la carpeta del proyecto
3. Instala las dependencias necesarias:

```bash
npm init -y
npm install puppeteer
```

## Configuración

Antes de ejecutar el bot, debes configurar tus credenciales de Cambridge One:

1. Abre el archivo `cambridge_bot.js`
2. Busca la sección de configuración:

```javascript
const config = {
  username: 'tu_usuario', // Reemplaza con tu nombre de usuario o correo electrónico
  password: 'tu_contraseña', // Reemplaza con tu contraseña
  headless: false, // Cambiar a true para ejecutar sin interfaz gráfica
  loginUrl: 'https://www.cambridgeone.org/login'
};
```

3. Reemplaza `'tu_usuario'` con tu nombre de usuario o correo electrónico de Cambridge One
4. Reemplaza `'tu_contraseña'` con tu contraseña de Cambridge One

## Uso

Para ejecutar el bot, usa el siguiente comando en la terminal:

```bash
node cambridge_bot.js
```

El bot realizará las siguientes acciones:

1. Abrirá un navegador Chrome
2. Navegará a la página de inicio de sesión de Cambridge One
3. Ingresará tus credenciales
4. Iniciará sesión en la plataforma

## Personalización

Puedes extender este bot para realizar tareas adicionales después de iniciar sesión. Algunas ideas:

- Navegar a un curso específico
- Completar ejercicios automáticamente
- Descargar recursos
- Programar sesiones de estudio

Para implementar estas funcionalidades, modifica el archivo `cambridge_bot.js` y agrega el código necesario después de la sección de inicio de sesión.

## Notas importantes

- Este bot es solo para fines educativos y personales
- No compartas tus credenciales en el código si planeas compartir este proyecto
- El uso de bots puede estar en contra de los términos de servicio de Cambridge One
- Usa este bot de manera responsable y ética

## Solución de problemas

Si encuentras algún problema:

1. Asegúrate de que tus credenciales sean correctas
2. Verifica que tengas una conexión a Internet estable
3. Comprueba que los selectores CSS no hayan cambiado (si el sitio web se actualiza)
4. Intenta ejecutar el bot con `headless: false` para ver qué está sucediendo

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
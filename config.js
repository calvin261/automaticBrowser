// Archivo de configuración para el bot de Cambridge One
// Edita este archivo con tus credenciales y preferencias

module.exports = {
  // Credenciales de inicio de sesión
  username: '', // Correo electrónico de inicio de sesión
  password: '', // Contraseña de inicio de sesión
  
  // Configuración del navegador
  headless: false, // Cambiar a true para ejecutar sin interfaz gráfica
  defaultViewport: null, // Viewport automático basado en el tamaño de la ventana
  browserArgs: ['--start-maximized', '--disable-notifications'], // Argumentos para el navegador
  
  // URLs y selectores
  loginUrl: 'https://www.cambridgeone.org/login',
  courseSelector: '', // Selector CSS para tu curso (personalizar según tu caso)
  
  // Tiempos de espera
  waitTime: 2000, // Tiempo de espera entre acciones (ms)
  navigationTimeout: 60000, // Tiempo máximo de espera para navegación (ms)
  defaultTimeout: 30000, // Tiempo máximo de espera para otras acciones (ms)
  
  // Rutas
  screenshotPath: './screenshots/', // Carpeta para guardar capturas de pantalla
  
  // Selectores específicos para Cambridge One
  selectors: {
    usernameField: '#gigya-loginID-56269462240752180',
    passwordField: '#gigya-password-56383998600152700',
    submitButton: 'input[type="submit"]',
    // Agrega más selectores según sea necesario para tu caso específico
  }
};

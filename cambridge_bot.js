// Script para automatizar el inicio de sesión en Cambridge One
const puppeteer = require('puppeteer');

// Configuración - Credenciales configuradas
const config = {
  username: 'jrjacomes@uce.edu.ec', // Correo electrónico de inicio de sesión
  password: '>4}4+e3cO4dk', // Contraseña de inicio de sesión
  headless: false, // Cambiar a true para ejecutar sin interfaz gráfica
  loginUrl: 'https://www.cambridgeone.org/login'
};

async function main() {
  console.log('Iniciando el bot de Cambridge One...');
  
  // Iniciar el navegador
  const browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: null, // Viewport automático basado en el tamaño de la ventana
    args: ['--start-maximized'], // Iniciar maximizado
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Ruta a Chrome instalado
    ignoreDefaultArgs: ['--disable-extensions']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navegar a la página de inicio de sesión
    console.log(`Navegando a ${config.loginUrl}...`);
    await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });
    
    // Esperar a que los campos de inicio de sesión estén disponibles
    await page.waitForSelector('#gigya-loginID-56269462240752180');
    await page.waitForSelector('#gigya-password-56383998600152700');
    
    // Ingresar credenciales
    console.log('Ingresando credenciales...');
    await page.type('#gigya-loginID-56269462240752180', config.username);
    await page.type('#gigya-password-56383998600152700', config.password);
    
    // Hacer clic en el botón de inicio de sesión
    console.log('Iniciando sesión...');
    try {
      // Buscar todos los botones de tipo submit
      const submitButtons = await page.$$('input[type="submit"]');
      console.log(`Encontrados ${submitButtons.length} botones de envío`);
      
      // Hacer clic en el último botón de envío (generalmente es el de inicio de sesión)
      if (submitButtons.length > 0) {
        await submitButtons[submitButtons.length - 1].click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
      } else {
        console.log('No se encontró el botón de inicio de sesión');
        // Intentar con un selector diferente
        await page.evaluate(() => {
          // Buscar botones por texto
          const buttons = Array.from(document.querySelectorAll('button'));
          const loginButton = buttons.find(button => 
            button.textContent.toLowerCase().includes('iniciar') || 
            button.textContent.toLowerCase().includes('login') || 
            button.textContent.toLowerCase().includes('sign in'));
          if (loginButton) loginButton.click();
        });
        await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(e => console.log('Error en navegación:', e.message));
      }
    } catch (error) {
      console.log('Error al hacer clic en el botón de inicio de sesión:', error.message);
    }
    
    console.log('Sesión iniciada correctamente');
    
    // Aquí puedes agregar más acciones para navegar por el sitio y realizar ejercicios
    // Por ejemplo:
    // await page.goto('https://www.cambridgeone.org/home');
    // await page.click('selector-del-curso');
    
    // Mantener el navegador abierto para interacción manual
    console.log('Bot listo. El navegador permanecerá abierto para interacción manual.');
    
  } catch (error) {
    console.error('Error durante la ejecución:', error);
    await browser.close();
  }
}

// Ejecutar el script
main();
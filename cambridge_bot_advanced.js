// Script avanzado para automatizar Cambridge One
const puppeteer = require('puppeteer');

// Configuración - Credenciales configuradas
const config = {
  username: 'jrjacomes@uce.edu.ec', // Correo electrónico de inicio de sesión
  password: '>4}4+e3cO4dk', // Contraseña de inicio de sesión
  headless: false, // Cambiar a true para ejecutar sin interfaz gráfica
  loginUrl: 'https://www.cambridgeone.org/login',
  courseSelector: '', // Selector CSS para tu curso (personalizar según tu caso)
  waitTime: 2000, // Tiempo de espera entre acciones (ms)
  screenshotPath: './screenshots' // Directorio para guardar capturas de pantalla
};

async function main() {
  console.log('Iniciando el bot avanzado de Cambridge One...');
  
  // Iniciar el navegador
  const browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: null,
    args: ['--start-maximized', '--disable-notifications'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Ruta a Chrome instalado
    ignoreDefaultArgs: ['--disable-extensions']
  });
  
  try {
    const page = await browser.newPage();
    
    // Configurar timeouts más largos para conexiones lentas
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(30000);
    
    // Habilitar interceptación de solicitudes (opcional, para análisis avanzado)
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Puedes filtrar o modificar solicitudes aquí
      request.continue();
    });
    
    // Navegar a la página de inicio de sesión
    console.log(`Navegando a ${config.loginUrl}...`);
    await page.goto(config.loginUrl, { waitUntil: 'networkidle2' });
    
    // Iniciar sesión
    await login(page);
    
    // Esperar a que la página principal cargue completamente
    await page.waitForTimeout(config.waitTime * 2);
    
    // Tomar captura de pantalla de la página principal
    await takeScreenshot(page, 'home_page');
    
    // Navegar a My Assignments
    console.log('Navegando a My Assignments...');
    await navigateToMyAssignments(page);
    
    // Seleccionar una tarea activa en la sección To do
    console.log('Seleccionando tarea activa en To do...');
    await selectActiveAssignment(page);
    
    // Responder preguntas del ejercicio
    console.log('Respondiendo preguntas del ejercicio...');
    await answerQuestions(page);
    
    console.log('Bot avanzado listo. El navegador permanecerá abierto para interacción manual.');
    
  } catch (error) {
    console.error('Error durante la ejecución:', error);
    await takeScreenshot(page, 'error_execution');
    // No cerramos el navegador para permitir inspección manual
  }
}

// Función para iniciar sesión
async function login(page) {
  try {
    console.log('Esperando a que los campos de inicio de sesión estén disponibles...');
    
    // Esperar a que los campos de inicio de sesión estén disponibles
    await page.waitForSelector('#gigya-loginID-56269462240752180');
    await page.waitForSelector('#gigya-password-56383998600152700');
    
    // Ingresar credenciales
    console.log('Ingresando credenciales...');
    await page.type('#gigya-loginID-56269462240752180', config.username);
    await page.type('#gigya-password-56383998600152700', config.password);
    
    // Tomar captura de pantalla antes de iniciar sesión
    await takeScreenshot(page, 'before_login');
    
    // Estrategia mejorada para hacer clic en el botón de inicio de sesión
    console.log('Iniciando sesión...');
    
    // Primero intentamos encontrar todos los botones de tipo submit
    const submitButtons = await page.$$('input[type="submit"]');
    console.log(`Se encontraron ${submitButtons.length} botones de tipo submit`);
    
    if (submitButtons.length > 0) {
      // Hacer clic en el último botón submit (generalmente es el de login)
      await submitButtons[submitButtons.length - 1].click();
      console.log('Clic en botón submit realizado');
    } else {
      // Si no hay botones submit, buscar botones por texto
      console.log('No se encontraron botones submit. Buscando por texto...');
      
      // Usar evaluate para encontrar botones con texto relacionado a login
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, input[type="button"], [role="button"]'));
        const loginButton = buttons.find(button => {
          const text = (button.innerText || button.value || '').toLowerCase();
          return text.includes('iniciar') || text.includes('login') || text.includes('sign in') || 
                 text.includes('ingresar') || text.includes('entrar');
        });
        
        if (loginButton) {
          loginButton.click();
          return true;
        }
        return false;
      });
    }
    
    // Esperar a que la navegación se complete después del inicio de sesión
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    console.log('Sesión iniciada correctamente');
    return true;
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    await takeScreenshot(page, 'login_error');
    return false;
  }
}

// Función para navegar al curso
async function navigateToCourse(page) {
  try {
    console.log('Navegando al curso...');
    
    // Esperar a que el selector del curso esté disponible
    await page.waitForSelector(config.courseSelector);
    
    // Hacer clic en el curso
    await page.click(config.courseSelector);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Tomar captura de pantalla de la página del curso
    await takeScreenshot(page, 'course_page');
    
    console.log('Navegación al curso completada');
    return true;
  } catch (error) {
    console.error('Error durante la navegación al curso:', error);
    await takeScreenshot(page, 'course_navigation_error');
    return false;
  }
}

// Función para completar ejercicios (ejemplo genérico)
async function completeExercises(page) {
  try {
    console.log('Buscando ejercicios para completar...');
    
    // Esta función debe personalizarse según los tipos de ejercicios específicos
    // que deseas automatizar. Aquí hay un ejemplo genérico:
    
    // 1. Buscar ejercicios disponibles
    const exerciseLinks = await page.$$('selector-de-ejercicios');
    
    // 2. Iterar sobre cada ejercicio
    for (let i = 0; i < exerciseLinks.length; i++) {
      console.log(`Completando ejercicio ${i + 1} de ${exerciseLinks.length}...`);
      
      // Hacer clic en el ejercicio
      await exerciseLinks[i].click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Tomar captura de pantalla del ejercicio
      await takeScreenshot(page, `exercise_${i + 1}`);
      
      // Detectar tipo de ejercicio y completarlo
      await detectAndCompleteExercise(page);
      
      // Volver a la lista de ejercicios
      await page.goBack();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
    
    console.log('Todos los ejercicios han sido completados');
    return true;
  } catch (error) {
    console.error('Error durante la realización de ejercicios:', error);
    await takeScreenshot(page, 'exercise_error');
    return false;
  }
}

// Función para detectar y completar un ejercicio específico
async function detectAndCompleteExercise(page) {
  // Analizar la página para determinar el tipo de ejercicio
  const pageContent = await page.content();
  
  // Ejemplos de diferentes tipos de ejercicios (personalizar según tus necesidades)
  if (pageContent.includes('multiple-choice')) {
    await completeMultipleChoiceExercise(page);
  } else if (pageContent.includes('fill-in-the-blank')) {
    await completeFillInTheBlankExercise(page);
  } else if (pageContent.includes('matching')) {
    await completeMatchingExercise(page);
  } else {
    console.log('Tipo de ejercicio no reconocido. Saltando...');
  }
  
  // Esperar un momento antes de continuar
  await page.waitForTimeout(config.waitTime);
}

// Función para completar ejercicios de opción múltiple
async function completeMultipleChoiceExercise(page) {
  console.log('Completando ejercicio de opción múltiple...');
  
  try {
    // Encontrar todas las opciones disponibles
    const options = await page.$$('selector-de-opciones');
    
    // Seleccionar una opción (por ejemplo, la primera)
    if (options.length > 0) {
      await options[0].click();
      console.log('Opción seleccionada');
    }
    
    // Hacer clic en el botón de enviar/verificar
    await page.click('selector-de-boton-enviar');
    
    // Esperar a que se procese la respuesta
    await page.waitForTimeout(config.waitTime);
    
    // Tomar captura de pantalla del resultado
    await takeScreenshot(page, 'multiple_choice_result');
    
    return true;
  } catch (error) {
    console.error('Error en ejercicio de opción múltiple:', error);
    return false;
  }
}

// Función para completar ejercicios de rellenar espacios en blanco
async function completeFillInTheBlankExercise(page) {
  console.log('Completando ejercicio de rellenar espacios en blanco...');
  
  try {
    // Encontrar todos los campos de entrada
    const inputFields = await page.$$('selector-de-campos-de-entrada');
    
    // Rellenar cada campo con un texto predefinido o respuestas específicas
    for (let i = 0; i < inputFields.length; i++) {
      await inputFields[i].type('respuesta-ejemplo');
    }
    
    // Hacer clic en el botón de enviar/verificar
    await page.click('selector-de-boton-enviar');
    
    // Esperar a que se procese la respuesta
    await page.waitForTimeout(config.waitTime);
    
    // Tomar captura de pantalla del resultado
    await takeScreenshot(page, 'fill_in_blank_result');
    
    return true;
  } catch (error) {
    console.error('Error en ejercicio de rellenar espacios en blanco:', error);
    return false;
  }
}

// Función para completar ejercicios de emparejamiento
async function completeMatchingExercise(page) {
  console.log('Completando ejercicio de emparejamiento...');
  
  try {
    // Encontrar todos los elementos arrastrables
    const draggableItems = await page.$$('selector-de-elementos-arrastrables');
    
    // Encontrar todos los destinos donde soltar los elementos
    const dropTargets = await page.$$('selector-de-destinos');
    
    // Realizar operaciones de arrastrar y soltar para cada par
    for (let i = 0; i < Math.min(draggableItems.length, dropTargets.length); i++) {
      const draggable = draggableItems[i];
      const target = dropTargets[i];
      
      // Obtener las coordenadas de los elementos
      const draggableBox = await draggable.boundingBox();
      const targetBox = await target.boundingBox();
      
      // Realizar la operación de arrastrar y soltar
      await page.mouse.move(draggableBox.x + draggableBox.width / 2, draggableBox.y + draggableBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
      await page.mouse.up();
      
      // Esperar un momento entre operaciones
      await page.waitForTimeout(500);
    }
    
    // Hacer clic en el botón de enviar/verificar
    await page.click('selector-de-boton-enviar');
    
    // Esperar a que se procese la respuesta
    await page.waitForTimeout(config.waitTime);
    
    // Tomar captura de pantalla del resultado
    await takeScreenshot(page, 'matching_result');
    
    return true;
  } catch (error) {
    console.error('Error en ejercicio de emparejamiento:', error);
    return false;
  }
}

// Función para navegar a My Assignments
async function navigateToMyAssignments(page) {
  try {
    console.log('Buscando el botón My Assignments...');
    
    // Esperar a que la página principal cargue completamente
    await page.waitForTimeout(config.waitTime);
    
    // Buscar y hacer clic en el botón My Assignments
    // Primero intentamos con el texto exacto
    const myAssignmentsButton = await page.evaluate(() => {
      // Buscar por texto exacto en botones, enlaces o elementos de navegación
      const elements = Array.from(document.querySelectorAll('button, a, nav a, [role="button"], [role="link"], .nav-item, .menu-item'));
      return elements.find(el => el.innerText.includes('My Assignments') || el.innerText.includes('My assignments'))?.outerHTML;
    });
    
    if (myAssignmentsButton) {
      console.log('Botón My Assignments encontrado por texto');
      // Hacer clic en el botón encontrado por texto
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, a, nav a, [role="button"], [role="link"], .nav-item, .menu-item'));
        const button = elements.find(el => el.innerText.includes('My Assignments') || el.innerText.includes('My assignments'));
        if (button) button.click();
      });
    } else {
      // Si no encontramos por texto, intentamos con selectores comunes
      console.log('Intentando encontrar My Assignments por selectores comunes...');
      // Tomar captura para análisis
      await takeScreenshot(page, 'before_my_assignments_click');
      
      // Intentar con varios selectores posibles
      const possibleSelectors = [
        'a[href*="assignments"]',
        'button:has-text("My Assignments")',
        'a:has-text("My Assignments")',
        '.nav-item:has-text("My Assignments")',
        '[data-testid*="assignment"]',
        '[aria-label*="assignment"]'
      ];
      
      let clicked = false;
      for (const selector of possibleSelectors) {
        if (await page.$(selector)) {
          console.log(`Encontrado selector: ${selector}`);
          await page.click(selector);
          clicked = true;
          break;
        }
      }
      
      if (!clicked) {
        console.log('No se pudo encontrar el botón My Assignments. Intentando con navegación directa...');
        // Intentar navegar directamente a la URL de assignments si conocemos la estructura
        await page.goto('https://www.cambridgeone.org/home/assignments', { waitUntil: 'networkidle2' });
      }
    }
    
    // Esperar a que la página de assignments cargue
    await page.waitForTimeout(config.waitTime);
    await takeScreenshot(page, 'my_assignments_page');
    
    return true;
  } catch (error) {
    console.error('Error al navegar a My Assignments:', error);
    await takeScreenshot(page, 'my_assignments_error');
    return false;
  }
}

// Función para seleccionar una tarea activa en la sección To do
async function selectActiveAssignment(page) {
  try {
    console.log('Buscando sección To do...');
    
    // Esperar a que la página cargue completamente
    await page.waitForTimeout(config.waitTime);
    
    // Buscar la sección To do
    const todoSection = await page.evaluate(() => {
      // Buscar por texto exacto en encabezados o secciones
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, section, div, [role="heading"]'));
      return elements.find(el => el.innerText.includes('To do') || el.innerText.includes('TODO') || el.innerText.includes('To Do'))?.outerHTML;
    });
    
    if (todoSection) {
      console.log('Sección To do encontrada');
      
      // Buscar una tarea activa dentro de la sección To do
      const activeAssignment = await page.evaluate(() => {
        // Primero encontramos la sección To do
        const todoSectionElement = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, section, div, [role="heading"]'))
          .find(el => el.innerText.includes('To do') || el.innerText.includes('TODO') || el.innerText.includes('To Do'));
        
        if (!todoSectionElement) return null;
        
        // Buscar el contenedor padre o siguiente que contiene las tareas
        let taskContainer = todoSectionElement.nextElementSibling;
        if (!taskContainer || !taskContainer.children || taskContainer.children.length === 0) {
          // Si no hay un siguiente elemento, buscar un contenedor padre
          taskContainer = todoSectionElement.closest('section') || todoSectionElement.parentElement;
        }
        
        // Buscar elementos que parezcan tareas (enlaces, tarjetas, etc.)
        const taskElements = Array.from(taskContainer.querySelectorAll('a, div.card, li, [role="listitem"], [role="button"]'));
        return taskElements.length > 0 ? taskElements[0].outerHTML : null;
      });
      
      if (activeAssignment) {
        console.log('Tarea activa encontrada. Haciendo clic...');
        
        // Hacer clic en la primera tarea activa
        await page.evaluate(() => {
          // Primero encontramos la sección To do
          const todoSectionElement = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, section, div, [role="heading"]'))
            .find(el => el.innerText.includes('To do') || el.innerText.includes('TODO') || el.innerText.includes('To Do'));
          
          if (!todoSectionElement) return;
          
          // Buscar el contenedor padre o siguiente que contiene las tareas
          let taskContainer = todoSectionElement.nextElementSibling;
          if (!taskContainer || !taskContainer.children || taskContainer.children.length === 0) {
            // Si no hay un siguiente elemento, buscar un contenedor padre
            taskContainer = todoSectionElement.closest('section') || todoSectionElement.parentElement;
          }
          
          // Buscar elementos que parezcan tareas y hacer clic en el primero
          const taskElements = Array.from(taskContainer.querySelectorAll('a, div.card, li, [role="listitem"], [role="button"]'));
          if (taskElements.length > 0) taskElements[0].click();
        });
      } else {
        console.log('No se encontraron tareas activas en la sección To do');
        return false;
      }
    } else {
      console.log('No se pudo encontrar la sección To do. Buscando tareas directamente...');
      
      // Si no encontramos la sección To do, intentamos buscar tareas directamente
      const assignments = await page.$$('a, div.card, li, [role="listitem"], [role="button"]');
      if (assignments.length > 0) {
        console.log(`Encontradas ${assignments.length} posibles tareas. Haciendo clic en la primera...`);
        await assignments[0].click();
      } else {
        console.log('No se encontraron tareas');
        return false;
      }
    }
    
    // Esperar a que la página de la tarea cargue
    await page.waitForTimeout(config.waitTime);
    await takeScreenshot(page, 'active_assignment_page');
    
    // Después de entrar al assignment, buscar y hacer clic en el botón específico
    console.log('Buscando el botón "Assignment 2, 2025-JUN-AGO-5-028-ESPINOZA D"...');
    await page.waitForTimeout(config.waitTime);
    
    // Buscar el elemento específico por su estructura HTML
    const specificButtonFound = await page.evaluate(async () => {
      // Buscar elementos con la clase 'assignment-header' que contengan el texto específico
      const elements = Array.from(document.querySelectorAll('a.assignment-header'));
      
      // Filtrar por texto que contenga el texto específico
      const targetElement = elements.find(el => {
        const text = el.innerText || el.textContent || '';
        return text.includes('Assignment 2') && text.includes('ESPINOZA D');
      });
      
      if (targetElement) {
        console.log('Elemento encontrado:', targetElement.innerText || targetElement.textContent);
        targetElement.click();
        return true;
      }
      
      return false;
    });
    
    if (specificButtonFound) {
      console.log('Botón específico encontrado y clicado');
    } else {
      console.log('No se encontró el botón específico. Buscando alternativas...');
      
      // Intentar buscar por texto parcial
      const partialMatch = await page.evaluate(async () => {
        // Buscar elementos que contengan parte del texto
        const elements = Array.from(document.querySelectorAll('button, a, div, span, li, [role="button"], [role="link"], [role="listitem"]'));
        
        // Buscar primero por 'Assignment 2'
        let targetElement = elements.find(el => {
          const text = el.innerText || el.textContent || '';
          return text.includes('Assignment 2');
        });
        
        // Si no encontramos, buscar por 'ESPINOZA'
        if (!targetElement) {
          targetElement = elements.find(el => {
            const text = el.innerText || el.textContent || '';
            return text.includes('ESPINOZA');
          });
        }
        
        if (targetElement) {
          console.log('Elemento encontrado por coincidencia parcial:', targetElement.innerText || targetElement.textContent);
          targetElement.click();
          return true;
        }
        
        return false;
      });
      
      if (partialMatch) {
        console.log('Botón encontrado por coincidencia parcial y clicado');
      } else {
        console.log('No se pudo encontrar ningún botón relacionado con la tarea específica');
      }
    }
    
    // Esperar a que cargue la página de preguntas
    await page.waitForTimeout(config.waitTime * 1.5);
    await takeScreenshot(page, 'specific_assignment_page');
    
    return true;
  } catch (error) {
    console.error('Error al seleccionar tarea activa:', error);
    await takeScreenshot(page, 'select_assignment_error');
    return false;
  }
}

// Función para responder preguntas automáticamente
async function answerQuestions(page) {
  try {
    console.log('Analizando preguntas del ejercicio...');
    
    // Esperar a que la página cargue completamente
    await page.waitForTimeout(config.waitTime);
    await takeScreenshot(page, 'questions_page');
    
    // Detectar el tipo de preguntas y responderlas
    const questionType = await detectQuestionType(page);
    console.log(`Tipo de preguntas detectado: ${questionType}`);
    
    switch (questionType) {
      case 'multiple-choice':
        await answerMultipleChoiceQuestions(page);
        break;
      case 'fill-in-blank':
        await answerFillInBlankQuestions(page);
        break;
      case 'matching':
        await answerMatchingQuestions(page);
        break;
      case 'true-false':
        await answerTrueFalseQuestions(page);
        break;
      case 'cambridge-dropdown':
        await answerCambridgeDropdownQuestions(page);
        break;
      default:
        console.log('Tipo de preguntas no reconocido. Intentando respuesta genérica...');
        await answerGenericQuestions(page);
    }
    
    // Verificar si hay un botón para enviar todas las respuestas
    await submitAnswers(page);
    
    // Esperar a que se procesen las respuestas
    await page.waitForTimeout(config.waitTime);
    await takeScreenshot(page, 'answers_submitted');
    
    // Buscar y hacer clic en el botón Next si está disponible
    await clickNextButton(page);
    
    return true;
  } catch (error) {
    console.error('Error al responder preguntas:', error);
    await takeScreenshot(page, 'answer_questions_error');
    return false;
  }
}

// Función para detectar el tipo de preguntas
async function detectQuestionType(page) {
  // Tomar una captura de pantalla para análisis
  await takeScreenshot(page, 'detecting_question_type');
  
  // Analizar la estructura de la página para determinar el tipo de preguntas
  const questionTypeData = await page.evaluate(() => {
    // Buscar elementos que indiquen preguntas de opción múltiple
    const hasMultipleChoice = !!document.querySelector('input[type="radio"], .multiple-choice, [role="radio"]');
    
    // Buscar elementos que indiquen preguntas de rellenar espacios
    const hasFillInBlank = !!document.querySelector('input[type="text"], textarea, .fill-blank, [contenteditable="true"]');
    
    // Buscar elementos que indiquen preguntas de emparejamiento
    const hasMatching = !!document.querySelector('.drag-drop, .matching, [draggable="true"]');
    
    // Buscar elementos que indiquen preguntas de verdadero/falso
    const hasTrueFalse = !!document.querySelector('.true-false, .yes-no');
    
    // Buscar elementos específicos de Cambridge One
    const hasCambridgeDropdown = !!document.querySelector('.content.draggable__content, div.draggable__content, .firstword, span.firstword');
    
    // Registrar todos los elementos que podrían ser relevantes para depuración
    console.log('Elementos encontrados en la página:');
    console.log('- Elementos con clase "draggable__content":', document.querySelectorAll('.draggable__content').length);
    console.log('- Elementos con clase "content":', document.querySelectorAll('.content').length);
    console.log('- Elementos con clase "firstword":', document.querySelectorAll('.firstword').length);
    
    return { 
      hasMultipleChoice, 
      hasFillInBlank, 
      hasMatching, 
      hasTrueFalse,
      hasCambridgeDropdown
    };
  });
  
  // Verificar manualmente si hay elementos específicos de Cambridge
  const hasCambridgeElements = await page.evaluate(() => {
    // Buscar elementos específicos por su estructura HTML
    const firstwordElements = document.querySelectorAll('span.firstword');
    const draggableElements = document.querySelectorAll('div.content.draggable__content, div.draggable__content');
    
    return {
      firstwordCount: firstwordElements.length,
      draggableCount: draggableElements.length,
      html: document.body.innerHTML.includes('draggable__content') || document.body.innerHTML.includes('firstword')
    };
  });
  
  console.log('Verificación manual de elementos Cambridge:', hasCambridgeElements);
  
  // Determinar el tipo predominante
  if (questionTypeData.hasCambridgeDropdown || hasCambridgeElements.firstwordCount > 0 || hasCambridgeElements.draggableCount > 0 || hasCambridgeElements.html) {
    console.log('Detectado tipo Cambridge Dropdown basado en elementos específicos');
    return 'cambridge-dropdown';
  }
  if (questionTypeData.hasMultipleChoice) return 'multiple-choice';
  if (questionTypeData.hasFillInBlank) return 'fill-in-blank';
  if (questionTypeData.hasMatching) return 'matching';
  if (questionTypeData.hasTrueFalse) return 'true-false';
  
  return 'unknown';
}

// Función para responder preguntas de opción múltiple
async function answerMultipleChoiceQuestions(page) {
  console.log('Respondiendo preguntas de opción múltiple...');
  
  // Encontrar todas las preguntas de opción múltiple
  const questions = await page.$$('.question, .exercise, [role="group"]');
  
  for (let i = 0; i < questions.length; i++) {
    console.log(`Respondiendo pregunta ${i + 1} de ${questions.length}...`);
    
    // Encontrar opciones para esta pregunta
    const options = await questions[i].$$('input[type="radio"], [role="radio"]');
    
    if (options.length > 0) {
      // Seleccionar una opción (en este caso, seleccionamos la primera)
      // En un bot más avanzado, podrías implementar lógica para seleccionar la respuesta correcta
      await options[0].click();
      console.log(`Seleccionada opción 1 para la pregunta ${i + 1}`);
    }
    
    // Esperar un momento antes de pasar a la siguiente pregunta
    await page.waitForTimeout(500);
  }
}

// Función para responder preguntas de rellenar espacios
async function answerFillInBlankQuestions(page) {
  console.log('Respondiendo preguntas de rellenar espacios...');
  
  // Encontrar todos los campos de texto
  const inputFields = await page.$$('input[type="text"], textarea, [contenteditable="true"]');
  
  // Respuestas genéricas para diferentes tipos de preguntas
  const genericAnswers = ['answer', 'example', 'text', 'correct', 'solution'];
  
  for (let i = 0; i < inputFields.length; i++) {
    // Seleccionar una respuesta genérica
    const answer = genericAnswers[i % genericAnswers.length];
    
    // Escribir la respuesta en el campo
    await inputFields[i].type(answer);
    console.log(`Campo ${i + 1}: respondido con "${answer}"`);
    
    // Esperar un momento antes de pasar al siguiente campo
    await page.waitForTimeout(300);
  }
}

// Función para responder preguntas de emparejamiento
async function answerMatchingQuestions(page) {
  console.log('Respondiendo preguntas de emparejamiento...');
  
  // Encontrar elementos arrastrables
  const draggables = await page.$$('[draggable="true"], .draggable');
  
  // Encontrar zonas donde soltar
  const dropZones = await page.$$('.drop-zone, .droppable, [aria-dropeffect]');
  
  // Si tenemos elementos arrastrables y zonas donde soltar
  if (draggables.length > 0 && dropZones.length > 0) {
    for (let i = 0; i < Math.min(draggables.length, dropZones.length); i++) {
      // Obtener las coordenadas
      const dragBox = await draggables[i].boundingBox();
      const dropBox = await dropZones[i].boundingBox();
      
      // Realizar la operación de arrastrar y soltar
      await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(dropBox.x + dropBox.width / 2, dropBox.y + dropBox.height / 2, { steps: 10 });
      await page.mouse.up();
      
      console.log(`Emparejado elemento ${i + 1}`);
      await page.waitForTimeout(500);
    }
  } else {
    console.log('No se encontraron elementos de emparejamiento');
  }
}

// Función para responder preguntas de verdadero/falso
async function answerTrueFalseQuestions(page) {
  console.log('Respondiendo preguntas de verdadero/falso...');
  
  // Encontrar todas las preguntas
  const questions = await page.$$('.question, .exercise, [role="group"]');
  
  for (let i = 0; i < questions.length; i++) {
    // Encontrar opciones (verdadero/falso) para esta pregunta
    const options = await questions[i].$$('input[type="radio"], [role="radio"], button');
    
    if (options.length >= 2) {
      // Seleccionar aleatoriamente verdadero o falso (0 o 1)
      const randomChoice = Math.floor(Math.random() * 2);
      await options[randomChoice].click();
      console.log(`Pregunta ${i + 1}: seleccionada opción ${randomChoice === 0 ? 'Verdadero' : 'Falso'}`);
    }
    
    await page.waitForTimeout(500);
  }
}

// Función para responder preguntas de forma genérica
async function answerGenericQuestions(page) {
  console.log('Intentando responder preguntas de forma genérica...');
  
  // Intentar hacer clic en opciones de opción múltiple
  const radioButtons = await page.$$('input[type="radio"], [role="radio"]');
  for (let i = 0; i < radioButtons.length; i += 4) {
    // Seleccionar una opción cada 4 (asumiendo 4 opciones por pregunta)
    if (i < radioButtons.length) {
      await radioButtons[i].click();
      console.log(`Seleccionada opción radio ${i}`);
      await page.waitForTimeout(300);
    }
  }
  
  // Intentar rellenar campos de texto
  const textInputs = await page.$$('input[type="text"], textarea, [contenteditable="true"]');
  for (const input of textInputs) {
    await input.type('answer');
    console.log('Rellenado campo de texto');
    await page.waitForTimeout(300);
  }
  
  // Intentar hacer clic en casillas de verificación
  const checkboxes = await page.$$('input[type="checkbox"]');
  for (const checkbox of checkboxes) {
    await checkbox.click();
    console.log('Marcada casilla de verificación');
    await page.waitForTimeout(300);
  }
}

// Función para manejar ejercicios de tipo Cambridge Dropdown
async function answerCambridgeDropdownQuestions(page) {
  console.log('Respondiendo preguntas de tipo Cambridge Dropdown...');
  
  try {
    // Tomar una captura de pantalla antes de interactuar
    await takeScreenshot(page, 'before_cambridge_dropdown');
    
    // Intentar diferentes estrategias para encontrar y hacer clic en los elementos
    
    // Estrategia 1: Buscar elementos con la clase draggable__content
    const draggableElements = await page.$$('div.content.draggable__content, div.draggable__content, .draggable__content');
    
    if (draggableElements.length > 0) {
      console.log(`Estrategia 1: Encontrados ${draggableElements.length} elementos draggable__content`);
      
      // Hacer clic en cada elemento draggable__content
      for (let i = 0; i < draggableElements.length; i++) {
        try {
          console.log(`Haciendo clic en elemento draggable__content ${i + 1}`);
          await draggableElements[i].click();
          await page.waitForTimeout(1500); // Esperar para ver si aparece un menú desplegable
          
          // Tomar captura después del clic
          await takeScreenshot(page, `after_click_draggable_${i + 1}`);
          
          // Buscar si hay opciones desplegables y seleccionar una
          const dropdownOptions = await page.$$('.dropdown-option, .option, li, [role="option"]');
          if (dropdownOptions.length > 0) {
            console.log(`Encontradas ${dropdownOptions.length} opciones desplegables`);
            
            // Seleccionar la opción 'disappointing' si está disponible
            const targetOption = await page.evaluate(() => {
              const options = Array.from(document.querySelectorAll('.dropdown-option, .option, li, span, [role="option"]'));
              return options.find(opt => {
                const text = opt.innerText || opt.textContent || '';
                return text.toLowerCase().includes('disappointing');
              });
            });
            
            if (targetOption) {
              console.log('Encontrada opción "disappointing", haciendo clic...');
              await page.evaluate(() => {
                const options = Array.from(document.querySelectorAll('.dropdown-option, .option, li, span, [role="option"]'));
                const target = options.find(opt => {
                  const text = opt.innerText || opt.textContent || '';
                  return text.toLowerCase().includes('disappointing');
                });
                if (target) target.click();
              });
            } else {
              // Si no encontramos 'disappointing', hacer clic en la primera opción
              console.log('No se encontró "disappointing", seleccionando primera opción...');
              await dropdownOptions[0].click();
            }
            
            await page.waitForTimeout(1500);
          }
        } catch (error) {
          console.error(`Error al interactuar con elemento ${i + 1}:`, error);
        }
      }
    } else {
      console.log('No se encontraron elementos draggable__content. Intentando estrategia 2...');
      
      // Estrategia 2: Buscar elementos con la clase firstword
      const firstwordElements = await page.$$('span.firstword');
      
      if (firstwordElements.length > 0) {
        console.log(`Estrategia 2: Encontrados ${firstwordElements.length} elementos firstword`);
        
        // Hacer clic directamente en el elemento con texto 'disappointing'
        const clickedDisappointing = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('span.firstword, div, span'));
          const target = elements.find(el => {
            const text = el.innerText || el.textContent || '';
            return text.toLowerCase().includes('disappointing');
          });
          
          if (target) {
            console.log('Elemento con texto "disappointing" encontrado, haciendo clic...');
            target.click();
            return true;
          }
          return false;
        });
        
        if (clickedDisappointing) {
          console.log('Clic en elemento "disappointing" realizado');
        } else {
          console.log('No se encontró elemento con texto "disappointing". Haciendo clic en el primer firstword...');
          await firstwordElements[0].click();
        }
        
        await page.waitForTimeout(1500);
      } else {
        console.log('No se encontraron elementos firstword. Intentando estrategia 3...');
        
        // Estrategia 3: Buscar cualquier elemento que pueda ser interactivo
        await page.evaluate(() => {
          // Intentar hacer clic en elementos que parezcan opciones o botones
          const interactiveElements = Array.from(document.querySelectorAll('div, span, button, a, li'));
          const target = interactiveElements.find(el => {
            const text = el.innerText || el.textContent || '';
            return text.toLowerCase().includes('disappointing') || text.toLowerCase().includes('surprised');
          });
          
          if (target) {
            console.log('Elemento interactivo encontrado, haciendo clic...');
            target.click();
            return true;
          }
          return false;
        });
      }
    }
    
    // Tomar una captura de pantalla después de interactuar
    await takeScreenshot(page, 'after_cambridge_dropdown');
    
    return true;
  } catch (error) {
    console.error('Error en ejercicio Cambridge Dropdown:', error);
    await takeScreenshot(page, 'error_cambridge_dropdown');
    return false;
  }
}

// Función para tomar capturas de pantalla
async function takeScreenshot(page, name) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Crear directorio si no existe
    if (!fs.existsSync(config.screenshotPath)) {
      fs.mkdirSync(config.screenshotPath, { recursive: true });
    }
    
    // Generar nombre de archivo con marca de tiempo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(config.screenshotPath, `${name}_${timestamp}.png`);
    
    // Tomar la captura de pantalla
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Captura de pantalla guardada: ${filename}`);
  } catch (error) {
    console.error('Error al tomar captura de pantalla:', error);
  }
}

// Función para hacer clic en el botón Next
async function clickNextButton(page) {
  console.log('Buscando botón Next...');
  
  try {
    // Esperar un momento para que aparezca el botón Next
    await page.waitForTimeout(2000);
    
    // Tomar captura antes de buscar el botón
    await takeScreenshot(page, 'before_next_button');
    
    // Buscar el botón Next por su selector específico
    const nextButtonFound = await page.evaluate(() => {
      // Buscar por el selector exacto del botón Next
      const nextButton = document.querySelector('a.btn[title="Next"]');
      if (nextButton) {
        console.log('Botón Next encontrado por selector específico');
        nextButton.click();
        return true;
      }
      
      // Si no lo encontramos por el selector específico, buscar por texto
      const buttons = Array.from(document.querySelectorAll('a, button, [role="button"]'));
      const nextByText = buttons.find(btn => {
        const text = btn.innerText || btn.textContent || btn.title || '';
        return text.toLowerCase().includes('next');
      });
      
      if (nextByText) {
        console.log('Botón Next encontrado por texto');
        nextByText.click();
        return true;
      }
      
      return false;
    });
    
    if (nextButtonFound) {
      console.log('Botón Next encontrado y clicado');
      await page.waitForTimeout(2000); // Esperar a que cargue la siguiente página
      await takeScreenshot(page, 'after_next_button_click');
      return true;
    } else {
      console.log('No se encontró el botón Next');
      await takeScreenshot(page, 'next_button_not_found');
      return false;
    }
  } catch (error) {
    console.error('Error al buscar el botón Next:', error);
    await takeScreenshot(page, 'error_next_button');
    return false;
  }
}

// Función para enviar las respuestas
async function submitAnswers(page) {
  console.log('Buscando botón para enviar respuestas...');
  
  // Buscar botones de envío comunes (usando selectores estándar)
  const submitButtonSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    '.submit-button',
    '.check-button',
    '[aria-label*="submit"]',
    '[aria-label*="check"]',
    'button.submit',
    'button.check',
    'button.next',
    'input.submit',
    'input.check'
  ];
  
  let submitted = false;
  
  // Intentar con cada selector
  for (const selector of submitButtonSelectors) {
    try {
      if (await page.$(selector)) {
        console.log(`Encontrado botón de envío: ${selector}`);
        await page.click(selector);
        submitted = true;
        break;
      }
    } catch (error) {
      console.log(`Error al intentar con selector ${selector}: ${error.message}`);
    }
  }
  
  // Si no encontramos un botón con los selectores, intentar buscar por texto
  if (!submitted) {
    console.log('Buscando botón de envío por texto...');
    
    try {
      submitted = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, input[type="button"], [role="button"]'));
        const submitButton = buttons.find(button => {
          const text = (button.innerText || button.value || '').toLowerCase();
          return text.includes('submit') || text.includes('check') || 
                 text.includes('enviar') || text.includes('verificar') ||
                 text.includes('next') || text.includes('siguiente');
        });
        
        if (submitButton) {
          submitButton.click();
          return true;
        }
        return false;
      });
      
      if (submitted) {
        console.log('Botón de envío encontrado y clicado por texto');
      }
    } catch (error) {
      console.log(`Error al buscar botón por texto: ${error.message}`);
    }
  }
  
  // Si aún no hemos encontrado un botón, intentar con botones genéricos
  if (!submitted) {
    console.log('Intentando con botones genéricos...');
    
    try {
      // Obtener todos los botones de la página
      const buttons = await page.$$('button, input[type="button"], input[type="submit"]');
      
      if (buttons.length > 0) {
        // Hacer clic en el último botón (suele ser el de enviar/siguiente)
        console.log(`Encontrados ${buttons.length} botones. Haciendo clic en el último...`);
        await buttons[buttons.length - 1].click();
        submitted = true;
      }
    } catch (error) {
      console.log(`Error al intentar con botones genéricos: ${error.message}`);
    }
  }
  
  if (submitted) {
    console.log('Respuestas enviadas correctamente');
  } else {
    console.log('No se encontró ningún botón de envío');
  }
}

// Función para tomar capturas de pantalla
async function takeScreenshot(page, name) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Crear directorio si no existe
    if (!fs.existsSync(config.screenshotPath)) {
      fs.mkdirSync(config.screenshotPath, { recursive: true });
    }
    
    // Generar nombre de archivo con marca de tiempo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(config.screenshotPath, `${name}_${timestamp}.png`);
    
    // Tomar la captura de pantalla
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Captura de pantalla guardada: ${filename}`);
  } catch (error) {
    console.error('Error al tomar captura de pantalla:', error);
  }
}

// Ejecutar el script
main();
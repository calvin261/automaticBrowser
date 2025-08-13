// stagehand_example.js
require('dotenv').config();
const { Stagehand } = require('@browserbasehq/stagehand');
const { z } = require('zod');

async function main() {
  const config = {
    env: 'BROWSERBASE', // Cambia a 'LOCAL' si quieres correr localmente
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    verbose: 1,
  };

  const stagehand = new Stagehand(config);
  try {
    await stagehand.init();
    const page = stagehand.page;
    await page.goto('https://docs.stagehand.dev/');
    await page.act('click the quickstart link');
    const result = await page.extract({
      instruction: 'extract the main heading of the page',
      schema: z.object({ heading: z.string() }),
    });
    console.log(`Extracted: ${result.heading}`);
  } catch (error) {
    console.error(error);
  } finally {
    await stagehand.close();
  }
}

main();

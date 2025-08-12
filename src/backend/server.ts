// Point d'entrée principal
import App from './app';

async function main(): Promise<void> {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.error('❌ Application failed to start:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default main;
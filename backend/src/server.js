import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import { connectMongo } from './config/db.js';
import logger from './config/logger.js';
import { startClaimDigestScheduler } from './services/digest.service.js';

const port = Number(process.env.PORT || 4000);

async function start() {
  try {
    await connectMongo();
    const httpServer = createServer(app);
    httpServer.listen(port, () => {
      logger.info({ port }, 'API server listening');
    });
    startClaimDigestScheduler();
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();



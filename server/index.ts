// [GSA-SRV-B-ENTRY]
import 'dotenv/config';
import express from 'express';
import { registerRoutes } from './routes';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// [GSA-SRV-B-ENTRY-01: Health Check]
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// [GSA-SRV-B-ENTRY-02: Server Boot Initialization]
(async () => {
  try {
    const server = await registerRoutes(app);

    // Serve static client build in production
    const clientDist = path.resolve(process.cwd(), 'client/dist');
    if (fs.existsSync(clientDist)) {
      app.use(express.static(clientDist));
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(clientDist, 'index.html'));
        }
      });
    }
    
    const PORT = Number(process.env.PORT) || 5001;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`[API Server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

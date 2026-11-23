"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [GSA-SRV-B-ENTRY]
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// [GSA-SRV-B-ENTRY-01: Health Check]
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
// [GSA-SRV-B-ENTRY-02: Server Boot Initialization]
(async () => {
    try {
        const server = await (0, routes_1.registerRoutes)(app);
        const PORT = Number(process.env.PORT) || 5001;
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`[API Server] Running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
})();

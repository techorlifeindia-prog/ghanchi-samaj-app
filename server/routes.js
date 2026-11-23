"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const storage_1 = require("./storage");
async function registerRoutes(app) {
    // [GSA-SRV-B-ROUTES-01: API Endpoints]
    // API Auth Send OTP (Email / WhatsApp)
    app.post("/api/auth/send-otp", async (req, res) => {
        try {
            const { type, target } = req.body;
            console.log(`[Auth API] Sending ${type} OTP to ${target}`);
            res.json({ success: true, message: `OTP sent successfully to ${target}`, demoOtp: "123456" });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Auth Verify OTP
    app.post("/api/auth/verify-otp", async (req, res) => {
        try {
            const { type, target, otp } = req.body;
            if (otp === "123456") {
                res.json({ success: true, user: { name: "विक्रम घाँची", role: "member", memberId: "GHS-1042" } });
            }
            else {
                res.status(400).json({ success: false, error: "Invalid OTP" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Directory Search
    app.get("/api/members", async (req, res) => {
        try {
            const query = req.query.q;
            const gotra = req.query.gotra;
            const members = await storage_1.storage.getMemberProfiles(query, gotra);
            res.json({ success: true, count: members.length, data: members });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Matrimonial Profiles
    app.get("/api/matrimony", async (req, res) => {
        try {
            const profiles = await storage_1.storage.getMatrimonialProfiles();
            res.json({ success: true, count: profiles.length, data: profiles });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Family Tree
    app.get("/api/family-tree/:familyId", async (req, res) => {
        try {
            const { familyId } = req.params;
            const tree = await storage_1.storage.getFamilyTree(familyId);
            res.json({ success: true, data: tree });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    app.post("/api/family-tree", async (req, res) => {
        try {
            const member = await storage_1.storage.addFamilyMember(req.body);
            res.json({ success: true, data: member });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API AI Assistant Status Update Mutation
    app.post("/api/update-marital-status", async (req, res) => {
        try {
            const { memberName, status } = req.body;
            if (!memberName || !status) {
                return res.status(400).json({ success: false, error: "memberName and status required" });
            }
            const updated = await storage_1.storage.updateMaritalStatus(memberName, status);
            res.json({ success: true, updated, memberName, status });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Masked Aadhaar Verification
    app.post("/api/kyc/verify-aadhaar", async (req, res) => {
        try {
            const { userId, maskedAadhaar } = req.body;
            const result = await storage_1.storage.verifyAadhaar(userId || "user-1", maskedAadhaar || "XXXX-XXXX-1042");
            res.json({ success: true, data: result });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Admin KYC Queue
    app.get("/api/admin/kyc-queue", async (req, res) => {
        try {
            const kycList = await storage_1.storage.getPendingKYC();
            res.json({ success: true, data: kycList });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    app.put("/api/admin/kyc-queue/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body; // 'verified' | 'rejected'
            const updated = await storage_1.storage.updateKYCStatus(id, status);
            res.json({ success: updated });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    // API Admin Members
    app.get("/api/admin/members", async (req, res) => {
        try {
            const members = await storage_1.storage.getAdminMembers();
            res.json({ success: true, data: members });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    app.post("/api/admin/members", async (req, res) => {
        try {
            const newMember = await storage_1.storage.createAdminMember(req.body);
            res.json({ success: true, data: newMember });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    app.put("/api/admin/members/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await storage_1.storage.updateAdminMember(id, req.body);
            if (!updated) {
                return res.status(404).json({ success: false, error: "Member not found" });
            }
            res.json({ success: true, data: updated });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    app.delete("/api/admin/members/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await storage_1.storage.deleteMember(id);
            res.json({ success: deleted });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}

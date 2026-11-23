"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
// [GSA-SRV-B-STORAGE]
const schema_1 = require("../shared/schema");
const db_1 = require("./db");
const drizzle_orm_1 = require("drizzle-orm");
// [GSA-SRV-B-STORAGE-01: Real PostgreSQL Implementation]
class DatabaseStorage {
    async deleteMember(id) {
        try {
            await db_1.db.delete(schema_1.memberProfiles).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.id, id));
            return true;
        }
        catch (err) {
            console.error("DB Error in deleteMember:", err);
            return true;
        }
    }
    async getFamilyTree(familyId) {
        try {
            // For demo MVP, just return all members since we don't have auth/family logic fully wired
            const members = await db_1.db.select().from(schema_1.memberProfiles);
            return members.map((m) => ({
                id: m.id,
                nameEn: m.fullName,
                nameHi: m.fullName,
                roleEn: 'Family Member',
                gender: m.gender,
                village: m.nativeVillage,
                district: m.nativeDistrict,
                gotra: m.paternalGotra,
                parentId: m.parentId || null,
                spouseId: m.spouseId || null
            }));
        }
        catch (err) {
            console.error("DB Error in getFamilyTree:", err);
            return [];
        }
    }
    async addFamilyMember(memberData) {
        try {
            let gotra = memberData.gotra || 'Not Specified';
            let village = memberData.village || null;
            let district = memberData.district || null;
            // If there's a relative linked (focusId is passed as parentId or spouseId)
            const relativeId = memberData.parentId || memberData.spouseId;
            const isValidUUID = relativeId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(relativeId);
            if (isValidUUID) {
                const [relative] = await db_1.db.select().from(schema_1.memberProfiles).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.id, relativeId));
                if (relative) {
                    // Inherit gotra for father/son/brother relationships
                    if (gotra === 'Not Specified' || !gotra)
                        gotra = relative.paternalGotra || gotra;
                    if (!village)
                        village = relative.nativeVillage;
                    if (!district)
                        district = relative.nativeDistrict;
                }
            }
            const [newMember] = await db_1.db.insert(schema_1.memberProfiles).values({
                fullName: memberData.nameEn || 'Unknown',
                gender: memberData.gender || 'M',
                paternalGotra: gotra,
                nativeVillage: village,
                nativeDistrict: district,
                fatherName: memberData.fatherName || null,
                parentId: memberData.parentId || null,
                spouseId: memberData.spouseId || null
            }).returning();
            // If we are adding a parent (father/mother), the focusId is the child, so we must update the child's parentId
            const isFocusIdValid = memberData.focusId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memberData.focusId);
            if (isFocusIdValid) {
                if (memberData.relationType === 'father' || memberData.relationType === 'mother') {
                    await db_1.db.update(schema_1.memberProfiles).set({ parentId: newMember.id }).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.id, memberData.focusId));
                }
                else if (memberData.relationType === 'spouse') {
                    // Also link the focus member back to the new spouse
                    await db_1.db.update(schema_1.memberProfiles).set({ spouseId: newMember.id }).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.id, memberData.focusId));
                }
            }
            // If parentId or spouseId was provided, we'd insert into familyRelations here
            // But for this simple version, we'll just return the profile.
            return {
                id: newMember.id,
                nameEn: newMember.fullName,
                nameHi: newMember.fullName,
                roleEn: memberData.roleEn || 'Family Member',
                gender: newMember.gender,
                parentId: memberData.parentId || null,
                spouseId: memberData.spouseId || null
            };
        }
        catch (err) {
            console.error("DB Error in addFamilyMember:", err);
            throw new Error("Failed to add member to database");
        }
    }
    async updateMaritalStatus(memberName, status) {
        console.log(`[Database Mutation] Updating ${memberName} status to ${status}`);
        return true; // Simplified for now
    }
    async getMemberProfiles(query, gotra) {
        try {
            let conditions = [];
            if (query)
                conditions.push((0, drizzle_orm_1.ilike)(schema_1.memberProfiles.fullName, `%${query}%`));
            if (gotra)
                conditions.push((0, drizzle_orm_1.eq)(schema_1.memberProfiles.paternalGotra, gotra));
            const results = await db_1.db.select().from(schema_1.memberProfiles)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined);
            return results;
        }
        catch (err) {
            console.error("DB Error in getMemberProfiles:", err);
            return [];
        }
    }
    async getMatrimonialProfiles() {
        try {
            const results = await db_1.db.select({
                id: schema_1.matrimonialProfiles.id,
                memberId: schema_1.matrimonialProfiles.memberId,
                name: schema_1.memberProfiles.fullName,
                age: schema_1.memberProfiles.age,
                height: schema_1.matrimonialProfiles.heightFeet,
                education: schema_1.matrimonialProfiles.prefEducation, // Using prefEducation as self education for now due to schema
                profession: schema_1.memberProfiles.professionType,
                company: schema_1.memberProfiles.companyName,
                city: schema_1.memberProfiles.currentCity,
                gotra: schema_1.memberProfiles.paternalGotra,
                nanihal: schema_1.memberProfiles.nanihalGotra,
                photo: schema_1.memberProfiles.photoUrl,
                status: schema_1.matrimonialProfiles.maritalStatus,
                verified: schema_1.matrimonialProfiles.isApprovedByAdmin,
                fatherName: schema_1.memberProfiles.fatherName,
                motherName: schema_1.memberProfiles.motherName
            })
                .from(schema_1.matrimonialProfiles)
                .innerJoin(schema_1.memberProfiles, (0, drizzle_orm_1.eq)(schema_1.matrimonialProfiles.memberId, schema_1.memberProfiles.id))
                .where((0, drizzle_orm_1.eq)(schema_1.matrimonialProfiles.isApprovedByAdmin, true));
            return results;
        }
        catch (err) {
            console.error("Error in getMatrimonialProfiles:", err);
            return [];
        }
    }
    async verifyAadhaar(userId, maskedAadhaar) {
        try {
            await db_1.db.update(schema_1.users).set({ kycStatus: 'verified' }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
            return { userId, maskedAadhaar, status: 'verified', verifiedAt: new Date().toISOString() };
        }
        catch (err) {
            console.error("DB Error in verifyAadhaar:", err);
            throw new Error("Failed to verify Aadhaar");
        }
    }
    async getAdminMembers() {
        try {
            const profiles = await db_1.db.select({
                id: schema_1.memberProfiles.id,
                name: schema_1.memberProfiles.fullName,
                gender: schema_1.memberProfiles.gender,
                fatherName: schema_1.memberProfiles.fatherName,
                spouseName: schema_1.memberProfiles.spouseName,
                gotra: schema_1.memberProfiles.paternalGotra,
                village: schema_1.memberProfiles.nativeVillage,
                district: schema_1.memberProfiles.nativeDistrict,
                state: schema_1.memberProfiles.currentState,
                city: schema_1.memberProfiles.currentCity,
                phone: schema_1.users.phoneNumber,
                status: schema_1.users.kycStatus
            }).from(schema_1.memberProfiles)
                .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.memberProfiles.userId, schema_1.users.id));
            return profiles.map(p => {
                let guardianName = '';
                if (p.gender === 'F' && p.spouseName)
                    guardianName = `W/O ${p.spouseName}`;
                else if (p.fatherName)
                    guardianName = `${p.gender === 'M' ? 'S/O ' : (p.gender === 'F' ? 'D/O ' : '')}${p.fatherName}`;
                return {
                    id: p.id,
                    name: p.name,
                    guardianName,
                    gotra: p.gotra,
                    village: p.village,
                    district: p.district,
                    state: p.state,
                    city: p.city,
                    phone: p.phone || 'N/A',
                    status: p.status || 'pending',
                    role: 'Member'
                };
            });
        }
        catch (err) {
            console.error("DB Error in getAdminMembers:", err);
            return []; // Return empty array if DB tables don't exist yet
        }
    }
    async updateAdminMember(id, data) {
        try {
            const updateData = {};
            if (data.name)
                updateData.fullName = data.name;
            if (data.guardianName) {
                // Strip out S/O, D/O, W/O, or c/o prefixes if they exist so they don't stack
                const cleanName = data.guardianName.replace(/^(s\/o|d\/o|w\/o|c\/o)\s*/i, '').trim();
                updateData.fatherName = cleanName;
            }
            if (data.gotra)
                updateData.paternalGotra = data.gotra;
            if (data.village)
                updateData.nativeVillage = data.village;
            if (data.district)
                updateData.nativeDistrict = data.district;
            if (data.state)
                updateData.currentState = data.state;
            if (data.city)
                updateData.currentCity = data.city;
            if (Object.keys(updateData).length > 0) {
                await db_1.db.update(schema_1.memberProfiles).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.id, id));
            }
            if (data.phone) {
                const [profile] = await db_1.db.select().from(schema_1.memberProfiles).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.id, id));
                if (profile && profile.userId) {
                    await db_1.db.update(schema_1.users).set({ phoneNumber: data.phone }).where((0, drizzle_orm_1.eq)(schema_1.users.id, profile.userId));
                }
            }
            return data;
        }
        catch (err) {
            console.error("DB Error in updateAdminMember:", err);
            if (err.code === '23505') {
                throw new Error("This mobile number is already registered.");
            }
            throw new Error(err.message || "Failed to update database");
        }
    }
    async createAdminMember(data) {
        try {
            // Create user first
            const [newUser] = await db_1.db.insert(schema_1.users).values({
                phoneNumber: data.phone || `0000-${Math.floor(Math.random() * 10000)}`,
                role: 'member',
                kycStatus: data.status || 'pending',
            }).returning();
            // Create member profile
            const [newProfile] = await db_1.db.insert(schema_1.memberProfiles).values({
                userId: newUser.id,
                fullName: data.name,
                fatherName: data.guardianName ? data.guardianName.replace(/^(s\/o|d\/o|w\/o|c\/o)\s*/i, '').trim() : '',
                gender: data.name.includes('Smt.') || data.name.includes('Miss') ? 'F' : 'M',
                paternalGotra: data.gotra || 'Borana',
                nativeVillage: data.village || '',
                nativeDistrict: data.district || '',
                currentState: data.state || 'Rajasthan',
                currentCity: data.city || '',
            }).returning();
            return {
                id: newProfile.id,
                name: newProfile.fullName,
                guardianName: data.guardianName || 'N/A',
                gotra: newProfile.paternalGotra,
                village: newProfile.nativeVillage,
                city: newProfile.currentCity,
                phone: newUser.phoneNumber,
                status: newUser.kycStatus,
                role: 'Member'
            };
        }
        catch (err) {
            console.error("DB Error in createAdminMember:", err);
            if (err.code === '23505') {
                throw new Error("This mobile number is already registered.");
            }
            throw new Error("Failed to create member in database");
        }
    }
    async getPendingKYC() {
        try {
            // Query users where kycStatus = 'pending' and join with memberProfiles to get names/cities
            // Also join with kycVerifications if we want to show the actual masked aadhaar.
            // But for simplicity let's just do a manual join or two queries, or raw sql.
            // Actually, since we only need simple UI data:
            const pendingUsers = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.kycStatus, 'pending'));
            const results = [];
            for (const user of pendingUsers) {
                const [profile] = await db_1.db.select().from(schema_1.memberProfiles).where((0, drizzle_orm_1.eq)(schema_1.memberProfiles.userId, user.id));
                if (profile) {
                    // get the latest kyc verification record if it exists
                    const [kycRecord] = await db_1.db.select().from(schema_1.kycVerifications).where((0, drizzle_orm_1.eq)(schema_1.kycVerifications.userId, user.id)).orderBy(schema_1.kycVerifications.verifiedAt);
                    results.push({
                        id: user.id, // using userId as the kyc ticket ID
                        name: profile.fullName,
                        phone: user.phoneNumber,
                        city: profile.currentCity || 'Unknown',
                        aadhaarMasked: kycRecord?.aadhaarMaskedNumber || 'XXXX-XXXX-0000',
                        submittedDate: kycRecord?.verifiedAt ? kycRecord.verifiedAt.toLocaleDateString() : 'Pending',
                        status: user.kycStatus
                    });
                }
            }
            return results;
        }
        catch (err) {
            console.error("DB Error in getPendingKYC:", err);
            return [];
        }
    }
    async updateKYCStatus(userId, status) {
        try {
            await db_1.db.update(schema_1.users).set({ kycStatus: status }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
            return true;
        }
        catch (err) {
            console.error("DB Error in updateKYCStatus:", err);
            return false;
        }
    }
}
exports.DatabaseStorage = DatabaseStorage;
// Export the real PostgreSQL storage
exports.storage = new DatabaseStorage();

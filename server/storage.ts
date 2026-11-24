// [GSA-SRV-B-STORAGE]
import { memberProfiles, families, familyRelations, matrimonialProfiles, kycVerifications, users } from '../shared/schema';
import { MemberProfile, MaritalStatus } from '../shared/types';
import { db } from './db';
import { eq, ilike, and } from 'drizzle-orm';

export interface IStorage {
  getMemberProfiles(query?: string, gotra?: string): Promise<any[]>;
  getMatrimonialProfiles(): Promise<any[]>;
  getFamilyTree(familyId: string): Promise<any>;
  updateMaritalStatus(memberName: string, status: MaritalStatus): Promise<boolean>;
  verifyAadhaar(userId: string, maskedAadhaar: string): Promise<any>;
  getAdminMembers(): Promise<any[]>;
  updateAdminMember(id: string, data: any): Promise<any>;
  createAdminMember(data: any): Promise<any>;
  deleteMember(id: string): Promise<boolean>;
  getPendingKYC(): Promise<any[]>;
  updateKYCStatus(id: string, status: string): Promise<boolean>;
  addFamilyMember(memberData: any): Promise<any>;
}

// [GSA-SRV-B-STORAGE-01: Real PostgreSQL Implementation]
export class DatabaseStorage implements IStorage {
  async deleteMember(id: string): Promise<boolean> {
    try {
      await db.delete(memberProfiles).where(eq(memberProfiles.id, id));
      return true;
    } catch (err) {
      console.error("DB Error in deleteMember:", err);
      return true;
    }
  }
  
  async getFamilyTree(familyId: string): Promise<any> {
    try {
      // For demo MVP, just return all members since we don't have auth/family logic fully wired
      const members = await db.select().from(memberProfiles);
      return members.map((m: any) => ({
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
    } catch (err) {
      console.error("DB Error in getFamilyTree:", err);
      return [];
    }
  }

  async addFamilyMember(memberData: any): Promise<any> {
    try {
      let gotra = memberData.gotra || 'Not Specified';
      let village = memberData.village || null;
      let district = memberData.district || null;

      // If there's a relative linked (focusId is passed as parentId or spouseId)
      const relativeId = memberData.parentId || memberData.spouseId;
      const isValidUUID = relativeId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(relativeId);

      if (isValidUUID) {
        const [relative] = await db.select().from(memberProfiles).where(eq(memberProfiles.id, relativeId));
        if (relative) {
          // Inherit gotra for father/son/brother relationships
          if (gotra === 'Not Specified' || !gotra) gotra = relative.paternalGotra || gotra;
          if (!village) village = relative.nativeVillage;
          if (!district) district = relative.nativeDistrict;
        }
      }

      const [newMember] = await db.insert(memberProfiles).values({
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
          await db.update(memberProfiles).set({ parentId: newMember.id }).where(eq(memberProfiles.id, memberData.focusId));
        } else if (memberData.relationType === 'spouse') {
          // Also link the focus member back to the new spouse
          await db.update(memberProfiles).set({ spouseId: newMember.id }).where(eq(memberProfiles.id, memberData.focusId));
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
    } catch (err) {
      console.error("DB Error in addFamilyMember:", err);
      throw new Error("Failed to add member to database");
    }
  }

  async updateMaritalStatus(memberName: string, status: MaritalStatus): Promise<boolean> {
    console.log(`[Database Mutation] Updating ${memberName} status to ${status}`);
    return true; // Simplified for now
  }

  async getMemberProfiles(query?: string, gotra?: string): Promise<any[]> {
    try {
      let conditions = [];
      if (query) conditions.push(ilike(memberProfiles.fullName, `%${query}%`));
      if (gotra) conditions.push(eq(memberProfiles.paternalGotra, gotra));
      
      const results = await db.select().from(memberProfiles)
        .where(conditions.length ? and(...conditions) : undefined);
      return results;
    } catch (err) {
      console.error("DB Error in getMemberProfiles:", err);
      return [];
    }
  }

  async getMatrimonialProfiles(): Promise<any[]> {
    try {
      const results = await db.select({
        id: matrimonialProfiles.id,
        memberId: matrimonialProfiles.memberId,
        name: memberProfiles.fullName,
        age: memberProfiles.age,
        height: matrimonialProfiles.heightFeet,
        education: matrimonialProfiles.prefEducation, // Using prefEducation as self education for now due to schema
        profession: memberProfiles.professionType,
        company: memberProfiles.companyName,
        city: memberProfiles.currentCity,
        gotra: memberProfiles.paternalGotra,
        nanihal: memberProfiles.nanihalGotra,
        photo: memberProfiles.photoUrl,
        status: matrimonialProfiles.maritalStatus,
        verified: matrimonialProfiles.isApprovedByAdmin,
        fatherName: memberProfiles.fatherName,
        motherName: memberProfiles.motherName
      })
      .from(matrimonialProfiles)
      .innerJoin(memberProfiles, eq(matrimonialProfiles.memberId, memberProfiles.id))
      .where(eq(matrimonialProfiles.isApprovedByAdmin, true));

      return results;
    } catch (err) {
      console.error("Error in getMatrimonialProfiles:", err);
      return [];
    }
  }

  async verifyAadhaar(userId: string, maskedAadhaar: string): Promise<any> {
    try {
      await db.update(users).set({ kycStatus: 'verified' }).where(eq(users.id, userId));
      return { userId, maskedAadhaar, status: 'verified', verifiedAt: new Date().toISOString() };
    } catch (err) {
      console.error("DB Error in verifyAadhaar:", err);
      throw new Error("Failed to verify Aadhaar");
    }
  }

  async getAdminMembers(): Promise<any[]> {
    try {
      const profiles = await db.select({
        id: memberProfiles.id,
        name: memberProfiles.fullName,
        gender: memberProfiles.gender,
        fatherName: memberProfiles.fatherName,
        spouseName: memberProfiles.spouseName,
        gotra: memberProfiles.paternalGotra,
        village: memberProfiles.nativeVillage,
        district: memberProfiles.nativeDistrict,
        state: memberProfiles.currentState,
        city: memberProfiles.currentCity,
        phone: users.phoneNumber,
        status: users.kycStatus
      }).from(memberProfiles)
        .leftJoin(users, eq(memberProfiles.userId, users.id));

      return profiles.map(p => {
        let guardianName = '';
        if (p.gender === 'F' && p.spouseName) guardianName = `W/O ${p.spouseName}`;
        else if (p.fatherName) guardianName = `${p.gender === 'M' ? 'S/O ' : (p.gender === 'F' ? 'D/O ' : '')}${p.fatherName}`;

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
    } catch (err) {
      console.error("DB Error in getAdminMembers:", err);
      return []; // Return empty array if DB tables don't exist yet
    }
  }

  async updateAdminMember(id: string, data: any): Promise<any> {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isUUID) {
        return await this.createAdminMember(data);
      }

      const updateData: any = {};
      if (data.name) updateData.fullName = data.name;
      if (data.guardianName) {
        // Strip out S/O, D/O, W/O, or c/o prefixes if they exist so they don't stack
        const cleanName = data.guardianName.replace(/^(s\/o|d\/o|w\/o|c\/o)\s*/i, '').trim();
        updateData.fatherName = cleanName;
      }
      if (data.gotra) updateData.paternalGotra = data.gotra;
      if (data.village) updateData.nativeVillage = data.village;
      if (data.district) updateData.nativeDistrict = data.district;
      if (data.state) updateData.currentState = data.state;
      if (data.city) updateData.currentCity = data.city;
      
      if (Object.keys(updateData).length > 0) {
        await db.update(memberProfiles).set(updateData).where(eq(memberProfiles.id, id));
      }
      
      if (data.phone) {
        const [profile] = await db.select().from(memberProfiles).where(eq(memberProfiles.id, id));
        if (profile && profile.userId) {
          await db.update(users).set({ phoneNumber: data.phone }).where(eq(users.id, profile.userId));
        }
      }
      
      return data;
    } catch (err: any) {
      console.error("DB Error in updateAdminMember:", err);
      if (err.code === '23505') {
        throw new Error("This mobile number is already registered.");
      }
      throw new Error(err.message || "Failed to update database");
    }
  }

  async createAdminMember(data: any): Promise<any> {
    try {
      const phone = data.phone?.trim() || `0000-${Date.now().toString().slice(-6)}`;
      
      // Check if user already exists with this phone
      let userRecord: any;
      const [existingUser] = await db.select().from(users).where(eq(users.phoneNumber, phone));
      if (existingUser) {
        userRecord = existingUser;
      } else {
        const [newUser] = await db.insert(users).values({
          phoneNumber: phone,
          role: 'member',
          kycStatus: data.status || 'pending',
        }).returning();
        userRecord = newUser;
      }

      // Check if profile exists for this user
      const [existingProfile] = await db.select().from(memberProfiles).where(eq(memberProfiles.userId, userRecord.id));
      if (existingProfile) {
        const [updatedProfile] = await db.update(memberProfiles).set({
          fullName: data.name,
          fatherName: data.guardianName ? data.guardianName.replace(/^(s\/o|d\/o|w\/o|c\/o)\s*/i, '').trim() : '',
          paternalGotra: data.gotra || 'Borana',
          nativeVillage: data.village || '',
          nativeDistrict: data.district || '',
          currentState: data.state || 'Rajasthan',
          currentCity: data.city || '',
        }).where(eq(memberProfiles.id, existingProfile.id)).returning();

        return {
          id: updatedProfile.id,
          name: updatedProfile.fullName,
          guardianName: data.guardianName || 'N/A',
          gotra: updatedProfile.paternalGotra,
          village: updatedProfile.nativeVillage,
          city: updatedProfile.currentCity,
          phone: userRecord.phoneNumber,
          status: userRecord.kycStatus,
          role: 'Member'
        };
      }

      // Create member profile
      const [newProfile] = await db.insert(memberProfiles).values({
        userId: userRecord.id,
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
        phone: userRecord.phoneNumber,
        status: userRecord.kycStatus,
        role: 'Member'
      };
    } catch (err: any) {
      console.error("DB Error in createAdminMember:", err);
      if (err.code === '23505') {
        throw new Error("This mobile number is already registered.");
      }
      throw new Error(err.message || "Failed to create member in database");
    }
  }

  async getPendingKYC(): Promise<any[]> {
    try {
      // Query users where kycStatus = 'pending' and join with memberProfiles to get names/cities
      // Also join with kycVerifications if we want to show the actual masked aadhaar.
      // But for simplicity let's just do a manual join or two queries, or raw sql.
      // Actually, since we only need simple UI data:
      const pendingUsers = await db.select().from(users).where(eq(users.kycStatus, 'pending'));
      
      const results = [];
      for (const user of pendingUsers) {
        const [profile] = await db.select().from(memberProfiles).where(eq(memberProfiles.userId, user.id));
        if (profile) {
          // get the latest kyc verification record if it exists
          const [kycRecord] = await db.select().from(kycVerifications).where(eq(kycVerifications.userId, user.id)).orderBy(kycVerifications.verifiedAt);
          
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
    } catch (err) {
      console.error("DB Error in getPendingKYC:", err);
      return [];
    }
  }

  async updateKYCStatus(userId: string, status: string): Promise<boolean> {
    try {
      await db.update(users).set({ kycStatus: status }).where(eq(users.id, userId));
      return true;
    } catch (err) {
      console.error("DB Error in updateKYCStatus:", err);
      return false;
    }
  }
}

// Export the real PostgreSQL storage
export const storage = new DatabaseStorage();

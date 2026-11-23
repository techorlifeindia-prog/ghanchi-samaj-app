"use strict";
// [GSA-SHR-B-SCH-01: Drizzle ORM Database Schema]
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycVerifications = exports.matrimonialProfiles = exports.familyRelations = exports.families = exports.memberProfiles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    phoneNumber: (0, pg_core_1.varchar)('phone_number', { length: 15 }).notNull().unique(),
    role: (0, pg_core_1.varchar)('role', { length: 20 }).default('member').notNull(),
    kycStatus: (0, pg_core_1.varchar)('kyc_status', { length: 20 }).default('pending').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.memberProfiles = (0, pg_core_1.pgTable)('member_profiles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }),
    familyId: (0, pg_core_1.uuid)('family_id'),
    fullName: (0, pg_core_1.varchar)('full_name', { length: 100 }).notNull(),
    gender: (0, pg_core_1.varchar)('gender', { length: 10 }).notNull(),
    dob: (0, pg_core_1.date)('dob'),
    age: (0, pg_core_1.integer)('age'),
    bloodGroup: (0, pg_core_1.varchar)('blood_group', { length: 5 }),
    fatherName: (0, pg_core_1.varchar)('father_name', { length: 100 }),
    motherName: (0, pg_core_1.varchar)('mother_name', { length: 100 }),
    spouseName: (0, pg_core_1.varchar)('spouse_name', { length: 100 }),
    parentId: (0, pg_core_1.varchar)('parent_id', { length: 100 }), // Added for easy UI tree mapping
    spouseId: (0, pg_core_1.varchar)('spouse_id', { length: 100 }), // Added for easy UI tree mapping
    nanihalGotra: (0, pg_core_1.varchar)('nanihal_gotra', { length: 50 }),
    nanihalPlace: (0, pg_core_1.varchar)('nanihal_place', { length: 100 }),
    paternalGotra: (0, pg_core_1.varchar)('paternal_gotra', { length: 50 }).notNull(),
    nativePlace: (0, pg_core_1.varchar)('native_place', { length: 100 }),
    nativeVillage: (0, pg_core_1.varchar)('native_village', { length: 100 }),
    nativeDistrict: (0, pg_core_1.varchar)('native_district', { length: 100 }),
    currentAddress: (0, pg_core_1.text)('current_address'),
    currentCity: (0, pg_core_1.varchar)('current_city', { length: 100 }),
    currentDistrict: (0, pg_core_1.varchar)('current_district', { length: 100 }),
    currentState: (0, pg_core_1.varchar)('current_state', { length: 100 }),
    pincode: (0, pg_core_1.varchar)('pincode', { length: 10 }),
    educationQualification: (0, pg_core_1.varchar)('education_qualification', { length: 100 }),
    professionType: (0, pg_core_1.varchar)('profession_type', { length: 50 }),
    professionDetails: (0, pg_core_1.text)('profession_details'),
    companyName: (0, pg_core_1.varchar)('company_name', { length: 150 }),
    photoUrl: (0, pg_core_1.text)('photo_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.families = (0, pg_core_1.pgTable)('families', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    familyCode: (0, pg_core_1.varchar)('family_code', { length: 20 }).notNull().unique(),
    headMemberId: (0, pg_core_1.uuid)('head_member_id').references(() => exports.memberProfiles.id),
    familyType: (0, pg_core_1.varchar)('family_type', { length: 20 }).default('joint').notNull(),
    nativeDistrict: (0, pg_core_1.varchar)('native_district', { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.familyRelations = (0, pg_core_1.pgTable)('family_relations', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    fromMemberId: (0, pg_core_1.uuid)('from_member_id').references(() => exports.memberProfiles.id, { onDelete: 'cascade' }).notNull(),
    toMemberId: (0, pg_core_1.uuid)('to_member_id').references(() => exports.memberProfiles.id, { onDelete: 'cascade' }).notNull(),
    relationType: (0, pg_core_1.varchar)('relation_type', { length: 30 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.matrimonialProfiles = (0, pg_core_1.pgTable)('matrimonial_profiles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    memberId: (0, pg_core_1.uuid)('member_id').references(() => exports.memberProfiles.id, { onDelete: 'cascade' }).notNull().unique(),
    maritalStatus: (0, pg_core_1.varchar)('marital_status', { length: 30 }).notNull(),
    availableForMarriage: (0, pg_core_1.boolean)('available_for_marriage').default(true).notNull(),
    heightFeet: (0, pg_core_1.varchar)('height_feet', { length: 10 }),
    weightKg: (0, pg_core_1.integer)('weight_kg'),
    complexion: (0, pg_core_1.varchar)('complexion', { length: 30 }),
    horoscopeManglik: (0, pg_core_1.varchar)('horoscope_manglik', { length: 20 }).default('no'),
    birthTime: (0, pg_core_1.varchar)('birth_time', { length: 10 }),
    birthPlace: (0, pg_core_1.varchar)('birth_place', { length: 100 }),
    prefMinAge: (0, pg_core_1.integer)('pref_min_age'),
    prefMaxAge: (0, pg_core_1.integer)('pref_max_age'),
    prefEducation: (0, pg_core_1.text)('pref_education'),
    prefDistrict: (0, pg_core_1.text)('pref_district'),
    isApprovedByAdmin: (0, pg_core_1.boolean)('is_approved_by_admin').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull()
});
exports.kycVerifications = (0, pg_core_1.pgTable)('kyc_verifications', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    aadhaarMaskedNumber: (0, pg_core_1.varchar)('aadhaar_masked_number', { length: 20 }).notNull(),
    aadhaarHash: (0, pg_core_1.varchar)('aadhaar_hash', { length: 256 }).notNull(),
    fullNameOnAadhaar: (0, pg_core_1.varchar)('full_name_on_aadhaar', { length: 100 }),
    verifiedAt: (0, pg_core_1.timestamp)('verified_at').defaultNow().notNull()
});

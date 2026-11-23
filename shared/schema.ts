// [GSA-SHR-B-SCH-01: Drizzle ORM Database Schema]

import { pgTable, uuid, varchar, text, integer, boolean, date, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull().unique(),
  role: varchar('role', { length: 20 }).default('member').notNull(),
  kycStatus: varchar('kyc_status', { length: 20 }).default('pending').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const memberProfiles = pgTable('member_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id'),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  dob: date('dob'),
  age: integer('age'),
  bloodGroup: varchar('blood_group', { length: 5 }),
  fatherName: varchar('father_name', { length: 100 }),
  motherName: varchar('mother_name', { length: 100 }),
  spouseName: varchar('spouse_name', { length: 100 }),
  parentId: varchar('parent_id', { length: 100 }), // Added for easy UI tree mapping
  spouseId: varchar('spouse_id', { length: 100 }), // Added for easy UI tree mapping
  nanihalGotra: varchar('nanihal_gotra', { length: 50 }),
  nanihalPlace: varchar('nanihal_place', { length: 100 }),
  paternalGotra: varchar('paternal_gotra', { length: 50 }).notNull(),
  nativePlace: varchar('native_place', { length: 100 }),
  nativeVillage: varchar('native_village', { length: 100 }),
  nativeDistrict: varchar('native_district', { length: 100 }),
  currentAddress: text('current_address'),
  currentCity: varchar('current_city', { length: 100 }),
  currentDistrict: varchar('current_district', { length: 100 }),
  currentState: varchar('current_state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  educationQualification: varchar('education_qualification', { length: 100 }),
  professionType: varchar('profession_type', { length: 50 }),
  professionDetails: text('profession_details'),
  companyName: varchar('company_name', { length: 150 }),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyCode: varchar('family_code', { length: 20 }).notNull().unique(),
  headMemberId: uuid('head_member_id').references(() => memberProfiles.id),
  familyType: varchar('family_type', { length: 20 }).default('joint').notNull(),
  nativeDistrict: varchar('native_district', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const familyRelations = pgTable('family_relations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromMemberId: uuid('from_member_id').references(() => memberProfiles.id, { onDelete: 'cascade' }).notNull(),
  toMemberId: uuid('to_member_id').references(() => memberProfiles.id, { onDelete: 'cascade' }).notNull(),
  relationType: varchar('relation_type', { length: 30 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const matrimonialProfiles = pgTable('matrimonial_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => memberProfiles.id, { onDelete: 'cascade' }).notNull().unique(),
  maritalStatus: varchar('marital_status', { length: 30 }).notNull(),
  availableForMarriage: boolean('available_for_marriage').default(true).notNull(),
  heightFeet: varchar('height_feet', { length: 10 }),
  weightKg: integer('weight_kg'),
  complexion: varchar('complexion', { length: 30 }),
  horoscopeManglik: varchar('horoscope_manglik', { length: 20 }).default('no'),
  birthTime: varchar('birth_time', { length: 10 }),
  birthPlace: varchar('birth_place', { length: 100 }),
  prefMinAge: integer('pref_min_age'),
  prefMaxAge: integer('pref_max_age'),
  prefEducation: text('pref_education'),
  prefDistrict: text('pref_district'),
  isApprovedByAdmin: boolean('is_approved_by_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const kycVerifications = pgTable('kyc_verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  aadhaarMaskedNumber: varchar('aadhaar_masked_number', { length: 20 }).notNull(),
  aadhaarHash: varchar('aadhaar_hash', { length: 256 }).notNull(),
  fullNameOnAadhaar: varchar('full_name_on_aadhaar', { length: 100 }),
  verifiedAt: timestamp('verified_at').defaultNow().notNull()
});

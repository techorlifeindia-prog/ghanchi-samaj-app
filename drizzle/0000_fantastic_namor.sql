CREATE TABLE IF NOT EXISTS "families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_code" varchar(20) NOT NULL,
	"head_member_id" uuid,
	"family_type" varchar(20) DEFAULT 'joint' NOT NULL,
	"native_district" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "families_family_code_unique" UNIQUE("family_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "family_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_member_id" uuid NOT NULL,
	"to_member_id" uuid NOT NULL,
	"relation_type" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kyc_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"aadhaar_masked_number" varchar(20) NOT NULL,
	"aadhaar_hash" varchar(256) NOT NULL,
	"full_name_on_aadhaar" varchar(100),
	"verified_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matrimonial_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"marital_status" varchar(30) NOT NULL,
	"available_for_marriage" boolean DEFAULT true NOT NULL,
	"height_feet" varchar(10),
	"weight_kg" integer,
	"complexion" varchar(30),
	"horoscope_manglik" varchar(20) DEFAULT 'no',
	"birth_time" varchar(10),
	"birth_place" varchar(100),
	"pref_min_age" integer,
	"pref_max_age" integer,
	"pref_education" text,
	"pref_district" text,
	"is_approved_by_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matrimonial_profiles_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"family_id" uuid,
	"full_name" varchar(100) NOT NULL,
	"gender" varchar(10) NOT NULL,
	"dob" date,
	"age" integer,
	"blood_group" varchar(5),
	"father_name" varchar(100),
	"mother_name" varchar(100),
	"spouse_name" varchar(100),
	"nanihal_gotra" varchar(50),
	"nanihal_place" varchar(100),
	"paternal_gotra" varchar(50) NOT NULL,
	"native_place" varchar(100),
	"native_village" varchar(100),
	"native_district" varchar(100),
	"current_address" text,
	"current_city" varchar(100),
	"current_district" varchar(100),
	"current_state" varchar(100),
	"pincode" varchar(10),
	"education_qualification" varchar(100),
	"profession_type" varchar(50),
	"profession_details" text,
	"company_name" varchar(150),
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"kyc_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "families" ADD CONSTRAINT "families_head_member_id_member_profiles_id_fk" FOREIGN KEY ("head_member_id") REFERENCES "member_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "family_relations" ADD CONSTRAINT "family_relations_from_member_id_member_profiles_id_fk" FOREIGN KEY ("from_member_id") REFERENCES "member_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "family_relations" ADD CONSTRAINT "family_relations_to_member_id_member_profiles_id_fk" FOREIGN KEY ("to_member_id") REFERENCES "member_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kyc_verifications" ADD CONSTRAINT "kyc_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matrimonial_profiles" ADD CONSTRAINT "matrimonial_profiles_member_id_member_profiles_id_fk" FOREIGN KEY ("member_id") REFERENCES "member_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member_profiles" ADD CONSTRAINT "member_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

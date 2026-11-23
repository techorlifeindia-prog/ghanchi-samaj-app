// [GSA-SHR-B-TYP-01: Shared Types & Gotra Enums]

export const GHANCHI_GOTRAS = [
  "बोराणा (Borana)",
  "सोलंकी (Solanki)",
  "पंवार (Panwar)",
  "राठौड़ (Rathore)",
  "परमार (Parmar)",
  "चौहान (Chauhan)",
  "भाटी (Bhati)",
  "सोनगरा (Songara)",
  "देवड़ा (Deora)",
  "सांखला (Sankhla)",
  "टांक (Tank)",
  "गहलोत (Gehlot)",
  "खंडेलवाल (Khandelwal)",
  "काटारिया (Katariya)",
  "भाटीवाल (Bhatiwal)"
] as const;

export type GotraType = typeof GHANCHI_GOTRAS[number];

export type MaritalStatus = 'unmarried' | 'engaged' | 'married' | 'divorced' | 'widowed';

export type ProfessionCategory = 
  | 'Business / Shop' 
  | 'Private Job' 
  | 'Government Job' 
  | 'Self Employed / Professional' 
  | 'Student' 
  | 'Housewife' 
  | 'Retired';

export interface MemberProfile {
  id: string;
  userId: string;
  familyId: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  age: number;
  bloodGroup?: string;
  fatherName: string;
  motherName: string;
  spouseName?: string;
  nanihalGotra: string;
  nanihalPlace: string;
  paternalGotra: GotraType | string;
  nativePlace: string;
  nativeDistrict: string;
  currentAddress: string;
  currentCity: string;
  currentDistrict: string;
  currentState: string;
  pincode: string;
  educationQualification: string;
  professionType: ProfessionCategory;
  professionDetails?: string;
  companyName?: string;
  maritalStatus: MaritalStatus;
  availableForMarriage: boolean;
  photoUrl?: string;
}

export interface FamilyRelation {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  relationType: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'SON' | 'DAUGHTER' | 'BROTHER' | 'SISTER';
}

export interface AIAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionCard?: {
    type: 'UPDATE_STATUS_CONFIRMATION' | 'DIRECTORY_SEARCH_RESULTS';
    memberName?: string;
    targetStatus?: MaritalStatus;
    payload?: any;
  };
}

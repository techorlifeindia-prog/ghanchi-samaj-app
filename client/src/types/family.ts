// [GSA-FAM-F-TY-01: Family Types]
export interface FamilyMember {
  id: string;
  nameHi: string;
  nameEn: string;
  roleHi: string;
  roleEn: string;
  parentId: string | null;
  spouseId: string | null;
  gender: 'M' | 'F';
  avatarUrl?: string;
  detailsHi?: string;
  detailsEn?: string;
  statusHi?: string;
  statusEn?: string;
  statusColor?: string;
  fatherName?: string;
  phone?: string;
  gotra?: string;
  village?: string;
  district?: string;
}

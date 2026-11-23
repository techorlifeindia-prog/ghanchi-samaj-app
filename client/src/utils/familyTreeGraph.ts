// [GSA-FAM-S-UT-01: Family Tree Graph Relation Logic]
import { FamilyMember } from '../types/family';

export const calculateLineageGraph = (
  members: FamilyMember[],
  focusId: string,
  newMember: FamilyMember,
  relationType: string
): FamilyMember[] => {
  let updatedMembers = [...members];

  if (members.length === 0 || relationType === 'self') {
    newMember.parentId = null;
    newMember.spouseId = null;
    updatedMembers.push(newMember);
    return updatedMembers;
  }

  const focusIndex = updatedMembers.findIndex(m => m.id === focusId);
  const focusNode = focusIndex !== -1 ? updatedMembers[focusIndex] : null;

  if (!focusNode) {
    updatedMembers.push(newMember);
    return updatedMembers;
  }

  const parentNode = focusNode.parentId ? updatedMembers.find(m => m.id === focusNode.parentId) : null;
  const grandparentNode = parentNode?.parentId ? updatedMembers.find(m => m.id === parentNode.parentId) : null;

  switch (relationType) {
    case 'father':
      newMember.parentId = parentNode ? parentNode.parentId : null;
      updatedMembers[focusIndex] = { ...focusNode, parentId: newMember.id };
      if (parentNode && parentNode.gender === 'F') {
        newMember.spouseId = parentNode.id;
        const motherIndex = updatedMembers.findIndex(m => m.id === parentNode.id);
        if (motherIndex !== -1) {
          updatedMembers[motherIndex] = { ...updatedMembers[motherIndex], spouseId: newMember.id };
        }
      }
      break;

    case 'mother':
      if (parentNode && parentNode.gender === 'M') {
        newMember.spouseId = parentNode.id;
        newMember.parentId = parentNode.parentId;
        const fatherIndex = updatedMembers.findIndex(m => m.id === parentNode.id);
        if (fatherIndex !== -1) {
          updatedMembers[fatherIndex] = { ...updatedMembers[fatherIndex], spouseId: newMember.id };
        }
      } else {
        newMember.parentId = parentNode ? parentNode.parentId : null;
        updatedMembers[focusIndex] = { ...focusNode, parentId: newMember.id };
      }
      break;

    case 'grandfather':
      if (parentNode) {
        newMember.parentId = grandparentNode ? grandparentNode.parentId : null;
        const parentIndex = updatedMembers.findIndex(m => m.id === parentNode.id);
        if (parentIndex !== -1) {
          updatedMembers[parentIndex] = { ...updatedMembers[parentIndex], parentId: newMember.id };
        }
      } else {
        newMember.parentId = null;
        const dummyFatherId = 'father_' + Date.now();
        const dummyFather: FamilyMember = {
          id: dummyFatherId,
          nameHi: 'पिता (Father)',
          nameEn: 'Father',
          roleHi: 'पिता',
          roleEn: 'Father',
          parentId: newMember.id,
          spouseId: null,
          gender: 'M',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          statusHi: 'विवाहित',
          statusEn: 'Married'
        };
        updatedMembers.push(dummyFather);
        updatedMembers[focusIndex] = { ...focusNode, parentId: dummyFatherId };
      }
      break;

    case 'grandmother':
      if (grandparentNode && grandparentNode.gender === 'M') {
        newMember.spouseId = grandparentNode.id;
        newMember.parentId = grandparentNode.parentId;
        const gfIndex = updatedMembers.findIndex(m => m.id === grandparentNode.id);
        if (gfIndex !== -1) {
          updatedMembers[gfIndex] = { ...updatedMembers[gfIndex], spouseId: newMember.id };
        }
      } else if (parentNode) {
        const gfId = 'gf_' + Date.now();
        const dummyGF: FamilyMember = {
          id: gfId,
          nameHi: 'दादाजी (Grandfather)',
          nameEn: 'Grandfather',
          roleHi: 'दादाजी',
          roleEn: 'Grandfather',
          parentId: null,
          spouseId: newMember.id,
          gender: 'M',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          statusHi: 'विवाहित',
          statusEn: 'Married'
        };
        newMember.spouseId = gfId;
        newMember.parentId = null;
        updatedMembers.push(dummyGF);
        const parentIdx = updatedMembers.findIndex(m => m.id === parentNode.id);
        if (parentIdx !== -1) {
          updatedMembers[parentIdx] = { ...updatedMembers[parentIdx], parentId: gfId };
        }
      } else {
        newMember.parentId = null;
        updatedMembers[focusIndex] = { ...focusNode, parentId: newMember.id };
      }
      break;

    case 'spouse':
      newMember.spouseId = focusNode.id;
      newMember.parentId = null;
      updatedMembers[focusIndex] = { ...focusNode, spouseId: newMember.id };
      break;

    case 'brother':
    case 'sister':
      newMember.parentId = focusNode.parentId || null;
      break;

    case 'son':
    case 'daughter':
    default:
      newMember.parentId = focusNode.id;
      break;
  }

  updatedMembers.push(newMember);
  return updatedMembers;
};

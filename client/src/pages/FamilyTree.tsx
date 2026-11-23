// [GSA-FAM-F-PG] - Family Tree Visualizer & Hierarchy Page Component
import React, { useState, useMemo, useEffect } from 'react';
import { Users, Plus, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { FamilyMember } from '../types/family';
import { FamilyNode } from '../components/FamilyTree/FamilyNode';
import { AddMemberModal } from '../components/FamilyTree/AddMemberModal';
import { calculateLineageGraph } from '../utils/familyTreeGraph';

export const FamilyTree: React.FC = () => {
  // [GSA-FAM-F-PG-01: State & Generational Hierarchy Data]
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<string[]>(['c1']);

  const focusId = history[history.length - 1];

  useEffect(() => {
    fetch('/api/family-tree/1')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setMembers(data.data);
          if (data.data.length > 0) {
            // Try to find the logged-in user by name or memberId, otherwise default to first
            const currentUserNode = data.data.find((m: any) => 
              user && (m.nameEn === user.name || m.nameHi === user.name || m.id === user.memberId)
            );
            setHistory([currentUserNode ? currentUserNode.id : data.data[0].id]);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load family tree from server", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddMember = async (newMember: FamilyMember, relationType: string) => {
    // [GSA-FAM-F-CM-01: Auto-inherit fields from focus member]
    const relative = members.find(m => m.id === focusId);
    if (relative) {
      if (relationType !== 'spouse') {
        newMember.gotra = relative.gotra || 'Not Specified';
      }
      newMember.village = relative.village || '';
      newMember.district = relative.district || '';
    }

    const updatedMembers = calculateLineageGraph(members, focusId, newMember, relationType);
    setMembers(updatedMembers);
    if (members.length === 0 || relationType === 'self') {
      setHistory([newMember.id]);
    }

    try {
      const res = await fetch('/api/family-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMember, focusId, relationType })
      });
      const data = await res.json();
      
      // Refetch tree to get the real UUIDs from PostgreSQL
      const refreshRes = await fetch('/api/family-tree/1');
      const refreshData = await refreshRes.json();
      
      if (refreshData.success) {
        setMembers(refreshData.data);
        if (members.length === 0 || relationType === 'self') {
          setHistory([data.data.id]);
        }
      }
    } catch (err) {
      console.error("Failed to sync member to DB:", err);
    }
    setIsAddModalOpen(false);
  };

  // [GSA-FAM-F-PG-02: Direct Lineage View Logic]
  const viewData = useMemo(() => {
    const focusNode = members.find(m => m.id === focusId);
    if (!focusNode) return null;

    const focusSpouse = focusNode.spouseId ? members.find(m => m.id === focusNode.spouseId) : members.find(m => m.spouseId === focusNode.id);
    const parentNode = focusNode.parentId ? members.find(m => m.id === focusNode.parentId) : null;
    const parentSpouse = parentNode ? (parentNode.spouseId ? members.find(m => m.id === parentNode.spouseId) : members.find(m => m.spouseId === parentNode.id)) : null;

    const grandparentNode = parentNode?.parentId ? members.find(m => m.id === parentNode.parentId) : null;
    const grandparentSpouse = grandparentNode ? (grandparentNode.spouseId ? members.find(m => m.id === grandparentNode.spouseId) : members.find(m => m.spouseId === grandparentNode.id)) : null;

    const children = members.filter(m => m.parentId === focusNode.id || (focusSpouse && m.parentId === focusSpouse.id));

    return { focusNode, focusSpouse, parentNode, parentSpouse, grandparentNode, grandparentSpouse, children };
  }, [members, focusId]);

  const handleNodeClick = (id: string) => {
    if (id !== focusId) {
      setHistory([...history, id]);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const resetToSelf = () => {
    if (members.length > 0) {
      const currentUserNode = members.find((m: any) => 
        user && (m.nameEn === user.name || m.nameHi === user.name || m.id === user.memberId)
      );
      setHistory([currentUserNode ? currentUserNode.id : members[0].id]);
    } else {
      setHistory(['c1']);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isTreeEmpty = !viewData || members.length === 0;

  return (
    <div className="relative min-h-[calc(100vh-140px)] pb-24 max-w-4xl mx-auto px-4 flex flex-col justify-between">
      
      {/* Top Header Control Bar */}
      <div className="flex items-center justify-between py-3 mb-2 sticky top-0 z-20 backdrop-blur-md bg-white/40 rounded-2xl px-3 border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          {history.length > 1 && (
            <button 
              onClick={goBack}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              {language === 'hi' ? 'पीछे' : 'Back'}
            </button>
          )}
          <h2 className="text-base font-extrabold text-slate-900">
            {language === 'hi' ? 'वंशावली (Family Tree)' : 'Family Tree'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={resetToSelf}
            className="text-xs font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all border border-amber-200"
          >
            🎯 {language === 'hi' ? 'मुख्य केंद्र' : 'Reset View'}
          </button>
        </div>
      </div>

      {/* Main Family Tree Lineage View */}
      {isTreeEmpty || !viewData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 ios-glass-card m-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-200">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">
            {language === 'hi' ? 'आपका फैमिली ट्री खाली है' : 'Your Family Tree is Empty'}
          </h3>
          <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
            {language === 'hi' ? 'नीचे दिए गए (+) बटन पर क्लिक करके अपने परिवार का पहला सदस्य जोड़ें।' : 'Click the (+) button below to add the first member of your family.'}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
          
          {/* Generation 1: Grandparents */}
          {(viewData.grandparentNode || viewData.grandparentSpouse) && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                {language === 'hi' ? 'दादा-दादी / दादाजी की पीढ़ी' : 'Grandparents Generation'}
              </span>
              <div className="flex items-center gap-4">
                {viewData.grandparentNode && (
                  <FamilyNode node={viewData.grandparentNode} onClick={handleNodeClick} />
                )}
                {viewData.grandparentSpouse && (
                  <FamilyNode node={viewData.grandparentSpouse} onClick={handleNodeClick} />
                )}
              </div>
              <div className="w-0.5 h-6 bg-slate-300 my-1"></div>
            </div>
          )}

          {/* Generation 2: Parents */}
          {(viewData.parentNode || viewData.parentSpouse) && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                {language === 'hi' ? 'माता-पिता की पीढ़ी' : 'Parents Generation'}
              </span>
              <div className="flex items-center gap-4">
                {viewData.parentNode && (
                  <FamilyNode node={viewData.parentNode} onClick={handleNodeClick} />
                )}
                {viewData.parentSpouse && (
                  <FamilyNode node={viewData.parentSpouse} onClick={handleNodeClick} />
                )}
              </div>
              <div className="w-0.5 h-6 bg-slate-300 my-1"></div>
            </div>
          )}

          {/* Generation 3: Focused Node & Spouse */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold mb-2 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {language === 'hi' ? 'वर्तमान केंद्र' : 'Current Focus'}
            </span>
            <div className="flex items-center gap-4 p-3 bg-amber-500/10 rounded-3xl border border-amber-400/30 backdrop-blur-sm">
              <FamilyNode node={viewData.focusNode} isFocus onClick={() => {}} />
              {viewData.focusSpouse && (
                <FamilyNode node={viewData.focusSpouse} onClick={handleNodeClick} />
              )}
            </div>
          </div>

          {/* Generation 4: Children */}
          {viewData.children.length > 0 && (
            <div className="flex flex-col items-center w-full">
              <div className="w-0.5 h-6 bg-slate-300 my-1"></div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                {language === 'hi' ? 'संतान / अगली पीढ़ी' : 'Children / Next Generation'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 max-w-full">
                {viewData.children.map(child => (
                  <FamilyNode key={child.id} node={child} onClick={handleNodeClick} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Add Member Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-6 z-30 w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white"
        title={language === 'hi' ? 'परिवार का सदस्य जोड़ें' : 'Add Family Member'}
      >
        <Plus className="w-8 h-8 stroke-[3]" />
      </button>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
        focusId={focusId}
      />
    </div>
  );
};

// [GSA-BOT-F-CM] - AI Voice & Chat Assistant Modal Component
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, Send, Bot, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { AIAssistantMessage } from '@shared/types';
import { useLanguage } from '../../context/LanguageContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (memberName: string, newStatus: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onUpdateStatus }) => {
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'जय श्री कृष्णा! मैं आपका "श्री घाँची समाज AI सहायक" हूँ। आप मुझसे आवाज़ (Voice) से बोलकर या टाइप करके परिवार या समाज की जानकारी अपडेट कर सकते हैं।' 
        : 'Jai Shree Krishna! I am your "Shree Ghanchi Samaj AI Assistant". Speak or type to update family status or matrimony info.',
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI Intent Parsing Logic
    setTimeout(() => {
      let aiMsg: AIAssistantMessage;

      if (text.includes('सगाई') || text.includes('शादी') || text.includes('engaged') || text.includes('marriage')) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: language === 'hi'
            ? 'मुझे आपके संदेश से विवाह स्थिति परिवर्तन का अनुरोध मिला है।'
            : 'I received a request to update matrimonial status.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard: {
            type: 'UPDATE_STATUS_CONFIRMATION',
            memberName: 'प्रिया घाँची (बेटी / Daughter)',
            targetStatus: 'engaged'
          }
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: language === 'hi'
            ? `मैंने आपका संदेश रिकॉर्ड कर लिया है: "${text}"। क्या आप अपने परिवार का कोई और विवरण अपडेट करना चाहते हैं?`
            : `Recorded your message: "${text}". Would you like to update any other family details?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  const toggleMic = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend(language === 'hi' ? 'मेरी बेटी की सगाई तय हो गई है' : 'My daughter got engaged');
    }, 2500);
  };

  const handleConfirmAction = async (memberName: string, status: string) => {
    if (onUpdateStatus) onUpdateStatus(memberName, status);

    try {
      await fetch('/api/update-marital-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName, status })
      });
    } catch (err) {
      console.error("Failed to post status update API:", err);
    }

    const confirmationMsg: AIAssistantMessage = {
      id: Date.now().toString(),
      sender: 'assistant',
      text: language === 'hi'
        ? `✅ सफलता! ${memberName} की वैवाहिक स्थिति सफलतापूर्वक 'सगाई हो चुकी (Engaged)' अपडेट कर दी गई है। बधाई!`
        : `✅ Success! ${memberName} matrimonial status updated to 'Engaged'. Congratulations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, confirmationMsg]);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="ios-glass-card w-full max-w-lg shadow-2xl flex flex-col h-[85vh] max-h-[650px] border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="p-4 bg-white/70 border-b border-slate-200/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl ios-btn-gold flex items-center justify-center shadow-md border border-amber-300">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                {t('aiAssistantTitle')} <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-500">{t('aiAssistantSub')}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-white/40 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-700 whitespace-nowrap">Suggested:</span>
          <button 
            onClick={() => handleSend(language === 'hi' ? "मेरी बेटी की सगाई हो गई है" : "My daughter got engaged")}
            className="bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-slate-200 shadow-sm"
          >
            💍 {t('quickCmd1')}
          </button>
          <button 
            onClick={() => handleSend(language === 'hi' ? "राहुल की शादी दर्ज करें" : "Record Rahul marriage")}
            className="bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-slate-200 shadow-sm"
          >
            💒 {t('quickCmd2')}
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-3xl p-4 shadow-md text-sm ${
                  msg.sender === 'user'
                    ? 'ios-btn-primary rounded-br-none'
                    : 'bg-white/90 text-slate-900 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed font-medium">{msg.text}</p>

                {/* AI Interactive Action Confirmation Card */}
                {msg.actionCard?.type === 'UPDATE_STATUS_CONFIRMATION' && (
                  <div className="mt-3 bg-amber-50 border border-amber-300/80 rounded-2xl p-4 text-slate-900 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Confirmation Required
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Update status of <strong>{msg.actionCard.memberName}</strong> to <strong>'Engaged (सगाई हो चुकी)'</strong>?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmAction(msg.actionCard?.memberName || 'Member', 'engaged')}
                        className="ios-btn-gold text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        Confirm & Update
                      </button>
                      <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <span className={`block text-[10px] mt-2 text-right font-mono ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isListening && (
            <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-100/90 p-3 rounded-2xl border border-amber-300 animate-pulse font-medium">
              <Mic className="w-4 h-4 text-amber-600 animate-bounce" />
              {t('listeningStatus')} - {t('voiceInstruction')}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white/80 border-t border-slate-200/80 flex items-center gap-2 backdrop-blur-md">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              isListening
                ? 'bg-rose-500 text-white ring-4 ring-rose-400/40 animate-pulse'
                : 'ios-btn-gold text-slate-950'
            }`}
            title={t('btnMicStart')}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('voiceInstruction')}
            className="flex-1 bg-slate-100/80 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            className="ios-btn-primary p-3 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-4.5 h-4.5 text-white" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

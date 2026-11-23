// [GSA-BIZ-F-PG] - Business Directory Page Component
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Briefcase, MapPin, Phone, Plus, Store, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Business: React.FC = () => {
  // [GSA-BIZ-F-PG-01: State & Business Listings Data]
  const { t, language } = useLanguage();
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);

  const [businesses, setBusinesses] = useState([
    {
      id: '1',
      title: { hi: 'श्री घाँची टेक्सटाइल्स & साड़ी हाउस', en: 'Shree Ghanchi Textiles & Saree House' },
      owner: { hi: 'रमेश कुमार बोराणा', en: 'Ramesh Kumar Borana' },
      category: { hi: 'कपड़ा / गारमेंट्स', en: 'Textiles & Garments' },
      city: { hi: 'जोधपुर (राजस्थान)', en: 'Jodhpur (Rajasthan)' },
      address: { hi: 'कपड़ा बाज़ार, मेन रोड, जोधपुर', en: 'Textile Market, Main Road, Jodhpur' },
      phone: '98290-XXXXX'
    },
    {
      id: '2',
      title: { hi: 'घाँची मेडिकल & सर्जिकल', en: 'Ghanchi Medical & Surgical' },
      owner: { hi: 'दिनेश सोलंकी', en: 'Dinesh Solanki' },
      category: { hi: 'दवाइयां / मेडिकल', en: 'Pharmacy & Surgical' },
      city: { hi: 'पाली (राजस्थान)', en: 'Pali (Rajasthan)' },
      address: { hi: 'स्टेशन रोड, पाली', en: 'Station Road, Pali' },
      phone: '94141-XXXXX'
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newCategory, setNewCategory] = useState('Textiles & Garments');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOwner.trim()) return;

    const newBiz = {
      id: Date.now().toString(),
      title: { hi: newTitle, en: newTitle },
      owner: { hi: newOwner, en: newOwner },
      category: { 
        hi: newCategory === 'Textiles & Garments' ? 'कपड़ा / गारमेंट्स' : newCategory === 'Pharmacy & Surgical' ? 'दवाइयां / मेडिकल' : newCategory, 
        en: newCategory 
      },
      city: { hi: newCity || 'जोधपुर (राजस्थान)', en: newCity || 'Jodhpur (Rajasthan)' },
      address: { hi: newAddress || 'मेन रोड, जोधपुर', en: newAddress || 'Main Road, Jodhpur' },
      phone: newPhone || '98290-XXXXX'
    };

    setBusinesses(prev => [newBiz, ...prev]);
    setNewTitle('');
    setNewOwner('');
    setNewCity('');
    setNewAddress('');
    setNewPhone('');
    setIsAddBusinessOpen(false);
  };

  const getLocalizedText = (item: any) => {
    if (!item) return '';
    if (typeof item === 'object') {
      return item[language] || item['en'] || item['hi'] || '';
    }

    const map: Record<string, { hi: string; en: string }> = {
      'श्री घाँची टेक्सटाइल्स & साड़ी हाउस': { hi: 'श्री घाँची टेक्सटाइल्स & साड़ी हाउस', en: 'Shree Ghanchi Textiles & Saree House' },
      'श्री घाँची टेक्सटाइल्स & साड़ी हाउस': { hi: 'श्री घाँची टेक्सटाइल्स & साड़ी हाउस', en: 'Shree Ghanchi Textiles & Saree House' },
      'रमेश कुमार बोराणा': { hi: 'रमेश कुमार बोराणा', en: 'Ramesh Kumar Borana' },
      'कपड़ा / गारमेंट्स': { hi: 'कपड़ा / गारमेंट्स', en: 'Textiles & Garments' },
      'कपड़ा / गारमेंट्स (Textiles)': { hi: 'कपड़ा / गारमेंट्स', en: 'Textiles & Garments' },
      'कपड़ा बाज़ार, मेन रोड, जोधपुर': { hi: 'कपड़ा बाज़ार, मेन रोड, जोधपुर', en: 'Textile Market, Main Road, Jodhpur' },
      'जोधपुर (राजस्थान)': { hi: 'जोधपुर (राजस्थान)', en: 'Jodhpur (Rajasthan)' },
      
      'घाँची मेडिकल & सर्जिकल': { hi: 'घाँची मेडिकल & सर्जिकल', en: 'Ghanchi Medical & Surgical' },
      'दिनेश सोलंकी': { hi: 'दिनेश सोलंकी', en: 'Dinesh Solanki' },
      'दवाइयां / मेडिकल': { hi: 'दवाइयां / मेडिकल', en: 'Pharmacy & Surgical' },
      'दवाइयां / मेडिकल (Pharmacy)': { hi: 'दवाइयां / मेडिकल', en: 'Pharmacy & Surgical' },
      'स्टेशन रोड, पाली': { hi: 'स्टेशन रोड, पाली', en: 'Station Road, Pali' },
      'पाली': { hi: 'पाली (राजस्थान)', en: 'Pali (Rajasthan)' },
      'पाली (Pali)': { hi: 'पाली (राजस्थान)', en: 'Pali (Rajasthan)' }
    };

    return map[item] ? map[item][language] : item;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* iOS 18 Light Glass Header Panel */}
      <div className="ios-glass-card p-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            {t('businessTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{t('businessSub')}</p>
        </div>
        <button 
          onClick={() => setIsAddBusinessOpen(true)}
          className="ios-btn-gold text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all border border-amber-300"
        >
          <Plus className="w-4 h-4" /> {language === 'hi' ? 'व्यवसाय जोड़ें' : 'Add Business'}
        </button>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map((b) => (
          <div 
            key={b.id} 
            className="ios-glass-card p-6 space-y-4 hover:border-emerald-400 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold shadow-sm shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {getLocalizedText(b.category)}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{getLocalizedText(b.title)}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {t('owner')}: {getLocalizedText(b.owner)}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-1 bg-white/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/70 font-medium">
              <p className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" /> {getLocalizedText(b.address)}, {getLocalizedText(b.city)}
              </p>
            </div>

            <a 
              href={`tel:${b.phone}`}
              className="ios-btn-primary text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md w-full"
            >
              <Phone className="w-4 h-4" /> {t('btnContactBusiness')} ({b.phone})
            </a>
          </div>
        ))}
      </div>

      {/* Add Business Modal */}
      {isAddBusinessOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="ios-glass-card w-full max-w-md bg-white p-6 shadow-2xl rounded-3xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'नया व्यवसाय लिस्ट करें' : 'Add New Business Listing'}
              </h3>
              <button 
                onClick={() => setIsAddBusinessOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBusinessSubmit} className="space-y-3.5 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {language === 'hi' ? 'दुकान / कंपनी का नाम' : 'Business Name'}
                </label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'hi' ? "उदा: श्री घाँची ज्वेलर्स..." : "e.g. Shree Ghanchi Jewellers..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {language === 'hi' ? 'मालिक का नाम' : 'Owner Name'}
                </label>
                <input 
                  type="text" 
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder={language === 'hi' ? "उदा: रमेश कुमार बोराणा..." : "e.g. Ramesh Kumar Borana..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {language === 'hi' ? 'श्रेणी' : 'Category'}
                </label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-bold"
                >
                  <option value="Textiles & Garments">{language === 'hi' ? 'कपड़ा / गारमेंट्स' : 'Textiles & Garments'}</option>
                  <option value="Pharmacy & Surgical">{language === 'hi' ? 'दवाइयां / मेडिकल' : 'Pharmacy & Surgical'}</option>
                  <option value="Grocery & General Store">{language === 'hi' ? 'किराना / जनरल स्टोर' : 'Grocery & General Store'}</option>
                  <option value="IT & Software Services">{language === 'hi' ? 'आईटी एवं सॉफ्टवेयर' : 'IT & Software Services'}</option>
                  <option value="Real Estate & Construction">{language === 'hi' ? 'रियल एस्टेट एवं निर्माण' : 'Real Estate & Construction'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {language === 'hi' ? 'संपर्क नंबर' : 'Contact Phone'}
                </label>
                <input 
                  type="text" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="98290-XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              <button 
                type="submit"
                className="ios-btn-primary w-full py-3 rounded-xl text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {language === 'hi' ? 'व्यवसाय लिस्ट करें' : 'Publish Business Listing'}
              </button>
            </form>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

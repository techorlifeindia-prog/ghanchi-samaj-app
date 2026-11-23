// [GSA-SHR-F-CT] - Global i18n Bilingual Language Context Provider
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// [GSA-SHR-F-CT-01: Translations Dictionary Definition]
const translations: Record<string, { hi: string; en: string }> = {
  // App Title & Tagline
  appTitle: { hi: 'श्री घाँची समाज', en: 'Shree Ghanchi Samaj' },
  appTagline: { hi: 'परिवार, परिचय और AI कम्युनिटी', en: 'Family, Directory & AI Community' },
  
  // Navigation
  navHome: { hi: 'गृह', en: 'Home' },
  navFamily: { hi: 'वंशावली (Tree)', en: 'Family Tree' },
  navDirectory: { hi: 'समाज डायरेक्टरी', en: 'Directory' },
  navMatrimony: { hi: 'विवाह', en: 'Matrimony' },
  navBusiness: { hi: 'व्यापार', en: 'Business' },
  navProfile: { hi: 'प्रोफ़ाइल (KYC)', en: 'Profile (KYC)' },
  navAIAssistant: { hi: 'AI समाज सहायक', en: 'AI Assistant' },
  
  // Home Page
  heroBadge: { hi: 'श्री घाँची समाज — परिवार और परिचय ऐप', en: 'Shree Ghanchi Samaj — Family & Community App' },
  heroTitle: { hi: 'अपनी डिजिटल वंशावली (Family Tree) और समाज को एक साथ जोड़ें', en: 'Connect your Digital Family Tree & Community Together' },
  heroSubtitle: { 
    hi: 'वॉइस आधारित AI सहायक से 10 सेकंड में अपनी पारिवारिक स्थिति (सगाई, शादी) अपडेट करें, सत्यापित विवाह रिश्ते खोजें और समाज व्यापार से जुड़ें।',
    en: 'Update family status (engagement, marriage) in 10s via voice AI assistant, explore verified matrimonial matches, and connect with community businesses.' 
  },
  btnViewFamilyTree: { hi: 'फैमिली ट्री देखें', en: 'View Family Tree' },
  btnTalkAI: { hi: 'AI सहायक से बोलें', en: 'Talk to AI Assistant' },

  // Quick Cards
  cardFamilyTitle: { hi: 'फैमिली ट्री (वंशावली)', en: 'Family Tree' },
  cardFamilySub: { hi: 'दादा-दादी से बच्चों तक', en: 'Grandparents to Kids' },
  cardMatrimonyTitle: { hi: 'विवाह परिचय मंच', en: 'Matrimony Platform' },
  cardMatrimonySub: { hi: 'सत्यापित रिश्ते', en: 'Verified Matches' },
  cardDirectoryTitle: { hi: 'समाज डायरेक्टरी', en: 'Samaj Directory' },
  cardDirectorySub: { hi: 'गोत्र व जिला अनुसार', en: 'By Gotra & District' },
  cardBusinessTitle: { hi: 'व्यापार निर्देशिका', en: 'Business Directory' },
  cardBusinessSub: { hi: 'समाज व्यवसाय नेटवर्क', en: 'Community Businesses' },

  // Upcoming Events
  eventsHeader: { hi: 'आगामी समाज कार्यक्रम एवं सूचनाएं', en: 'Upcoming Community Events & Notices' },
  viewAll: { hi: 'सभी देखें', en: 'View All' },
  event1Category: { hi: 'वार्षिक बैठक', en: 'Annual Meeting' },
  event1Title: { hi: 'श्री घाँची समाज महासमिति स्नेह मिलन समारोह', en: 'Shree Ghanchi Samaj Mahasamiti Sneh Milan' },
  event1Date: { hi: '15 अक्टूबर', en: '15 October' },
  event1Location: { hi: 'घाँची समाज भवन, जोधपुर (राजस्थान)', en: 'Ghanchi Samaj Bhavan, Jodhpur (Raj)' },
  event2Category: { hi: 'युवक-युवती सम्मेलन', en: 'Matchmaking Summit' },
  event2Title: { hi: 'निःशुल्क घाँची समाज वैवाहिक परिचय सम्मेलन', en: 'Free Ghanchi Samaj Matrimonial Meet' },
  event2Date: { hi: '02 नवंबर', en: '02 November' },
  event2Location: { hi: 'समाज टाउन हॉल, पाली', en: 'Samaj Town Hall, Pali' },

  // Family Tree Page
  familyTreeHeader: { hi: 'बोराणा परिवार वंशावली (Family Tree)', en: 'Borana Family Tree' },
  familyMeta: { hi: 'मूल निवासी: जोधपुर (राजस्थान) | कुल सदस्य: 8', en: 'Native: Jodhpur (Rajasthan) | Total Members: 8' },
  btnAddMember: { hi: 'सदस्य जोड़ें', en: 'Add Member' },
  roleGrandfather: { hi: 'दादा (Grandfather)', en: 'Grandfather' },
  roleGrandmother: { hi: 'दादी (Grandmother)', en: 'Grandmother' },
  roleFather: { hi: 'पिता / मुखिया', en: 'Father / Head' },
  roleMother: { hi: 'माता (Mother)', en: 'Mother' },
  roleElderSon: { hi: 'बड़ा बेटा', en: 'Elder Son' },
  roleDaughter: { hi: 'बेटी (Daughter)', en: 'Daughter' },
  roleYoungerSon: { hi: 'छोटा बेटा', en: 'Younger Son' },
  statusMarried: { hi: 'विवाहित', en: 'Married' },
  statusEngaged: { hi: 'सगाई हो चुकी', en: 'Engaged' },
  statusUnmarried: { hi: 'अविवाहित', en: 'Single' },

  // Directory Page
  dirTitle: { hi: 'श्री घाँची समाज - सदस्य डायरेक्टरी', en: 'Shree Ghanchi Samaj - Member Directory' },
  dirSub: { hi: 'पूरे भारत में समाज बंधुओं की डायरेक्टरी में खोजें', en: 'Search community members across India' },
  searchPlaceholder: { hi: 'नाम, गोत्र या शहर से खोजें...', en: 'Search by Name, Gotra or City...' },
  allGotra: { hi: 'सभी गोत्र', en: 'All Gotras' },
  allDistricts: { hi: 'सभी ज़िले', en: 'All Districts' },
  contactNo: { hi: 'फ़ोन नंबर', en: 'Contact No.' },
  btnCall: { hi: 'कॉल करें', en: 'Call Now' },
  btnWhatsApp: { hi: 'व्हाट्सएप', en: 'WhatsApp' },

  // Matrimony Page
  matrimonyTitle: { hi: 'विवाह परिचय मंच', en: 'Matrimonial Profiles' },
  matrimonySub: { hi: '100% सत्यापित घाँची समाज के सुयोग्य रिश्ते', en: '100% Verified Ghanchi Samaj Proposals' },
  age: { hi: 'उम्र', en: 'Age' },
  height: { hi: 'ऊंचाई', en: 'Height' },
  education: { hi: 'शिक्षा', en: 'Education' },
  occupation: { hi: 'व्यवसाय', en: 'Profession' },
  nativePlace: { hi: 'मूल निवास', en: 'Native' },
  btnViewFullProfile: { hi: 'पूर्ण बायोडाटा देखें', en: 'View Full Biodata' },
  btnSendInterest: { hi: 'रुचि भेजें', en: 'Express Interest' },
  gotraRuleTitle: { hi: 'स्मार्ट गोत्र निषेध नियम (Smart Gotra Rule)', en: 'Smart Gotra Exclusion Rule' },
  gotraRuleDesc: { hi: 'अपने परिवार की मान्यता अनुसार 1-गोत्र या 2-गोत्र टालने का नियम चुनें।', en: 'Choose your preferred strictness for gotra matching based on family beliefs.' },
  level1Gotra: { hi: '1-गोत्र (केवल पिता का गोत्र टालें)', en: '1-Gotra (Exclude Paternal Only)' },
  level2Gotra: { hi: '2-गोत्र (पिता + माता का गोत्र टालें)', en: '2-Gotra (Exclude Paternal + Maternal)' },
  mySelfGotra: { hi: 'मेरा स्व-गोत्र (Paternal Gotra)', en: 'My Paternal Gotra' },
  myMotherGotra: { hi: 'माता जी का ननिहाल गोत्र', en: 'Mother\'s Gotra (Nanihal)' },
  gotraCompatible: { hi: 'गोत्र अनुकूल', en: 'Gotra Compatible' },
  gotraExcluded: { hi: 'निषिद्ध गोत्र (Excluded)', en: 'Gotra Excluded' },
  educationFilter: { hi: 'शिक्षा क्षेत्र', en: 'Education Stream' },
  cityFilter: { hi: 'शहर / ज़िला फ़िल्टर', en: 'City / District Filter' },
  verifiedOnly: { hi: 'केवल आधार सत्यापित रिश्ते', en: 'Aadhaar Verified Only' },
  resetFilters: { hi: 'फ़िल्टर रीसेट करें', en: 'Reset Filters' },

  // Business Page
  businessTitle: { hi: 'समाज व्यापार निर्देशिका', en: 'Community Business Directory' },
  businessSub: { hi: 'अपने समाज के व्यवसायियों को बढ़ावा दें एवं लाभ उठाएं', en: 'Support & grow with community businesses' },
  owner: { hi: 'मालिक', en: 'Owner' },
  category: { hi: 'श्रेणी', en: 'Category' },
  address: { hi: 'पता', en: 'Address' },
  btnContactBusiness: { hi: 'संपर्क करें', en: 'Contact Business' },

  // Profile KYC Page
  profileTitle: { hi: 'आपकी समाज प्रोफ़ाइल एवं KYC', en: 'Your Profile & KYC' },
  profileSub: { hi: 'सत्यापित डिजिटल सदस्य कार्ड व पारिवारिक विवरण', en: 'Verified Digital Member Card & Family Status' },
  kycStatusVerified: { hi: 'KYC सत्यापित', en: 'KYC Verified' },
  memberId: { hi: 'सदस्य आईडी', en: 'Member ID' },
  familyHead: { hi: 'फैमिली प्रमुख', en: 'Family Head' },
  gotra: { hi: 'गोत्र', en: 'Gotra' },
  city: { hi: 'शहर/ज़िला', en: 'City/District' },
  btnEditProfile: { hi: 'प्रोफ़ाइल अपडेट करें', en: 'Update Profile' },
  aadhaarKycStatus: { hi: 'आधार सत्यापन स्थिति (Aadhaar KYC Status)', en: 'Aadhaar KYC Verification Status' },
  maskedAadhaar: { hi: 'मास्क आधार नंबर', en: 'Masked Aadhaar Number' },
  verifiedBadge: { hi: 'सत्यापित', en: 'Verified' },
  privacyGuarantee: { 
    hi: '🔒 प्राइवेसी एवं सुरक्षा गारंटी: आपका 12 अंकों का पूरा आधार नंबर कभी भी ऐप में प्रदर्शित या प्लेन-टेक्स्ट में स्टोर नहीं किया जाता। केवल सत्यापन हेतु मास्क टोकन का उपयोग होता है।', 
    en: '🔒 Privacy & Security Guarantee: Your full 12-digit Aadhaar number is never stored or shown in plain-text. Only masked token validation is performed for community trust.' 
  },
  privacyTitle: { hi: 'प्राइवेसी नियंत्रण एवं अनुमतियां', en: 'Privacy Controls & Permissions' },
  phoneVisibilityTitle: { hi: 'मोबाइल नंबर दृश्यता', en: 'Phone Number Visibility' },
  phoneVisibilitySub: { hi: 'कौन आपका संपर्क नंबर देख सकता है?', en: 'Who can view your contact number?' },
  optVerifiedMembers: { hi: 'सत्यापित सदस्य (Verified)', en: 'Verified Members' },
  optFamilyOnly: { hi: 'केवल परिवार (Family Only)', en: 'Family Members Only' },
  optHidden: { hi: 'छिपा हुआ (Hidden)', en: 'Hidden' },
  matrimonyInclusionTitle: { hi: 'विवाह खोज में शामिल रहें', en: 'Matrimony Search Inclusion' },
  matrimonyInclusionSub: { hi: 'विवाह खोज सूची में पारिवारिक प्रोफ़ाइल की अनुमति दें?', en: 'Allow family profiles in matrimony searches?' },

  // AI Assistant Modal
  aiAssistantTitle: { hi: 'AI समाज वॉइस सहायक', en: 'AI Samaj Voice Assistant' },
  aiAssistantSub: { hi: 'हिंदी/इंग्लिश में बोलकर अपना पारिवारिक स्टेटस या विवाह रिश्ता अपडेट करें', en: 'Update family status or matrimony info by speaking in Hindi/English' },
  voiceInstruction: { hi: 'बोलें जैसे: "मेरी बहन प्रिया की सगाई हो गई है"', en: 'Speak e.g. "My sister Priya got engaged"' },
  listeningStatus: { hi: 'सुन रहा है... (Listening)', en: 'Listening...' },
  btnMicStart: { hi: 'माइक चालू करें', en: 'Start Microphone' },
  btnMicStop: { hi: 'माइक बंद करें', en: 'Stop Microphone' },
  quickCmd1: { hi: 'प्रिया की सगाई अपडेट करें', en: 'Update Priya Engagement' },
  quickCmd2: { hi: 'राहुल की शादी दर्ज करें', en: 'Record Rahul Marriage' },
  quickCmd3: { hi: 'नया रिश्ता तलाशें', en: 'Find Matrimony Match' },

  // Smart Login Page Translations
  loginTitle: { hi: 'श्री घाँची समाज डिजिटल ऐप', en: 'Shree Ghanchi Samaj App' },
  loginTagline: { hi: 'सत्यापित वंशावली, विवाह परिचय एवं व्यापार मंच', en: 'Verified Lineage, Matrimony & Business Hub' },
  loginWelcome: { hi: 'श्री घाँची समाज डिजिटल मंच में आपका स्वागत है', en: 'Welcome to Shree Ghanchi Samaj Digital Platform' },
  loginSubtitle: { 
    hi: 'अपनी पारिवारिक वंशावली जोड़ें, 2-गोत्र वैदिक विवाह रिश्ते खोजें और समाज बंधुओं से सीधा संवाद करें।', 
    en: 'Connect with generational lineage, discover 2-Gotra compatible matrimonial matches, and engage with community members.' 
  },
  loginBadgeVerified: { hi: '✨ १००% अधिकृत व सुरक्षित समाज नेटवर्क', en: '✨ 100% Verified Community Network' },
  loginSelectMethod: { hi: 'त्वरित लॉगिन का माध्यम चुनें', en: 'Select Instant Login Method' },
  loginSelectMethodSub: { hi: 'WhatsApp OTP, ईमेल या व्यवस्थापक पिन से 10 सेकंड में प्रवेश करें', en: 'Access in 10 seconds via WhatsApp, Email or Admin PIN' },
  loginTabWhatsApp: { hi: 'WhatsApp OTP', en: 'WhatsApp OTP' },
  loginTabEmail: { hi: 'ईमेल OTP', en: 'Email OTP' },
  loginTabAdmin: { hi: 'व्यवस्थापक PIN', en: 'Admin PIN' },
  loginFeatureTreeTitle: { hi: 'डिजिटल वंशावली (Family Tree)', en: 'Digital Family Tree' },
  loginFeatureTreeSub: { hi: 'पीढ़ियों का वंश-वृक्ष व परिवार रिकॉर्ड', en: 'Generational Lineage Records' },
  loginFeatureGotraTitle: { hi: 'स्मार्ट 2-गोत्र विवाह नियम', en: 'Smart 2-Gotra Vedic Rule' },
  loginFeatureGotraSub: { hi: 'स्वचालित अनुकूलता व सुयोग्य रिश्ते', en: 'Automated Match Compatibility' },
  loginFeaturePrivacyTitle: { hi: 'आधार व गोपनीयता सुरक्षा', en: 'Aadhaar Shield & Privacy' },
  loginFeaturePrivacySub: { hi: 'मास्क KYC, 0% डाटा लीक सुरक्षा', en: 'Masked KYC, Zero Data Leakage' },
  loginFeatureDirectoryTitle: { hi: 'समाज डायरेक्टरी व व्यापार', en: 'Directory & Business Hub' },
  loginFeatureDirectorySub: { hi: 'अखिल भारतीय समाज बंधु नेटवर्क', en: 'Pan-India Community Network' },
  loginQuickDemoBadge: { hi: '⚡ त्वरित डेमो परीक्षण (Quick 1-Click Access)', en: '⚡ Instant 1-Click Demo Access' },
  loginDemoMemberBtn: { hi: 'सदस्य डेमो (Member Demo)', en: 'Member Demo' },
  loginDemoAdminBtn: { hi: 'व्यवस्थापक डेमो (Admin Demo)', en: 'Admin Demo' },
  loginSecurityNote: { hi: '🔒 256-बिट एन्क्रिप्शन | समाज कल्याण न्यास द्वारा पंजीकृत एवं सुरक्षित', en: '🔒 256-Bit Encrypted | Registered & Secured by Samaj Trust' },
  loginFooterText: { hi: '© 2026 श्री घाँची समाज कल्याण न्यास | सर्वाधिकार सुरक्षित', en: '© 2026 Shree Ghanchi Samaj Welfare Trust | All Rights Reserved' },

  // Simple Minimalist Login Page Translations
  simpleLoginHeading: { hi: 'लॉगिन करें', en: 'Login' },
  simpleLoginSubheading: { hi: 'सुरक्षित प्रवेश के लिए अपना मोबाइल नंबर दर्ज करें', en: 'Enter your mobile number for secure access' },
  simpleEnterMobile: { hi: '10-अंकों का मोबाइल नंबर', en: '10-Digit Mobile Number' },
  simpleGetOtp: { hi: 'WhatsApp OTP प्राप्त करें', en: 'Get WhatsApp OTP' },
  simpleOrUse: { hi: 'या अन्य माध्यम', en: 'or choose other option' },
  simpleAdminLogin: { hi: 'व्यवस्थापक (Admin) पिन', en: 'Admin Security PIN' },
  simpleEmailLogin: { hi: 'ईमेल से OTP लॉगिन', en: 'Email OTP Login' },
  simpleBackToMobile: { hi: '← मोबाइल नंबर पर वापस जाएं', en: '← Back to Mobile Number' },
  simpleOneClickDemo: { hi: '⚡ 1-क्लिक डेमो लॉगिन (तुरंत टेस्ट करें)', en: '⚡ 1-Click Demo Login (Test Instantly)' },
  simpleTrustBadge: { hi: '🔒 सुरक्षित एवं अधिकृत समाज डिजिटल पोर्टल', en: '🔒 Secure & Official Samaj Portal' },
  mockupCardBanner: { hi: 'अपने खाते में लॉगिन करें', en: 'Login to Your Account' },
  mockupTagline: { hi: 'परिवार से जुड़ें • धरोहर संजोएं • साथ बढ़ें', en: 'Connect with Family • Preserve Our Heritage • Grow Together' },
  samajSlogan: { hi: '॥ जय श्री घाँची समाज ॥', en: '॥ Jai Shree Ghanchi Samaj ॥' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('gsa_language');
      return (saved === 'en' || saved === 'hi') ? (saved as Language) : 'hi';
    } catch (e) {
      return 'hi';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('gsa_language', lang);
    } catch (e) {
      console.error('Failed to save language in localStorage', e);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

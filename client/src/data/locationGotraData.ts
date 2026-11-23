// [GSA-LOC-S-UT-01: Shared Location & Gotra Master Data Utilities]

export interface OptionItem {
  value: string;
  hi: string;
  en: string;
}

export const GOTRA_OPTIONS: OptionItem[] = [
  { value: 'Borana', hi: 'बोराणा', en: 'Borana' },
  { value: 'Solanki', hi: 'सोलंकी', en: 'Solanki' },
  { value: 'Panwar', hi: 'पंवार', en: 'Panwar' },
  { value: 'Rathore', hi: 'राठौड़', en: 'Rathore' },
  { value: 'Bhati', hi: 'भाटी', en: 'Bhati' },
  { value: 'Chauhan', hi: 'चौहान', en: 'Chauhan' },
  { value: 'Parmar', hi: 'परमार', en: 'Parmar' },
  { value: 'Gehlot', hi: 'गहलोत', en: 'Gehlot' }
];

export const VILLAGE_OPTIONS = {
  hi: ['आकोली', 'बागरा', 'सियाणा', 'धानपुर', 'रायपुरिया', 'बिबलसर', 'डूडसी', 'नागणी', 'मायलावास', 'मोक', 'रेवतड़ा', 'साँथू', 'चूरा', 'धाणसा', 'बाकरा', 'सेरणा', 'आहोर', 'भीनमाल', 'सांचौर', 'सुमेरपुर'],
  en: ['Aakoli', 'Bagra', 'Siyana', 'Dhanpur', 'Raipuriya', 'Bibalsar', 'Dudsi', 'Nagani', 'Maylawas', 'Mok', 'Revatda', 'Santhu', 'Chura', 'Dhansa', 'Bakra', 'Serna', 'Ahore', 'Bhinmal', 'Sanchore', 'Sumerpur']
};

export const DISTRICT_OPTIONS = {
  hi: ['जालोर', 'जोधपुर', 'पाली', 'सिरोही', 'बाड़मेर', 'बालोतरा', 'अहमदाबाद', 'सूरत', 'मुंबई'],
  en: ['Jalore', 'Jodhpur', 'Pali', 'Sirohi', 'Barmer', 'Balotra', 'Ahmedabad', 'Surat', 'Mumbai']
};

export const STATE_OPTIONS = {
  hi: ['राजस्थान', 'गुजरात', 'महाराष्ट्र', 'कर्नाटक', 'तेलंगाना', 'मध्य प्रदेश', 'दिल्ली'],
  en: ['Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Telangana', 'Madhya Pradesh', 'Delhi']
};

export const CITY_OPTIONS = {
  hi: ['जोधपुर', 'जालोर', 'पाली', 'अहमदाबाद', 'सूरत', 'मुंबई', 'बेंगलुरु', 'पुणे', 'हैदराबाद'],
  en: ['Jodhpur', 'Jalore', 'Pali', 'Ahmedabad', 'Surat', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad']
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b[a-z]/g, c => c.toUpperCase());
};

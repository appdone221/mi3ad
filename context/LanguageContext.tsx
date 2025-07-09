import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ar' | 'en' | 'fr' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    welcome: 'مرحباً بكم في Mi3AD',
    selectLanguage: 'اختر اللغة',
    getStarted: 'ابدأ الآن',
    home: 'الرئيسية',
    events: 'الفعاليات',
    bookings: 'حجوزاتي',
    profile: 'الملف الشخصي',
    search: 'البحث عن الفعاليات...',
    categories: 'الفئات',
    governmentServices: 'الخدمات الحكومية',
    schools: 'التعليم',
    clinics: 'الصحة',
    specialOccasions: 'المناسبات الخاصة',
    grandOpenings: 'الافتتاحات الكبرى',
    entertainment: 'الترفيه',
    featured: 'الفعاليات المميزة',
    nearby: 'الفعاليات القريبة',
    free: 'مجاني',
    bookNow: 'احجز الآن',
    eventDetails: 'تفاصيل الفعالية',
    speakers: 'المتحدثون',
    schedule: 'البرنامج',
    location: 'الموقع',
    phoneVerification: 'تحقق من رقم الهاتف',
    enterPhone: 'أدخل رقم هاتفك',
    verifyCode: 'تحقق من الكود',
    continueWithGoogle: 'متابعة مع Google',
    continueWithApple: 'متابعة مع Apple',
    myTickets: 'تذاكري',
    scanTickets: 'فحص التذاكر',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    messages: 'الرسائل',
    chat: 'المحادثة',
  },
  en: {
    welcome: 'Welcome to Mi3AD',
    selectLanguage: 'Select Language',
    getStarted: 'Get Started',
    home: 'Home',
    events: 'Events',
    bookings: 'My Bookings',
    profile: 'Profile',
    search: 'Search for events...',
    categories: 'Categories',
    governmentServices: 'Government Services',
    schools: 'Education',
    clinics: 'Health',
    specialOccasions: 'Special Occasions',
    grandOpenings: 'Grand Openings',
    entertainment: 'Entertainment',
    featured: 'Featured Events',
    nearby: 'Nearby Events',
    free: 'Free',
    bookNow: 'Book Now',
    eventDetails: 'Event Details',
    speakers: 'Speakers',
    schedule: 'Schedule',
    location: 'Location',
    phoneVerification: 'Phone Verification',
    enterPhone: 'Enter your phone number',
    verifyCode: 'Verify Code',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    myTickets: 'My Tickets',
    scanTickets: 'Scan Tickets',
    settings: 'Settings',
    logout: 'Logout',
    messages: 'Messages',
    chat: 'Chat',
  },
  fr: {
    welcome: 'Bienvenue sur Mi3AD',
    selectLanguage: 'Sélectionner la langue',
    getStarted: 'Commencer',
    home: 'Accueil',
    events: 'Événements',
    bookings: 'Mes réservations',
    profile: 'Profil',
    search: 'Rechercher des événements...',
    categories: 'Catégories',
    governmentServices: 'Services gouvernementaux',
    schools: 'Éducation',
    clinics: 'Santé',
    specialOccasions: 'Occasions spéciales',
    grandOpenings: 'Grandes ouvertures',
    entertainment: 'Divertissement',
    featured: 'Événements en vedette',
    nearby: 'Événements à proximité',
    free: 'Gratuit',
    bookNow: 'Réserver maintenant',
    eventDetails: 'Détails de l\'événement',
    speakers: 'Intervenants',
    schedule: 'Programme',
    location: 'Lieu',
    phoneVerification: 'Vérification du téléphone',
    enterPhone: 'Entrez votre numéro de téléphone',
    verifyCode: 'Vérifier le code',
    continueWithGoogle: 'Continuer avec Google',
    continueWithApple: 'Continuer avec Apple',
    myTickets: 'Mes billets',
    scanTickets: 'Scanner les billets',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    messages: 'Messages',
    chat: 'Chat',
  },
  ru: {
    welcome: 'Добро пожаловать в Mi3AD',
    selectLanguage: 'Выберите язык',
    getStarted: 'Начать',
    home: 'Главная',
    events: 'События',
    bookings: 'Мои бронирования',
    profile: 'Профиль',
    search: 'Поиск событий...',
    categories: 'Категории',
    governmentServices: 'Государственные услуги',
    schools: 'Образование',
    clinics: 'Здоровье',
    specialOccasions: 'Особые случаи',
    grandOpenings: 'Торжественные открытия',
    entertainment: 'Развлечения',
    featured: 'Рекомендуемые события',
    nearby: 'Близлежащие события',
    free: 'Бесплатно',
    bookNow: 'Забронировать',
    eventDetails: 'Детали события',
    speakers: 'Спикеры',
    schedule: 'Расписание',
    location: 'Местоположение',
    phoneVerification: 'Проверка телефона',
    enterPhone: 'Введите номер телефона',
    verifyCode: 'Проверить код',
    continueWithGoogle: 'Продолжить с Google',
    continueWithApple: 'Продолжить с Apple',
    myTickets: 'Мои билеты',
    scanTickets: 'Сканировать билеты',
    settings: 'Настройки',
    logout: 'Выйти',
    messages: 'Сообщения',
    chat: 'Чат',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
import React, { createContext, useState, useContext } from 'react';

type Language = 'UZ' | 'RU' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  UZ: {
    dashboard: 'Dashboard',
    attendance: 'Davomat',
    logs: 'Tizim Loglari',
    management: 'Boshqaruv',
    matrix: 'Matrix Solver',
    logout: 'Chiqish',
    theme: 'Mavzu',
    language: 'Til',
    settings: 'Sozlamalar',
    welcome: 'Xush kelibsiz',
    search: 'Qidiruv',
    add_new: 'Yangi qo\'shish',
    save: 'Saqlash',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    schedule: 'Dars jadvali',
    groups: 'Guruhlarim',
    mizan: 'Mizan AI',
    profile: 'Profilim',
    timetable: 'Jadval',
    control_center: 'Boshqaruv Markazi',
    data_active: 'Ma\'lumotlar Faol',
    data_import: 'Ma\'lumotlar Importi',
    matrix_solver: 'Matrix Solver',
    manual_control: 'Qo\'lda Boshqarish',
    system_logs: 'Tizim Loglari',
    search_assets: 'Resurslarni qidirish',
    add_resource: 'Resurs qo\'shish',
    total: 'Jami',
    active_status: 'Tizim holati',
    data_integrity: 'Ma\'lumot butunligi',
    user_load: 'Foydalanuvchi yuklamasi',
    edit_record: 'Tahrirlash',
    commit_data: 'Ma\'lumotni saqlash',
    solver_monitor: 'Solver Monitori',
    iteration: 'Iteratsiya',
    total_score: 'Umumiy ball',
    active_constraints: 'Aktiv cheklovlar',
    current_state: 'Joriy holat',
    refresh: 'Yangilash',
    download_logs: 'Loglarni yuklash',
    action: 'Harakat',
    user: 'Foydalanuvchi',
    time: 'Vaqt',
    status: 'Holat',
    category: 'Kategoriya',
    server_time: 'Server vaqti',
    mizan_title: 'Mizan AI',
    mizan_subtitle: 'Gemini Ultra asosidagi ilg\'or baholash tizimi',
    upload_work: 'Ishingizni yuklang',
    drop_file: 'Faylni shu yerga tashlang yoki tanlang',
    select_file: 'Faylni Tanlash',
    file_uploaded: 'Fayl yuklandi',
    start_analysis: 'Tahlilni Boshlash',
    analyzing: 'Gemini tahlil qilmoqda',
    overall_score: 'Umumiy ball',
    feedback: 'AI Fikri',
    download_cert: 'Sertifikatni Yuklash',
    detailed_report: 'Batafsil Hisobot'
  },
  RU: {
    dashboard: 'Дашборд',
    attendance: 'Посещаемость',
    logs: 'Логи системы',
    management: 'Управление',
    matrix: 'Матрица',
    logout: 'Выход',
    theme: 'Тема',
    language: 'Язык',
    settings: 'Настройки',
    welcome: 'Добро пожаловать',
    search: 'Поиск',
    add_new: 'Добавить',
    save: 'Сохранить',
    edit: 'Редактировать',
    delete: 'Удалить',
    schedule: 'Расписание',
    groups: 'Мои группы',
    mizan: 'Мизан AI',
    profile: 'Профиль',
    timetable: 'График',
    control_center: 'Центр Управления',
    data_active: 'Данные Активны',
    data_import: 'Импорт Данных',
    matrix_solver: 'Матричный Солвер',
    manual_control: 'Ручное Управление',
    system_logs: 'Системные Логи',
    search_assets: 'Поиск ресурсов',
    add_resource: 'Добавить ресурс',
    total: 'Всего',
    active_status: 'Статус системы',
    data_integrity: 'Целостность данных',
    user_load: 'Нагрузка пользователей',
    edit_record: 'Изменить запись',
    commit_data: 'Сохранить данные',
    solver_monitor: 'Монитор Солвера',
    iteration: 'Итерация',
    total_score: 'Общий балл',
    active_constraints: 'Активные ограничения',
    current_state: 'Текущее состояние',
    refresh: 'Обновить',
    download_logs: 'Скачать логи',
    action: 'Действие',
    user: 'Пользователь',
    time: 'Время',
    status: 'Статус',
    category: 'Категория',
    server_time: 'Время сервера',
    mizan_title: 'Мизан AI',
    mizan_subtitle: 'Продвинутая система оценки на базе Gemini Ultra',
    upload_work: 'Загрузите вашу работу',
    drop_file: 'Перетащите файл сюда или выберите',
    select_file: 'Выбрать файл',
    file_uploaded: 'Файл загружен',
    start_analysis: 'Начать анализ',
    analyzing: 'Gemini проводит анализ',
    overall_score: 'Общий балл',
    feedback: 'Отзыв AI',
    download_cert: 'Скачать сертификат',
    detailed_report: 'Подробный отчет'
  },
  EN: {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    logs: 'System Logs',
    management: 'Management',
    matrix: 'Matrix Solver',
    logout: 'Log out',
    theme: 'Theme',
    language: 'Language',
    settings: 'Settings',
    welcome: 'Welcome',
    search: 'Search',
    add_new: 'Add New',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    schedule: 'Schedule',
    groups: 'My Groups',
    mizan: 'Mizan AI',
    profile: 'My Profile',
    timetable: 'Timetable',
    control_center: 'Control Center',
    data_active: 'Data Active',
    data_import: 'Data Import',
    matrix_solver: 'Matrix Solver',
    manual_control: 'Manual Control',
    system_logs: 'System Logs',
    search_assets: 'Search assets',
    add_resource: 'Add Resource',
    total: 'Total',
    active_status: 'System Status',
    data_integrity: 'Data Integrity',
    user_load: 'User Load',
    edit_record: 'Edit Record',
    commit_data: 'Commit Data',
    solver_monitor: 'Solver Monitor',
    iteration: 'Iteration',
    total_score: 'Total Score',
    active_constraints: 'Active Constraints',
    current_state: 'Current State',
    refresh: 'Refresh',
    download_logs: 'Download Logs',
    action: 'Action',
    user: 'User',
    time: 'Time',
    status: 'Status',
    category: 'Category',
    server_time: 'Server Time',
    mizan_title: 'Mizan AI',
    mizan_subtitle: 'Powered by Gemini Ultra // Advanced Evaluator',
    upload_work: 'Ishingizni yuklang',
    drop_file: 'Faylni shu yerga tashlang yoki tanlang',
    select_file: 'Faylni Tanlash',
    file_uploaded: 'Fayl yuklandi',
    start_analysis: 'Tahlilni Boshlash',
    analyzing: 'Gemini tahlil qilmoqda',
    overall_score: 'Umumiy ball',
    feedback: 'AI Fikri',
    download_cert: 'Sertifikatni Yuklash',
    detailed_report: 'Batafsil Hisobot'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>(() => {
    return (localStorage.getItem('app-lang') as Language) || 'UZ';
  });

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem('app-lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

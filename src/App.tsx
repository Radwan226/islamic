import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuranList from "@/components/QuranList";
import SurahReading from "@/components/SurahReading";
import HadithSection from "@/components/HadithSection";
import DuasAdhkar from "@/components/DuasAdhkar";
import Tasbih from "@/components/Tasbih";
import PrayerTimes from "@/components/PrayerTimes";
import ContactUs from "@/components/ContactUs";
import SadaqaJariya from "@/components/SadaqaJariya";
import UserAuth from "@/components/UserAuth";
import UserProfile from "@/components/UserProfile";
import { 
  BookOpen, 
  Heart, 
  Search, 
  Volume2, 
  User, 
  Moon, 
  Sun, 
  Bookmark,
  Clock,
  BookMarked,
  Sparkles,
  Play,
  Headphones,
  Settings,
  Home,
  MessageCircle,
  UserPlus
} from "lucide-react";

type PageType = 'home' | 'quran' | 'surah-reading' | 'hadith' | 'duas' | 'tasbih' | 'prayer-times' | 'contact' | 'sadaqa-jariya' | 'login' | 'profile';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  readingStats: {
    completedSurahs: number;
    totalReadTime: number;
    prayerStreak: number;
    bookmarkedAyahs: number;
  };
  preferences: {
    favoriteReciter: string;
    preferredLanguage: string;
    notificationsEnabled: boolean;
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedSurah, setSelectedSurah] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for logged in user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('islamic-portal-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('islamic-portal-user');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSurahSelect = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
    setCurrentPage('surah-reading');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleBackToQuran = () => {
    setCurrentPage('quran');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('islamic-portal-user');
    setUser(null);
    setCurrentPage('home');
  };

  const handleUserClick = () => {
    if (user) {
      setCurrentPage('profile');
    } else {
      setCurrentPage('login');
    }
  };

  const islamicSections = [
    {
      title: "القرآن الكريم",
      description: "قراءة واستماع القرآن الكريم بخطوط جميلة وأصوات مختلفة",
      icon: BookOpen,
      color: "bg-emerald-500",
      onClick: () => setCurrentPage('quran')
    },
    {
      title: "مواقيت الصلاة",
      description: "أوقات الصلاة مع الأذان والتنبيهات وعداد تنازلي",
      icon: Clock,
      color: "bg-teal-500",
      onClick: () => setCurrentPage('prayer-times')
    },
    {
      title: "الأحاديث النبوية",
      description: "مجموعة شاملة من الأحاديث النبوية الصحيحة مع الشروحات",
      icon: BookMarked,
      color: "bg-blue-500",
      onClick: () => setCurrentPage('hadith')
    },
    {
      title: "الأدعية والأذكار",
      description: "أدعية وأذكار من القرآن والسنة للمناسبات المختلفة",
      icon: Heart,
      color: "bg-purple-500",
      onClick: () => setCurrentPage('duas')
    },
    {
      title: "السبحة الإلكترونية",
      description: "عداد إلكتروني للتسبيح والذكر مع أذكار متنوعة",
      icon: Sparkles,
      color: "bg-amber-500",
      onClick: () => setCurrentPage('tasbih')
    },
    {
      title: "الصدقة الجارية",
      description: "اكتب أسماء أحبائك المتوفين ليدعو لهم جميع زوار الموقع",
      icon: Heart,
      color: "bg-rose-500",
      onClick: () => setCurrentPage('sadaqa-jariya')
    },
    {
      title: "تواصل معنا",
      description: "للاقتراحات والدعم والتواصل مع فريق التطوير",
      icon: MessageCircle,
      color: "bg-indigo-500",
      onClick: () => setCurrentPage('contact')
    }
  ];

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'quran':
        return <QuranList onSurahSelect={handleSurahSelect} />;
      case 'surah-reading':
        return <SurahReading surahNumber={selectedSurah} onBack={handleBackToQuran} />;
      case 'prayer-times':
        return <PrayerTimes />;
      case 'hadith':
        return <HadithSection />;
      case 'duas':
        return <DuasAdhkar />;
      case 'tasbih':
        return <Tasbih />;
      case 'sadaqa-jariya':
        return <SadaqaJariya />;
      case 'contact':
        return <ContactUs />;
      case 'login':
        return <UserAuth onLogin={handleLogin} onBack={handleBackToHome} />;
      case 'profile':
        return user ? <UserProfile user={user} onLogout={handleLogout} onBack={handleBackToHome} /> : renderHomePage();
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            بسم الله الرحمن الرحيم
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            موقع شامل للقرآن الكريم والسنة النبوية والأدعية والأذكار
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text"
              placeholder="ابحث في القرآن أو الأحاديث أو الأدعية..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {islamicSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/30" onClick={section.onClick}>
                <CardHeader className="text-center">
                  <div className={`${section.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-serif text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-center leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Tabs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Clock className="h-5 w-5" />
              الوصول السريع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">المقروء مؤخراً</TabsTrigger>
                <TabsTrigger value="bookmarks">المحفوظات</TabsTrigger>
                <TabsTrigger value="favorites">المفضلات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4 mt-6">
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لم تقم بقراءة أي محتوى بعد</p>
                  <p className="text-sm">ابدأ بقراءة القرآن أو الأحاديث لتظهر هنا</p>
                </div>
              </TabsContent>
              
              <TabsContent value="bookmarks" className="space-y-4 mt-6">
                <div className="text-center text-muted-foreground py-8">
                  <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد إشارات مرجعية محفوظة</p>
                  <p className="text-sm">احفظ الآيات والأحاديث المفضلة لديك</p>
                </div>
              </TabsContent>
              
              <TabsContent value="favorites" className="space-y-4 mt-6">
                <div className="text-center text-muted-foreground py-8">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد عناصر مفضلة</p>
                  <p className="text-sm">أضف المحتوى المفضل لديك لسهولة الوصول</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Featured Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Play className="h-5 w-5" />
                آية اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-right">
                <p className="text-2xl font-serif leading-relaxed mb-4 text-primary">
                  وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
                </p>
                <p className="text-lg font-serif leading-relaxed mb-3">
                  وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">سورة الطلاق: 2-3</Badge>
                  <Button variant="ghost" size="sm">
                    <Volume2 className="h-4 w-4" />
                    استمع
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                حديث اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-right">
                <p className="text-lg leading-relaxed mb-4">
                  عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم:
                </p>
                <p className="text-xl font-serif leading-relaxed mb-3 text-primary">
                  "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير"
                </p>
                <Badge variant="secondary">رواه مسلم</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              © 2024 البوابة الإسلامية - جميع الحقوق محفوظة
            </p>
            <p className="text-sm text-muted-foreground">
              موقع مجاني لخدمة الإسلام والمسلمين
            </p>
          </div>
        </div>
      </footer>
    </>
  );

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToHome}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-serif text-primary">البوابة الإسلامية</h1>
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              {currentPage !== 'home' && (
                <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                  <Home className="h-4 w-4 ml-2" />
                  الرئيسية
                </Button>
              )}
              
              <div className="hidden md:block text-sm text-muted-foreground">
                <div className="text-right">
                  <div className="font-medium">{formatTime(currentTime)}</div>
                  <div className="text-xs">{formatDate(currentTime)}</div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleUserClick}>
                <User className="h-5 w-5" />
                {user ? (
                  <div className="hidden md:block text-right mr-2">
                    <div className="text-xs">{user.name.split(' ')[0]}</div>
                  </div>
                ) : (
                  <span className="hidden md:block mr-2">تسجيل الدخول</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {renderCurrentPage()}
    </div>
  );
}

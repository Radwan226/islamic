import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Calendar,
  BookOpen,
  Clock,
  Heart,
  Bookmark,
  TrendingUp,
  Star,
  Award,
  Target,
  Settings,
  LogOut,
  Edit,
  Trophy,
  Flame,
  Activity
} from "lucide-react";

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

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

export default function UserProfile({ user, onLogout, onBack }: UserProfileProps) {
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // Simulate calculating current reading streak
    const lastActivity = localStorage.getItem('last-reading-activity');
    const today = new Date().toDateString();
    
    if (lastActivity === today) {
      setCurrentStreak(user.readingStats.prayerStreak + 1);
    } else {
      setCurrentStreak(user.readingStats.prayerStreak);
    }
  }, [user]);

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ساعة و ${remainingMinutes} دقيقة`;
    }
    return `${remainingMinutes} دقيقة`;
  };

  const getCompletionPercentage = () => {
    return Math.round((user.readingStats.completedSurahs / 114) * 100);
  };

  const achievements = [
    {
      title: "مبتدئ في القراءة",
      description: "أكملت أول 5 سور",
      icon: BookOpen,
      unlocked: user.readingStats.completedSurahs >= 5,
      color: "bg-blue-500"
    },
    {
      title: "قارئ مثابر",
      description: "أكملت 15 سورة",
      icon: Trophy,
      unlocked: user.readingStats.completedSurahs >= 15,
      color: "bg-green-500"
    },
    {
      title: "عاشق للذكر",
      description: "أكملت 100 دقيقة من القراءة",
      icon: Heart,
      unlocked: user.readingStats.totalReadTime >= 100,
      color: "bg-pink-500"
    },
    {
      title: "مداوم على القراءة",
      description: "حافظت على قراءة يومية لمدة أسبوع",
      icon: Flame,
      unlocked: currentStreak >= 7,
      color: "bg-orange-500"
    },
    {
      title: "جامع الآيات",
      description: "حفظت 20 آية في المفضلات",
      icon: Bookmark,
      unlocked: user.readingStats.bookmarkedAyahs >= 20,
      color: "bg-purple-500"
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextGoals = [
    {
      title: "اقرأ 5 سور إضافية",
      current: user.readingStats.completedSurahs,
      target: Math.ceil(user.readingStats.completedSurahs / 5) * 5 + 5,
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "احفظ 10 آيات إضافية",
      current: user.readingStats.bookmarkedAyahs,
      target: Math.ceil(user.readingStats.bookmarkedAyahs / 10) * 10 + 10,
      icon: Bookmark,
      color: "bg-purple-500"
    },
    {
      title: "اقض ساعة إضافية في القراءة",
      current: user.readingStats.totalReadTime,
      target: Math.ceil(user.readingStats.totalReadTime / 60) * 60 + 60,
      icon: Clock,
      color: "bg-green-500"
    }
  ];

  const stats = [
    {
      label: "السور المكتملة",
      value: user.readingStats.completedSurahs,
      total: 114,
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      label: "وقت القراءة الإجمالي",
      value: formatReadingTime(user.readingStats.totalReadTime),
      icon: Clock,
      color: "text-green-600"
    },
    {
      label: "الآيات المحفوظة",
      value: user.readingStats.bookmarkedAyahs,
      icon: Bookmark,
      color: "text-purple-600"
    },
    {
      label: "أيام القراءة المتتالية",
      value: currentStreak,
      icon: Flame,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
              <User className="h-8 w-8" />
              الملف الشخصي
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                إعدادات
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-right">
                  <h2 className="text-2xl font-bold font-serif mb-2">{user.name}</h2>
                  <p className="text-muted-foreground mb-2">{user.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>انضم في {formatJoinDate(user.joinDate)}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    المستوى: متوسط
                  </Badge>
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-1">تقدم القرآن</div>
                    <div className="flex items-center gap-2">
                      <Progress value={getCompletionPercentage()} className="w-24" />
                      <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
              <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
              <TabsTrigger value="goals">الأهداف</TabsTrigger>
            </TabsList>
            
            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6 mt-6">
              {/* Main Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                            <IconComponent className={`h-6 w-6 ${stat.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-2xl font-bold">
                              {typeof stat.value === 'string' ? stat.value : stat.value}
                              {stat.total && <span className="text-muted-foreground">/{stat.total}</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Reading Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    تقدمك في القراءة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">إكمال القرآن الكريم</span>
                        <span className="text-sm text-muted-foreground">
                          {user.readingStats.completedSurahs} من 114 سورة
                        </span>
                      </div>
                      <Progress value={getCompletionPercentage()} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {user.readingStats.completedSurahs}
                        </div>
                        <div className="text-sm text-muted-foreground">سورة مكتملة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {114 - user.readingStats.completedSurahs}
                        </div>
                        <div className="text-sm text-muted-foreground">سورة متبقية</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {currentStreak}
                        </div>
                        <div className="text-sm text-muted-foreground">يوم متتالي</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Card key={index} className={`${!achievement.unlocked ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`${achievement.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              {achievement.unlocked && (
                                <Badge variant="secondary" className="text-xs">مكتمل</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            {!achievement.unlocked && (
                              <p className="text-xs text-muted-foreground mt-2">
                                🔒 لم يكتمل بعد
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card className="bg-gradient-to-r from-gold-50 to-yellow-100 dark:from-gold-950 dark:to-yellow-900">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
                  <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                    لديك {unlockedAchievements.length} إنجاز مكتمل!
                  </h3>
                  <p className="text-yellow-600 dark:text-yellow-400">
                    استمر في القراءة لتحصل على المزيد من الإنجازات
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 gap-6">
                {nextGoals.map((goal, index) => {
                  const IconComponent = goal.icon;
                  const progress = Math.min((goal.current / goal.target) * 100, 100);
                  
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`${goal.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{goal.title}</h4>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-muted-foreground">
                                {goal.current} من {goal.target}
                              </span>
                              <span className="text-sm font-medium">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    نصائح لتحقيق أهدافك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p>اقرأ سورة واحدة على الأقل يومياً للحفاظ على التقدم المستمر</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p>احفظ الآيات التي تلامس قلبك في قائمة المفضلات</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p>استمع للقرآن أثناء التنقل لزيادة وقت التعرض للذكر</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p>شارك آياتك المفضلة مع الأصدقاء لتحصل على الأجر</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
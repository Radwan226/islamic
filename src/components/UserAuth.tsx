import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn,
  Star,
  BookOpen,
  Heart,
  Clock,
  Shield,
  Gift,
  CheckCircle
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

interface UserAuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export default function UserAuth({ onLogin, onBack }: UserAuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user data
      const user: User = {
        id: "user-1",
        name: "أحمد محمد",
        email: loginForm.email,
        joinDate: "2024-01-15",
        readingStats: {
          completedSurahs: 15,
          totalReadTime: 120, // minutes
          prayerStreak: 7,
          bookmarkedAyahs: 25
        },
        preferences: {
          favoriteReciter: "عبد الباسط عبد الصمد",
          preferredLanguage: "ar",
          notificationsEnabled: true
        }
      };
      
      // Save to localStorage
      localStorage.setItem('islamic-portal-user', JSON.stringify(user));
      
      setIsLoading(false);
      onLogin(user);
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock new user data
      const user: User = {
        id: "user-" + Date.now(),
        name: registerForm.name,
        email: registerForm.email,
        joinDate: new Date().toISOString().split('T')[0],
        readingStats: {
          completedSurahs: 0,
          totalReadTime: 0,
          prayerStreak: 0,
          bookmarkedAyahs: 0
        },
        preferences: {
          favoriteReciter: "عبد الباسط عبد الصمد",
          preferredLanguage: "ar", 
          notificationsEnabled: true
        }
      };
      
      // Save to localStorage
      localStorage.setItem('islamic-portal-user', JSON.stringify(user));
      
      setIsLoading(false);
      onLogin(user);
    }, 1500);
  };

  const features = [
    {
      icon: BookOpen,
      title: "تتبع التقدم في القراءة",
      description: "احفظ مكانك في كل سورة وتتبع إنجازاتك"
    },
    {
      icon: Heart,
      title: "حفظ المفضلات",
      description: "احفظ الآيات والأدعية المفضلة لديك"
    },
    {
      icon: Clock,
      title: "تذكيرات مخصصة",
      description: "اضبط تذكيرات للصلاة والأذكار اليومية"
    },
    {
      icon: Star,
      title: "إحصائيات شخصية",
      description: "راجع إحصائياتك وإنجازاتك الروحية"
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
              حسابك الشخصي
            </h1>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              مجاني بالكامل
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-serif mb-4">
              أهلاً وسهلاً بك في البوابة الإسلامية
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              أنشئ حسابك المجاني لتتبع تقدمك في القراءة والاستفادة من جميع الميزات
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Auth Forms */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center font-serif">
                    <Shield className="h-6 w-6 mx-auto mb-2" />
                    الدخول أو إنشاء حساب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                      <TabsTrigger value="register">حساب جديد</TabsTrigger>
                    </TabsList>
                    
                    {/* Login Tab */}
                    <TabsContent value="login" className="space-y-4 mt-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="login-email">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-10 text-left"
                              placeholder="your@email.com"
                              required
                              dir="ltr"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="login-password">كلمة المرور</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              value={loginForm.password}
                              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                              className="pl-10 pr-10 text-left"
                              placeholder="••••••••"
                              required
                              dir="ltr"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                              جارٍ تسجيل الدخول...
                            </div>
                          ) : (
                            <>
                              <LogIn className="h-4 w-4 ml-2" />
                              تسجيل الدخول
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    {/* Register Tab */}
                    <TabsContent value="register" className="space-y-4 mt-6">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <Label htmlFor="register-name">الاسم الكامل</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-name"
                              type="text"
                              value={registerForm.name}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                              className="pl-10 text-right"
                              placeholder="اكتب اسمك الكامل"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="register-email">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-email"
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-10 text-left"
                              placeholder="your@email.com"
                              required
                              dir="ltr"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="register-password">كلمة المرور</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-password"
                              type={showPassword ? "text" : "password"}
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                              className="pl-10 text-left"
                              placeholder="••••••••"
                              required
                              dir="ltr"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="register-confirm">تأكيد كلمة المرور</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-confirm"
                              type={showPassword ? "text" : "password"}
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="pl-10 text-left"
                              placeholder="••••••••"
                              required
                              dir="ltr"
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                              جارٍ إنشاء الحساب...
                            </div>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 ml-2" />
                              إنشاء حساب جديد
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Features */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    مميزات الحساب الشخصي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Privacy Note */}
              <Card className="bg-green-50 dark:bg-green-950/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                        خصوصية وأمان
                      </h4>
                      <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <p>• لن نرسل لك رسائل بريد إلكتروني إلا إذا طلبت ذلك</p>
                        <p>• بياناتك محفوظة ومشفرة بأعلى معايير الأمان</p>
                        <p>• يمكنك حذف حسابك وبياناتك في أي وقت</p>
                        <p>• الخدمة مجانية بالكامل لوجه الله تعالى</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
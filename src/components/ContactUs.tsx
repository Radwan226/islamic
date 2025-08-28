import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Facebook,
  Send,
  Mail,
  Phone,
  Globe,
  Heart,
  Star,
  Users,
  Code,
  Sparkles
} from "lucide-react";

export default function ContactUs() {
  const socialLinks = [
    {
      platform: "Facebook",
      icon: Facebook,
      username: "Radwan263",
      url: "https://m.facebook.com/Radwan263",
      color: "bg-blue-600 hover:bg-blue-700",
      description: "تابعنا على فيسبوك للحصول على آخر التحديثات والمحتوى الإسلامي"
    },
    {
      platform: "Telegram", 
      icon: Send,
      username: "Radwan263",
      url: "https://t.me/Radwan263",
      color: "bg-sky-500 hover:bg-sky-600", 
      description: "انضم إلى قناتنا على تليجرام للحصول على الأدعية اليومية والتذكيرات"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "مجاني بالكامل",
      description: "جميع المحتويات والخدمات مجانية لوجه الله تعالى"
    },
    {
      icon: Star,
      title: "محتوى موثق",
      description: "جميع النصوص من مصادر موثوقة ومراجعة من قبل علماء"
    },
    {
      icon: Users,
      title: "مجتمع إسلامي",
      description: "انضم إلى مجتمعنا من المسلمين حول العالم"
    },
    {
      icon: Code,
      title: "تطوير مستمر",
      description: "نعمل باستمرار على تحسين وإضافة ميزات جديدة"
    }
  ];

  const stats = [
    { number: "17,000+", label: "محتوى إسلامي" },
    { number: "10", label: "قارئ للقرآن" },
    { number: "10", label: "لغات للترجمة" },
    { number: "24/7", label: "متاح دائماً" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
              <MessageCircle className="h-8 w-8" />
              تواصل معنا
            </h1>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              نحن هنا لمساعدتك
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Message */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif mb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span>أهلاً وسهلاً بكم في البوابة الإسلامية</span>
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                موقع مجاني بالكامل يهدف لخدمة الإسلام والمسلمين في جميع أنحاء العالم. 
                نسعى لتقديم أفضل المحتويات الإسلامية بأحدث التقنيات وأجمل التصاميم.
              </p>
              <div className="text-xl font-serif text-primary mb-4">
                "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا"
              </div>
              <p className="text-sm text-muted-foreground">
                نرحب بملاحظاتكم واقتراحاتكم لتحسين الموقع
              </p>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl">{social.platform}</h3>
                        <p className="text-sm text-muted-foreground font-normal">@{social.username}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {social.description}
                    </p>
                    <Button 
                      className={`${social.color} w-full text-white border-none shadow-md hover:shadow-lg transition-all duration-300`}
                      onClick={() => window.open(social.url, '_blank')}
                    >
                      <IconComponent className="h-4 w-4 ml-2" />
                      تواصل عبر {social.platform}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center font-serif text-2xl">
                لماذا البوابة الإسلامية؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center font-serif text-2xl">
                إحصائيات الموقع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation Message */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-green-700 dark:text-green-300">
                الدعاء لنا ولوالدينا
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg mb-4 text-green-700 dark:text-green-300">
                لا نطلب منكم سوى الدعاء الصالح لنا ولوالدينا والقائمين على هذا العمل
              </p>
              <div className="text-xl font-serif text-green-800 dark:text-green-200 mb-4">
                "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ"
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                جزاكم الله خيراً على دعمكم ودعائكم
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
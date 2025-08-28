import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Search, 
  Copy, 
  Share2, 
  Bookmark,
  BookmarkPlus,
  Volume2,
  Sun,
  Moon,
  Utensils,
  Car,
  Star
} from "lucide-react";
import duasData from "@/data/duas-adhkar.json";

export default function DuasAdhkar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedDuas, setBookmarkedDuas] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("morning");

  const categories = [
    { 
      id: "morning", 
      title: "أذكار الصباح", 
      icon: Sun, 
      data: duasData.morningAdhkar,
      color: "bg-amber-500"
    },
    { 
      id: "evening", 
      title: "أذكار المساء", 
      icon: Moon, 
      data: duasData.eveningAdhkar,
      color: "bg-indigo-500"
    },
    { 
      id: "sleep", 
      title: "أدعية النوم", 
      icon: Star, 
      data: duasData.sleepDuas,
      color: "bg-purple-500"
    },
    { 
      id: "food", 
      title: "أدعية الطعام", 
      icon: Utensils, 
      data: duasData.foodDuas,
      color: "bg-green-500"
    },
    { 
      id: "travel", 
      title: "أدعية السفر", 
      icon: Car, 
      data: duasData.travelDuas,
      color: "bg-blue-500"
    },
    { 
      id: "general", 
      title: "أدعية عامة", 
      icon: Heart, 
      data: duasData.generalDuas,
      color: "bg-rose-500"
    }
  ];

  const currentCategory = categories.find(cat => cat.id === activeTab);
  const currentDuas = currentCategory?.data?.items || [];

  const filteredDuas = currentDuas.filter(dua =>
    dua.arabic.includes(searchTerm) ||
    dua.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dua.reward && dua.reward.includes(searchTerm))
  );

  const toggleBookmark = (duaId: string) => {
    setBookmarkedDuas(prev =>
      prev.includes(duaId)
        ? prev.filter(id => id !== duaId)
        : [...prev, duaId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast notification here
    });
  };

  const shareText = (text: string) => {
    if (navigator.share) {
      navigator.share({ text });
    } else {
      copyToClipboard(text);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
                <Heart className="h-8 w-8" />
                الأدعية والأذكار
              </h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredDuas.length} دعاء
              </Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="ابحث في الأدعية والأذكار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-right"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  onClick={() => setActiveTab(category.id)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-center">{category.title}</span>
                </Button>
              );
            })}
          </div>

          {/* Current Category */}
          {currentCategory && (
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="font-serif text-2xl text-primary flex items-center justify-center gap-2">
                  <currentCategory.icon className="h-6 w-6" />
                  {currentCategory.data.title}
                </CardTitle>
                <p className="text-muted-foreground">{currentCategory.data.description}</p>
              </CardHeader>
            </Card>
          )}

          {/* Duas List */}
          <div className="space-y-6">
            {filteredDuas.map((dua, index) => (
              <Card key={dua.id || index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Arabic Text */}
                    <div className="text-right">
                      <p className="text-2xl font-serif leading-loose text-primary" style={{ fontFamily: "'Amiri', serif" }}>
                        {dua.arabic}
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed text-right">
                        {dua.translation}
                      </p>
                    </div>

                    {/* Repetitions */}
                    {dua.repetitions && dua.repetitions > 1 && (
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          يُكرر {dua.repetitions} مرات
                        </Badge>
                      </div>
                    )}

                    {/* Occasion */}
                    {(dua as any).occasion && (
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {(dua as any).occasion}
                        </Badge>
                      </div>
                    )}

                    {/* Reward */}
                    {dua.reward && (
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 text-right">الثواب:</h4>
                        <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed text-right">
                          {dua.reward}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Volume2 className="h-4 w-4 ml-2" />
                          استمع
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(dua.arabic)}
                        >
                          <Copy className="h-4 w-4 ml-2" />
                          نسخ
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => shareText(dua.arabic)}
                        >
                          <Share2 className="h-4 w-4 ml-2" />
                          مشاركة
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(`${activeTab}-${dua.id || index}`)}
                      >
                        {bookmarkedDuas.includes(`${activeTab}-${dua.id || index}`) ? (
                          <Bookmark className="h-4 w-4 ml-2 fill-current" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4 ml-2" />
                        )}
                        {bookmarkedDuas.includes(`${activeTab}-${dua.id || index}`) ? 'محفوظ' : 'حفظ'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDuas.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">لم يتم العثور على نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر قسماً آخر</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
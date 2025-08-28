import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  BookMarked, 
  Search, 
  Copy, 
  Share2, 
  Bookmark,
  BookmarkPlus,
  Volume2,
  Filter,
  Star
} from "lucide-react";
import hadithData from "@/data/hadith-collections.json";

export default function HadithSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("bukhari");
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<string[]>([]);
  const [gradeFilter, setGradeFilter] = useState<"all" | "sahih" | "hasan" | "daif">("all");

  const currentCollection = hadithData.find(collection => collection.id === selectedCollection);
  const hadiths = currentCollection?.hadiths || [];

  const filteredHadiths = hadiths.filter(hadith => {
    const matchesSearch = hadith.text.includes(searchTerm) ||
                         hadith.narrator.includes(searchTerm) ||
                         hadith.book.includes(searchTerm) ||
                         hadith.chapter.includes(searchTerm);
    
    const matchesGrade = gradeFilter === "all" || hadith.grade.includes(gradeFilter);
    
    return matchesSearch && matchesGrade;
  });

  const toggleBookmark = (hadithId: string) => {
    setBookmarkedHadiths(prev =>
      prev.includes(hadithId)
        ? prev.filter(id => id !== hadithId)
        : [...prev, hadithId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareText = (text: string) => {
    if (navigator.share) {
      navigator.share({ text });
    } else {
      copyToClipboard(text);
    }
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.includes("صحيح")) return "default";
    if (grade.includes("حسن")) return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
                <BookMarked className="h-8 w-8" />
                الأحاديث النبوية الشريفة
              </h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredHadiths.length} حديث
              </Badge>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ابحث في الأحاديث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-right"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={gradeFilter === "all" ? "default" : "outline"}
                  onClick={() => setGradeFilter("all")}
                  size="sm"
                >
                  <Filter className="h-4 w-4 ml-2" />
                  الكل
                </Button>
                <Button
                  variant={gradeFilter === "sahih" ? "default" : "outline"}
                  onClick={() => setGradeFilter("sahih")}
                  size="sm"
                >
                  صحيح
                </Button>
                <Button
                  variant={gradeFilter === "hasan" ? "default" : "outline"}
                  onClick={() => setGradeFilter("hasan")}
                  size="sm"
                >
                  حسن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Collections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {hadithData.map((collection) => (
              <Button
                key={collection.id}
                variant={selectedCollection === collection.id ? "default" : "outline"}
                onClick={() => setSelectedCollection(collection.id)}
                className="h-auto p-4 text-right"
              >
                <div className="w-full">
                  <div className="font-serif text-lg mb-2">{collection.name}</div>
                  <div className="text-sm text-muted-foreground">{collection.englishName}</div>
                  <Badge variant="secondary" className="mt-2">
                    {collection.numberOfHadiths} حديث
                  </Badge>
                </div>
              </Button>
            ))}
          </div>

          {/* Current Collection Info */}
          {currentCollection && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary text-center">
                  {currentCollection.name}
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  {currentCollection.englishName} • {currentCollection.numberOfHadiths} حديث
                </p>
              </CardHeader>
            </Card>
          )}

          {/* Hadiths List */}
          <div className="space-y-6">
            {filteredHadiths.map((hadith, index) => (
              <Card key={hadith.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getGradeBadgeVariant(hadith.grade)}>
                          {hadith.grade}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          رقم {hadith.id}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium">الكتاب:</span> {hadith.book}</p>
                        <p><span className="font-medium">الباب:</span> {hadith.chapter}</p>
                        <p><span className="font-medium">الراوي:</span> {hadith.narrator}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(`${selectedCollection}-${hadith.id}`)}
                    >
                      {bookmarkedHadiths.includes(`${selectedCollection}-${hadith.id}`) ? (
                        <Bookmark className="h-4 w-4 fill-current" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Hadith Text */}
                    <div className="text-right">
                      <p className="text-lg leading-relaxed font-serif" style={{ fontFamily: "'Amiri', serif" }}>
                        {hadith.text}
                      </p>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Volume2 className="h-4 w-4 ml-2" />
                          استمع
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(hadith.text)}
                        >
                          <Copy className="h-4 w-4 ml-2" />
                          نسخ
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => shareText(hadith.text)}
                        >
                          <Share2 className="h-4 w-4 ml-2" />
                          مشاركة
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="text-sm text-muted-foreground">حديث شريف</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHadiths.length === 0 && (
            <div className="text-center py-12">
              <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">لم يتم العثور على نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو غير المرشح أو المجموعة</p>
            </div>
          )}

          {/* Educational Note */}
          <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">ملاحظة مهمة</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  الأحاديث المعروضة هي عينة للتوضيح. للبحث الشامل والدقيق، يُنصح بالرجوع إلى المصادر الأصلية 
                  والعلماء المختصين في علم الحديث لفهم السياق والتطبيق الصحيح.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
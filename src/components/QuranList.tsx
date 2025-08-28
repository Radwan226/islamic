import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Play, 
  Search, 
  ArrowRight,
  Volume2,
  Filter
} from "lucide-react";
import quranSurahs from "@/data/quran-surahs.json";

interface QuranListProps {
  onSurahSelect: (surahNumber: number) => void;
}

export default function QuranList({ onSurahSelect }: QuranListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSurahs, setFilteredSurahs] = useState(quranSurahs);
  const [filterType, setFilterType] = useState<"all" | "meccan" | "medinan">("all");

  useEffect(() => {
    let filtered = quranSurahs.filter(surah =>
      surah.name.includes(searchTerm) ||
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== "all") {
      filtered = filtered.filter(surah => 
        surah.revelationType.toLowerCase() === filterType
      );
    }

    setFilteredSurahs(filtered);
  }, [searchTerm, filterType]);

  const handleSurahClick = (surahNumber: number) => {
    onSurahSelect(surahNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                فهرس السور
              </h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredSurahs.length} سورة
              </Badge>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن السورة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-right"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  size="sm"
                >
                  <Filter className="h-4 w-4 ml-2" />
                  الكل
                </Button>
                <Button
                  variant={filterType === "meccan" ? "default" : "outline"}
                  onClick={() => setFilterType("meccan")}
                  size="sm"
                >
                  مكية
                </Button>
                <Button
                  variant={filterType === "medinan" ? "default" : "outline"}
                  onClick={() => setFilterType("medinan")}
                  size="sm"
                >
                  مدنية
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surahs Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <Card 
              key={surah.number}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/30"
              onClick={() => handleSurahClick(surah.number)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-lg">{surah.number}</span>
                    </div>
                    <div>
                      <CardTitle className="font-serif text-xl text-right">{surah.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{surah.englishName}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={surah.revelationType === "Meccan" ? "default" : "secondary"}>
                      {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {surah.numberOfAyahs} آية
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // يمكن إضافة تشغيل مباشر للسورة
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {surah.englishNameTranslation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو غير المرشح</p>
          </div>
        )}
      </div>
    </div>
  );
}
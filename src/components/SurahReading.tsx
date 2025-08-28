import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AudioPlayer from "@/components/AudioPlayer";
import { 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkPlus,
  Copy,
  Download,
  Maximize,
  Volume2,
  Settings,
  Share2,
  Play,
  Languages,
  Eye,
  EyeOff,
  ChevronDown
} from "lucide-react";
import quranSurahs from "@/data/quran-surahs.json";
import translationsData from "@/data/quran-translations.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SurahReadingProps {
  surahNumber: number;
  onBack: () => void;
}

export default function SurahReading({ surahNumber, onBack }: SurahReadingProps) {
  const [fontSize, setFontSize] = useState(24);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTranslator, setSelectedTranslator] = useState('sahih-international');
  const [showTranslationSettings, setShowTranslationSettings] = useState(false);

  const surah = quranSurahs.find(s => s.number === surahNumber);

  if (!surah) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">السورة غير موجودة</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للفهرس
          </Button>
        </div>
      </div>
    );
  }

  const handleAyahClick = (ayahNumber: number) => {
    setSelectedAyah(selectedAyah === ayahNumber ? null : ayahNumber);
  };

  const toggleBookmark = (ayahNumber: number) => {
    setBookmarkedAyahs(prev => 
      prev.includes(ayahNumber) 
        ? prev.filter(n => n !== ayahNumber)
        : [...prev, ayahNumber]
    );
  };

  const nextSurah = () => {
    if (surahNumber < 114) {
      // Handle navigation to next surah
    }
  };

  const previousSurah = () => {
    if (surahNumber > 1) {
      // Handle navigation to previous surah
    }
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 40));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 16));
  };

  const getTranslation = (ayahNumber: number) => {
    // This is a simplified version - in real app you'd fetch from API
    const sampleTranslations = translationsData.sampleTranslations['1'];
    if (sampleTranslations && sampleTranslations[ayahNumber] && sampleTranslations[ayahNumber][selectedLanguage]) {
      return sampleTranslations[ayahNumber][selectedLanguage][selectedTranslator] || 
             Object.values(sampleTranslations[ayahNumber][selectedLanguage])[0];
    }
    return null;
  };

  const getLanguageDirection = (langCode: string) => {
    const language = translationsData.languages.find(lang => lang.code === langCode);
    return language?.direction || 'ltr';
  };

  const getAvailableTranslators = (langCode: string) => {
    return translationsData.translators[langCode as keyof typeof translationsData.translators] || [];
  };

  // Update selected translator when language changes
  useEffect(() => {
    const translators = getAvailableTranslators(selectedLanguage);
    if (translators.length > 0 && !translators.find(t => t.id === selectedTranslator)) {
      setSelectedTranslator(translators[0].id);
    }
  }, [selectedLanguage, selectedTranslator]);

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة
              </Button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold font-serif text-primary">{surah.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {surah.englishName} • {surah.numberOfAyahs} آية • {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAudioPlayer(!showAudioPlayer)}>
                <Play className="h-4 w-4" />
                استمع
              </Button>
              
              {/* Translation Toggle */}
              <Button 
                variant={showTranslation ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setShowTranslation(!showTranslation)}
              >
                {showTranslation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                ترجمة
              </Button>
              
              {/* Translation Settings */}
              {showTranslation && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTranslationSettings(!showTranslationSettings)}
                >
                  <Languages className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              )}
              
              <Button variant="ghost" size="sm" onClick={decreaseFontSize}>
                <span className="text-lg">أ-</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={increaseFontSize}>
                <span className="text-lg">أ+</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* مشغل الصوت */}
      {showAudioPlayer && (
        <div className="container mx-auto px-4 py-4">
          <AudioPlayer surahNumber={surahNumber} />
        </div>
      )}

      {/* Translation Settings */}
      {showTranslation && showTranslationSettings && (
        <div className="container mx-auto px-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center font-serif flex items-center gap-2 justify-center">
                <Languages className="h-5 w-5" />
                إعدادات الترجمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">اختر اللغة</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {translationsData.languages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{language.arabicName}</span>
                            <span className="text-muted-foreground text-sm">({language.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">اختر المترجم</label>
                  <Select value={selectedTranslator} onValueChange={setSelectedTranslator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTranslators(selectedLanguage).map((translator) => (
                        <SelectItem key={translator.id} value={translator.id}>
                          <div className="text-right">
                            <div className="font-medium">{translator.arabicName}</div>
                            <div className="text-sm text-muted-foreground">{translator.name}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={previousSurah}
            disabled={surahNumber === 1}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            السورة السابقة
          </Button>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            سورة رقم {surahNumber}
          </Badge>
          
          <Button 
            variant="outline" 
            onClick={nextSurah}
            disabled={surahNumber === 114}
            className="flex items-center gap-2"
          >
            السورة التالية
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Surah Content */}
      <div className="container mx-auto px-4 pb-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            {surahNumber !== 1 && surahNumber !== 9 && (
              <div className="mb-6">
                <p 
                  className="font-serif text-primary leading-relaxed"
                  style={{ fontSize: `${fontSize + 4}px` }}
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <Separator className="my-4" />
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {surah.ayahs ? surah.ayahs.map((ayah) => (
                <div 
                  key={ayah.numberInSurah}
                  className={`group relative p-4 rounded-lg transition-colors cursor-pointer ${
                    selectedAyah === ayah.numberInSurah 
                      ? 'bg-primary/10 border-l-4 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleAyahClick(ayah.numberInSurah)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="space-y-3">
                        <p 
                          className="font-serif text-right leading-loose"
                          style={{ fontSize: `${fontSize}px`, fontFamily: "'Amiri', serif" }}
                          dir="rtl"
                        >
                          {ayah.text}
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold mx-2">
                            {ayah.numberInSurah}
                          </span>
                        </p>
                        
                        {/* Translation */}
                        {showTranslation && (
                          <div className="mt-3 pt-3 border-t border-muted/50">
                            {(() => {
                              const translation = getTranslation(ayah.numberInSurah);
                              const direction = getLanguageDirection(selectedLanguage);
                              const selectedLang = translationsData.languages.find(l => l.code === selectedLanguage);
                              const selectedTrans = getAvailableTranslators(selectedLanguage).find(t => t.id === selectedTranslator);
                              
                              return translation ? (
                                <div>
                                  <p 
                                    className={`text-muted-foreground leading-relaxed mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                                    style={{ fontSize: `${Math.max(fontSize - 4, 14)}px` }}
                                    dir={direction}
                                  >
                                    {translation}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                                    <Languages className="h-3 w-3" />
                                    <span>{selectedLang?.arabicName}</span>
                                    <span>•</span>
                                    <span>{selectedTrans?.arabicName}</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-muted-foreground/60 text-sm italic">
                                  الترجمة غير متوفرة لهذه الآية حالياً
                                </p>
                              );
                            })()
                          }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {selectedAyah === ayah.numberInSurah && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Volume2 className="h-4 w-4 ml-2" />
                          استمع
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          const textToCopy = showTranslation 
                            ? `${ayah.text}\n\n${getTranslation(ayah.numberInSurah) || ''}`
                            : ayah.text;
                          navigator.clipboard.writeText(textToCopy);
                        }}>
                          <Copy className="h-4 w-4 ml-2" />
                          نسخ {showTranslation ? '+ الترجمة' : ''}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 ml-2" />
                          مشاركة
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(ayah.numberInSurah)}
                      >
                        {bookmarkedAyahs.includes(ayah.numberInSurah) ? (
                          <Bookmark className="h-4 w-4 ml-2 fill-current" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4 ml-2" />
                        )}
                        {bookmarkedAyahs.includes(ayah.numberInSurah) ? 'محفوظة' : 'حفظ'}
                      </Button>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لم يتم تحميل آيات السورة بعد</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    يمكنك استخدام API خارجي للحصول على النص الكامل
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
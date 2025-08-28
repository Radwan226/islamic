import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Heart, 
  Plus, 
  Calendar,
  User,
  MessageCircle,
  Star,
  Sparkles,
  Send,
  Clock,
  Users,
  BookHeart
} from "lucide-react";

interface DeceasedPerson {
  id: string;
  name: string;
  relationship: string;
  dateAdded: string;
  addedBy: string;
  prayerCount: number;
  message?: string;
}

interface Prayer {
  id: string;
  personId: string;
  prayerText: string;
  prayedBy: string;
  dateTime: string;
}

export default function SadaqaJariya() {
  const [deceasedList, setDeceasedList] = useState<DeceasedPerson[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPrayDialogOpen, setIsPrayDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<DeceasedPerson | null>(null);
  const [newPerson, setNewPerson] = useState({ name: "", relationship: "", message: "" });
  const [prayerText, setPrayerText] = useState("");
  const [userName, setUserName] = useState("مستخدم مجهول");

  // Sample data for demonstration
  useEffect(() => {
    const sampleData: DeceasedPerson[] = [
      {
        id: "1",
        name: "محمد أحمد علي",
        relationship: "والد",
        dateAdded: "2024-08-20",
        addedBy: "أحمد محمد",
        prayerCount: 45,
        message: "رحمه الله، كان رجلاً صالحاً وبراً بوالديه"
      },
      {
        id: "2", 
        name: "فاطمة سعيد",
        relationship: "والدة",
        dateAdded: "2024-08-15",
        addedBy: "سارة سعيد",
        prayerCount: 67,
        message: "رحمها الله، كانت امرأة صالحة وأم حنونة"
      },
      {
        id: "3",
        name: "عبد الله محمود",
        relationship: "جد",
        dateAdded: "2024-08-10",
        addedBy: "محمود عبد الله",
        prayerCount: 23,
        message: "غفر الله له، علمنا حب القرآن والصلاة"
      }
    ];
    
    setDeceasedList(sampleData);
    
    // Load from localStorage if exists
    const saved = localStorage.getItem('sadaqa-jariya-data');
    if (saved) {
      const data = JSON.parse(saved);
      setDeceasedList(data.deceased || sampleData);
      setPrayers(data.prayers || []);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    const data = { deceased: deceasedList, prayers };
    localStorage.setItem('sadaqa-jariya-data', JSON.stringify(data));
  }, [deceasedList, prayers]);

  const handleAddPerson = () => {
    if (!newPerson.name.trim()) return;
    
    const person: DeceasedPerson = {
      id: Date.now().toString(),
      name: newPerson.name,
      relationship: newPerson.relationship,
      dateAdded: new Date().toISOString().split('T')[0],
      addedBy: userName,
      prayerCount: 0,
      message: newPerson.message
    };
    
    setDeceasedList(prev => [person, ...prev]);
    setNewPerson({ name: "", relationship: "", message: "" });
    setIsAddDialogOpen(false);
  };

  const handleAddPrayer = () => {
    if (!selectedPerson || !prayerText.trim()) return;
    
    const prayer: Prayer = {
      id: Date.now().toString(),
      personId: selectedPerson.id,
      prayerText,
      prayedBy: userName,
      dateTime: new Date().toISOString()
    };
    
    setPrayers(prev => [prayer, ...prev]);
    
    // Update prayer count
    setDeceasedList(prev => prev.map(person => 
      person.id === selectedPerson.id 
        ? { ...person, prayerCount: person.prayerCount + 1 }
        : person
    ));
    
    setPrayerText("");
    setIsPrayDialogOpen(false);
  };

  const commonPrayers = [
    "اللهم اغفر له وارحمه وعافه واعف عنه",
    "اللهم أنزله منازل الشهداء والصديقين وحسن أولئك رفيقا",
    "اللهم اجعل قبره روضة من رياض الجنة",
    "اللهم آته في قبره نوراً وفي قيامته أماناً",
    "اللهم أكرم نزله ووسع مدخله واغسله بالماء والثلج والبرد"
  ];

  const getPersonPrayers = (personId: string) => {
    return prayers.filter(p => p.personId === personId).slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('ar', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                الصدقة الجارية
              </h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {deceasedList.length} شخص
              </Badge>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-2">
                "إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: صَدَقَةٌ جَارِيَةٌ، أَوْ عِلْمٌ يُنْتَفَعُ بِهِ، أَوْ وَلَدٌ صَالِحٌ يَدْعُو لَهُ"
              </p>
              <p className="text-sm text-muted-foreground">
                اكتب أسماء أحبائك المتوفين ليدعو لهم جميع زوار الموقع
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
              <CardContent className="text-center p-6">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {deceasedList.length}
                </div>
                <p className="text-green-600 dark:text-green-400">شخص مسجل</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900">
              <CardContent className="text-center p-6">
                <Heart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {prayers.length}
                </div>
                <p className="text-blue-600 dark:text-blue-400">دعاء إجمالي</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
              <CardContent className="text-center p-6">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {deceasedList.reduce((total, person) => total + person.prayerCount, 0)}
                </div>
                <p className="text-purple-600 dark:text-purple-400">دعوة مستجابة بإذن الله</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Person Button */}
          <div className="text-center mb-8">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-5 w-5 ml-2" />
                  إضافة شخص عزيز متوفى
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center font-serif">إضافة شخص عزيز</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                    <Input
                      value={newPerson.name}
                      onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="اكتب الاسم الكامل..."
                      className="text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">صلة القرابة</label>
                    <Input
                      value={newPerson.relationship}
                      onChange={(e) => setNewPerson(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="مثل: والد، والدة، جد، عم..."
                      className="text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رسالة (اختيارية)</label>
                    <Textarea
                      value={newPerson.message}
                      onChange={(e) => setNewPerson(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="اكتب ذكرى طيبة أو صفة حسنة..."
                      className="text-right"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddPerson} className="w-full">
                    <Heart className="h-4 w-4 ml-2" />
                    إضافة للصدقة الجارية
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Deceased List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deceasedList.map((person) => {
              const personPrayers = getPersonPrayers(person.id);
              
              return (
                <Card key={person.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="font-serif text-lg mb-1">{person.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{person.relationship}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="mb-1">
                          {person.prayerCount} دعوة
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(person.dateAdded)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {person.message && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm leading-relaxed">{person.message}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>أضافه:</span>
                      <span>{person.addedBy}</span>
                    </div>
                    
                    {/* Recent Prayers */}
                    {personPrayers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          آخر الدعوات
                        </h4>
                        {personPrayers.map((prayer) => (
                          <div key={prayer.id} className="bg-green-50 dark:bg-green-950/30 p-2 rounded text-xs">
                            <p className="mb-1">{prayer.prayerText}</p>
                            <div className="flex justify-between text-muted-foreground">
                              <span>{prayer.prayedBy}</span>
                              <span>{formatDateTime(prayer.dateTime)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Dialog open={isPrayDialogOpen && selectedPerson?.id === person.id} 
                           onOpenChange={(open) => {
                             setIsPrayDialogOpen(open);
                             if (open) setSelectedPerson(person);
                           }}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Heart className="h-4 w-4 ml-2" />
                          ادع له/لها
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-center font-serif">
                            الدعاء لـ {person.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">اختر دعاء أو اكتب دعاءك</label>
                            <div className="space-y-2 mb-3">
                              {commonPrayers.map((prayer, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  className="w-full text-right h-auto p-3 text-sm"
                                  onClick={() => setPrayerText(prayer)}
                                >
                                  {prayer}
                                </Button>
                              ))}
                            </div>
                            <Textarea
                              value={prayerText}
                              onChange={(e) => setPrayerText(e.target.value)}
                              placeholder="أو اكتب دعاءك الخاص..."
                              className="text-right"
                              rows={3}
                            />
                          </div>
                          <Button onClick={handleAddPrayer} className="w-full bg-green-600 hover:bg-green-700">
                            <Send className="h-4 w-4 ml-2" />
                            إرسال الدعاء
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {deceasedList.length === 0 && (
            <div className="text-center py-12">
              <BookHeart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">لم يتم إضافة أي أسماء بعد</h3>
              <p className="text-muted-foreground mb-4">كن أول من يبدأ بالصدقة الجارية</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول شخص
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
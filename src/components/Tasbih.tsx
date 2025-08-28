import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  History
} from "lucide-react";
import duasData from "@/data/duas-adhkar.json";

export default function Tasbih() {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [targetCount, setTargetCount] = useState(33);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);

  const tasbihOptions = duasData.tasbihOptions.items;
  const currentDhikr = tasbihOptions[selectedDhikr];

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('tasbih-data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setTotalCount(data.totalCount || 0);
      setDailyTotal(data.dailyTotal || 0);
      setCompletedRounds(data.completedRounds || 0);
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage
    const data = {
      totalCount,
      dailyTotal,
      completedRounds
    };
    localStorage.setItem('tasbih-data', JSON.stringify(data));
  }, [totalCount, dailyTotal, completedRounds]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount(prev => prev + 1);
    setDailyTotal(prev => prev + 1);

    // Play sound
    if (isSoundEnabled) {
      playClickSound();
    }

    // Vibrate
    if (isVibrationEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Check if target reached
    if (newCount >= targetCount) {
      setCompletedRounds(prev => prev + 1);
      setCount(0);
      
      if (isSoundEnabled) {
        playCompletionSound();
      }
      
      if (isVibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 100, 100]);
      }
    }
  };

  const playClickSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAVRZ...');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playCompletionSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRtIGAABXQVZFZm10IBAAAAABAAEAVRZ...');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const resetCount = () => {
    setCount(0);
  };

  const resetAll = () => {
    setCount(0);
    setTotalCount(0);
    setDailyTotal(0);
    setCompletedRounds(0);
    localStorage.removeItem('tasbih-data');
  };

  const progress = (count / targetCount) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
              <Sparkles className="h-8 w-8" />
              السبحة الإلكترونية
            </h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              >
                {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-sm flex items-center justify-center gap-2">
                  <Target className="h-4 w-4" />
                  اليوم
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <div className="text-2xl font-bold text-primary">{dailyTotal}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-sm flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  إجمالي
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <div className="text-2xl font-bold text-primary">{totalCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-sm flex items-center justify-center gap-2">
                  <History className="h-4 w-4" />
                  مكتمل
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <div className="text-2xl font-bold text-primary">{completedRounds}</div>
              </CardContent>
            </Card>
          </div>

          {/* Dhikr Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">اختر الذكر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasbihOptions.map((dhikr, index) => (
                  <Button
                    key={dhikr.id}
                    variant={selectedDhikr === index ? "default" : "outline"}
                    onClick={() => {
                      setSelectedDhikr(index);
                      setTargetCount(dhikr.count);
                      setCount(0);
                    }}
                    className="h-auto p-4 text-right"
                  >
                    <div className="w-full">
                      <div className="font-serif text-lg mb-1">{dhikr.text}</div>
                      <div className="text-xs text-muted-foreground">{dhikr.translation}</div>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {dhikr.count} مرة
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Counter */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-primary mb-4">
                {currentDhikr.text}
              </CardTitle>
              <p className="text-muted-foreground text-sm mb-4">
                {currentDhikr.translation}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{count} / {targetCount}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Counter Display */}
              <div className="relative">
                <div className="text-8xl font-bold text-primary mb-4 select-none">
                  {count}
                </div>
                
                {count >= targetCount && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge variant="default" className="text-lg px-6 py-2 animate-bounce">
                      مكتمل! 🎉
                    </Badge>
                  </div>
                )}
              </div>

              {/* Main Button */}
              <Button
                onClick={handleIncrement}
                size="lg"
                className="w-48 h-48 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="text-center">
                  <div>انقر</div>
                  <div className="text-base font-normal">للتسبيح</div>
                </div>
              </Button>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={resetCount}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  إعادة تعيين الجولة
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={resetAll}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  إعادة تعيين الكل
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-primary">نصائح</h3>
                <p className="text-sm text-muted-foreground">
                  يمكنك الضغط على الزر أو النقر في أي مكان على الشاشة للعد
                </p>
                <p className="text-sm text-muted-foreground">
                  استخدم الإعدادات لتخصيص الأصوات والاهتزاز
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
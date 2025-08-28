import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  MapPin, 
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Star,
  Settings,
  Compass
} from "lucide-react";
import prayerData from "@/data/prayer-times.json";

interface PrayerTime {
  name: string;
  time: string;
  icon: any;
  color: string;
}

export default function PrayerTimes() {
  const [selectedCity, setSelectedCity] = useState(prayerData.cities[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [azanEnabled, setAzanEnabled] = useState(true);
  const [selectedAzan, setSelectedAzan] = useState(prayerData.azanAudios[0]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const prayerTimes: PrayerTime[] = [
    { 
      name: "الفجر", 
      time: selectedCity.prayerTimes.fajr, 
      icon: Star, 
      color: "bg-indigo-500" 
    },
    { 
      name: "الشروق", 
      time: selectedCity.prayerTimes.sunrise, 
      icon: Sunrise, 
      color: "bg-orange-400" 
    },
    { 
      name: "الظهر", 
      time: selectedCity.prayerTimes.dhuhr, 
      icon: Sun, 
      color: "bg-yellow-500" 
    },
    { 
      name: "العصر", 
      time: selectedCity.prayerTimes.asr, 
      icon: Sun, 
      color: "bg-amber-500" 
    },
    { 
      name: "المغرب", 
      time: selectedCity.prayerTimes.maghrib, 
      icon: Sunset, 
      color: "bg-orange-600" 
    },
    { 
      name: "العشاء", 
      time: selectedCity.prayerTimes.isha, 
      icon: Moon, 
      color: "bg-purple-600" 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    calculateNextPrayer();
  }, [currentTime, selectedCity]);

  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const calculateNextPrayer = () => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Filter out sunrise as it's not a prayer time
    const actualPrayers = prayerTimes.filter(prayer => prayer.name !== "الشروق");
    
    for (const prayer of actualPrayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTimeInMinutes = hours * 60 + minutes;
      
      if (prayerTimeInMinutes > currentTimeInMinutes) {
        setNextPrayer(prayer);
        calculateCountdown(prayer.time);
        calculateProgress(prayer.time, actualPrayers);
        return;
      }
    }
    
    // If no prayer found today, next prayer is Fajr tomorrow
    const fajrPrayer = actualPrayers[0];
    setNextPrayer(fajrPrayer);
    calculateCountdown(fajrPrayer.time, true);
    calculateProgress(fajrPrayer.time, actualPrayers, true);
  };

  const calculateCountdown = (prayerTime: string, isNextDay = false) => {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date();
    
    if (isNextDay) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    prayerDate.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const diff = prayerDate.getTime() - now.getTime();
    
    if (diff <= 0) return;
    
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeUntilNextPrayer(`${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`);
    
    // Check if it's time for prayer (within 1 minute)
    if (diff <= 60000 && diff > 59000) {
      triggerPrayerNotification();
    }
  };

  const calculateProgress = (nextPrayerTime: string, prayers: PrayerTime[], isNextDay = false) => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Find current and next prayer
    let currentPrayerTime = 0;
    let nextPrayerTimeInMinutes = 0;
    
    const [nextHours, nextMinutes] = nextPrayerTime.split(':').map(Number);
    nextPrayerTimeInMinutes = isNextDay ? (nextHours * 60 + nextMinutes + 24 * 60) : (nextHours * 60 + nextMinutes);
    
    // Find the previous prayer
    for (let i = prayers.length - 1; i >= 0; i--) {
      const [hours, minutes] = prayers[i].time.split(':').map(Number);
      const prayerTimeInMinutes = hours * 60 + minutes;
      
      if (prayerTimeInMinutes <= currentTimeInMinutes) {
        currentPrayerTime = prayerTimeInMinutes;
        break;
      }
    }
    
    if (currentPrayerTime === 0 && !isNextDay) {
      // Before first prayer, use last prayer from yesterday
      const lastPrayer = prayers[prayers.length - 1];
      const [hours, minutes] = lastPrayer.time.split(':').map(Number);
      currentPrayerTime = (hours * 60 + minutes) - (24 * 60);
    }
    
    const totalDuration = nextPrayerTimeInMinutes - currentPrayerTime;
    const elapsed = currentTimeInMinutes - currentPrayerTime;
    const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    
    setProgressPercentage(percentage);
  };

  const triggerPrayerNotification = () => {
    if (notificationsEnabled && nextPrayer) {
      new Notification(`حان وقت صلاة ${nextPrayer.name}`, {
        body: `الوقت الآن ${nextPrayer.time}`,
        icon: '/vite.svg'
      });
    }
    
    if (azanEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleCityChange = (cityId: string) => {
    const city = prayerData.cities.find(c => c.id === cityId);
    if (city) {
      setSelectedCity(city);
    }
  };

  const handleAzanChange = (azanId: string) => {
    const azan = prayerData.azanAudios.find(a => a.id === azanId);
    if (azan) {
      setSelectedAzan(azan);
    }
  };

  const playTestAzan = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('ar', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const getCurrentPrayer = () => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    const actualPrayers = prayerTimes.filter(prayer => prayer.name !== "الشروق");
    
    for (let i = actualPrayers.length - 1; i >= 0; i--) {
      const [hours, minutes] = actualPrayers[i].time.split(':').map(Number);
      const prayerTimeInMinutes = hours * 60 + minutes;
      
      if (prayerTimeInMinutes <= currentTimeInMinutes) {
        return actualPrayers[i];
      }
    }
    
    return null;
  };

  const currentPrayer = getCurrentPrayer();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-serif text-primary flex items-center gap-2">
                <Clock className="h-8 w-8" />
                مواقيت الصلاة
              </h1>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {formatCurrentTime()}
              </Badge>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCity.id} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prayerData.cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        <div className="text-right">
                          <div>{city.name}</div>
                          <div className="text-xs text-muted-foreground">{city.country}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Current Location & Next Prayer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  الموقع الحالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-2">{selectedCity.name}</h2>
                  <p className="text-muted-foreground">{selectedCity.country}</p>
                  {currentPrayer && (
                    <div className="mt-4">
                      <Badge variant="default" className="text-lg px-4 py-2">
                        وقت صلاة {currentPrayer.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className={`${nextPrayer ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900' : ''}`}>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  الصلاة القادمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextPrayer ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <nextPrayer.icon className="h-8 w-8 text-primary ml-3" />
                      <h2 className="text-3xl font-bold text-primary">{nextPrayer.name}</h2>
                    </div>
                    <p className="text-2xl font-mono mb-2">{nextPrayer.time}</p>
                    <p className="text-lg text-muted-foreground mb-4">
                      متبقي: {timeUntilNextPrayer}
                    </p>
                    <Progress value={progressPercentage} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progressPercentage)}% من الوقت انقضى
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>جاري حساب الصلاة القادمة...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prayer Times Grid */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-center">مواقيت الصلاة اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {prayerTimes.map((prayer, index) => {
                  const IconComponent = prayer.icon;
                  const isNext = nextPrayer?.name === prayer.name;
                  const isCurrent = currentPrayer?.name === prayer.name;
                  
                  return (
                    <div 
                      key={index} 
                      className={`text-center p-4 rounded-lg border-2 transition-all duration-300 ${
                        isNext ? 'border-green-500 bg-green-50 dark:bg-green-950' : 
                        isCurrent ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 
                        'border-transparent hover:border-primary/30'
                      }`}
                    >
                      <div className={`${prayer.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{prayer.name}</h3>
                      <p className="text-xl font-mono text-primary">{prayer.time}</p>
                      {isNext && (
                        <Badge variant="default" className="mt-2">قادمة</Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="secondary" className="mt-2">حالياً</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات التنبيهات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="font-medium">الإشعارات</label>
                  <p className="text-sm text-muted-foreground">تلقي إشعارات عند حلول وقت الصلاة</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="font-medium">صوت الأذان</label>
                  <p className="text-sm text-muted-foreground">تشغيل الأذان عند حلول وقت الصلاة</p>
                </div>
                <Switch
                  checked={azanEnabled}
                  onCheckedChange={setAzanEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="font-medium">نوع الأذان</label>
                  <Select value={selectedAzan.id} onValueChange={handleAzanChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prayerData.azanAudios.map((azan) => (
                        <SelectItem key={azan.id} value={azan.id}>
                          {azan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={playTestAzan}>
                    <Volume2 className="h-4 w-4" />
                    تجربة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={selectedAzan.url}
        preload="metadata"
      />
    </div>
  );
}
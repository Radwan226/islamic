import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Download,
  Repeat,
  Shuffle,
  Settings,
  Headphones
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import recitersData from "@/data/quran-reciters.json";

interface AudioPlayerProps {
  surahNumber: number;
  ayahNumber?: number;
  autoPlay?: boolean;
}

export default function AudioPlayer({ surahNumber, ayahNumber, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(recitersData[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);

  const currentReciter = recitersData.find(r => r.id === selectedReciter) || recitersData[0];

  // تحديد رابط الملف الصوتي
  const getAudioUrl = (reciterId: string, surah: number) => {
    const reciter = recitersData.find(r => r.id === reciterId);
    if (!reciter) return '';
    
    const paddedSurah = surah.toString().padStart(3, '0');
    return `${reciter.baseUrl}${paddedSurah}.mp3`;
  };

  const audioUrl = getAudioUrl(selectedReciter, surahNumber);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      playAudio();
    }
  }, [audioUrl, autoPlay]);

  const playAudio = async () => {
    if (!audioRef.current) return;
    
    try {
      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleReciterChange = (reciterId: string) => {
    const wasPlaying = isPlaying;
    pauseAudio();
    setSelectedReciter(reciterId);
    setCurrentTime(0);
    
    // تشغيل تلقائي مع القارئ الجديد إذا كان يشغل من قبل
    if (wasPlaying) {
      setTimeout(() => playAudio(), 500);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (isRepeat) {
      playAudio();
    }
  };

  const skipToNext = () => {
    if (surahNumber < 114) {
      // يمكن إضافة callback للانتقال للسورة التالية
    }
  };

  const skipToPrevious = () => {
    if (surahNumber > 1) {
      // يمكن إضافة callback للانتقال للسورة السابقة
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Headphones className="h-5 w-5 text-primary" />
          <CardTitle className="font-serif text-primary">مشغل القرآن الكريم</CardTitle>
        </div>
        
        {/* اختيار القارئ */}
        <Select value={selectedReciter} onValueChange={handleReciterChange}>
          <SelectTrigger className="w-full max-w-md mx-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {recitersData.map((reciter) => (
              <SelectItem key={reciter.id} value={reciter.id}>
                <div className="text-right">
                  <div className="font-semibold">{reciter.arabicName}</div>
                  <div className="text-sm text-muted-foreground">{reciter.country} • {reciter.style}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="text-center mt-2">
          <Badge variant="secondary" className="text-sm">
            سورة رقم {surahNumber}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* شريط التقدم */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* أزرار التحكم الرئيسية */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipToPrevious}
            disabled={surahNumber === 1}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            size="lg"
            className="w-16 h-16 rounded-full"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 mr-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={skipToNext}
            disabled={surahNumber === 114}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* التحكم في الصوت والإعدادات */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRepeat(!isRepeat)}
              className={isRepeat ? "text-primary" : ""}
            >
              <Repeat className="h-4 w-4" />
            </Button>
            
            <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">×0.5</SelectItem>
                <SelectItem value="0.75">×0.75</SelectItem>
                <SelectItem value="1">×1</SelectItem>
                <SelectItem value="1.25">×1.25</SelectItem>
                <SelectItem value="1.5">×1.5</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" asChild>
              <a href={audioUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* معلومات القارئ */}
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">{currentReciter.description}</p>
        </div>

        {/* مشغل الصوت المخفي */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
      </CardContent>
    </Card>
  );
}
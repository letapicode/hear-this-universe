
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Square, Play, Pause, Save, FileText, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  duration: number;
  audioUrl?: string;
  transcript?: string;
  mood?: string;
}

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: "",
    transcript: "",
    mood: ""
  });
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Morning Reflection",
      date: "2024-01-15",
      duration: 120,
      transcript: "Today I'm feeling grateful for the opportunities ahead...",
      mood: "optimistic"
    },
    {
      id: "2", 
      title: "Evening Thoughts",
      date: "2024-01-14",
      duration: 180,
      transcript: "Reflecting on today's challenges and lessons learned...",
      mood: "thoughtful"
    }
  ]);

  const intervalRef = useRef<NodeJS.Timeout>();

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success("Recording started");
    } catch (error) {
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Mock transcript generation
    setTimeout(() => {
      setCurrentEntry(prev => ({
        ...prev,
        transcript: "This is a mock transcript of your voice recording. The AI would normally transcribe your actual speech here, capturing your thoughts and reflections for this journal entry."
      }));
      toast.success("Recording saved and transcribed");
    }, 1500);
  };

  const saveEntry = () => {
    if (!currentEntry.title?.trim()) {
      toast.error("Please add a title for your entry");
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title,
      date: new Date().toISOString().split('T')[0],
      duration: recordingTime,
      transcript: currentEntry.transcript,
      mood: currentEntry.mood
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry({ title: "", transcript: "", mood: "" });
    setRecordingTime(0);
    toast.success("Journal entry saved");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      optimistic: "bg-green-500/20 text-green-400",
      thoughtful: "bg-blue-500/20 text-blue-400", 
      grateful: "bg-purple-500/20 text-purple-400",
      reflective: "bg-amber-500/20 text-amber-400"
    };
    return colors[mood as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 huly-gradient-text">
            <Mic className="h-5 w-5" />
            Voice Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono text-center">
              {formatTime(recordingTime)}
            </div>
            
            <div className="flex justify-center gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="huly-gradient text-white border-0 px-8 py-6 text-lg"
                >
                  <Mic className="h-6 w-6 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="px-8 py-6 text-lg"
                >
                  <Square className="h-6 w-6 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
            
            {isRecording && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Recording in progress...</span>
              </div>
            )}
          </div>

          {currentEntry.transcript && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Entry Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title..."
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry(prev => ({...prev, title: e.target.value}))}
                    className="huly-glass border-white/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Input
                    id="mood"
                    placeholder="How are you feeling?"
                    value={currentEntry.mood}
                    onChange={(e) => setCurrentEntry(prev => ({...prev, mood: e.target.value}))}
                    className="huly-glass border-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transcript">Transcript</Label>
                <Textarea
                  id="transcript"
                  value={currentEntry.transcript}
                  onChange={(e) => setCurrentEntry(prev => ({...prev, transcript: e.target.value}))}
                  className="min-h-[150px] huly-glass border-white/20"
                  placeholder="Your transcript will appear here..."
                />
              </div>

              <Button onClick={saveEntry} className="w-full huly-gradient text-white border-0">
                <Save className="h-4 w-4 mr-2" />
                Save Journal Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 rounded-lg huly-glass border-white/10 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{entry.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {entry.date}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatTime(entry.duration)}
                  </div>
                  {entry.mood && (
                    <Badge className={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </Badge>
                  )}
                </div>
                
                {entry.transcript && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {entry.transcript}
                  </p>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="border-white/20">
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20">
                    <FileText className="h-4 w-4 mr-1" />
                    View Full
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceJournal;

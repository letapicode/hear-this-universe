import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Music, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Volume2, 
  Zap,
  Sliders,
  AudioWaveform
} from "lucide-react";
import { toast } from "sonner";

interface AudioEffect {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  effects: AudioEffect[];
}

const AudioRemixStudio = () => {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: "1",
      name: "Sample Track 1.mp3",
      url: "",
      duration: 180,
      effects: [
        { id: "reverb", name: "Reverb", value: 0, min: 0, max: 100, step: 1 },
        { id: "echo", name: "Echo", value: 0, min: 0, max: 100, step: 1 },
        { id: "bass", name: "Bass Boost", value: 0, min: -20, max: 20, step: 1 },
        { id: "treble", name: "Treble", value: 0, min: -20, max: 20, step: 1 }
      ]
    }
  ]);
  const [aiPreset, setAIPreset] = useState("");

  const aiPresets = [
    { id: "podcast-enhance", name: "Podcast Enhancement", description: "Optimize for voice clarity" },
    { id: "music-master", name: "Music Mastering", description: "Professional music polish" },
    { id: "ambient-space", name: "Ambient Spaciousness", description: "Add atmospheric depth" },
    { id: "vintage-warmth", name: "Vintage Warmth", description: "Classic analog sound" },
    { id: "modern-crisp", name: "Modern Crisp", description: "Clean digital clarity" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newTrack: AudioTrack = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        duration: 0, // Would be calculated from actual file
        effects: [
          { id: "reverb", name: "Reverb", value: 0, min: 0, max: 100, step: 1 },
          { id: "echo", name: "Echo", value: 0, min: 0, max: 100, step: 1 },
          { id: "bass", name: "Bass Boost", value: 0, min: -20, max: 20, step: 1 },
          { id: "treble", name: "Treble", value: 0, min: -20, max: 20, step: 1 }
        ]
      };
      
      setTracks(prev => [...prev, newTrack]);
      setSelectedTrack(newTrack);
      toast.success("Audio file uploaded successfully");
    }
  };

  const updateEffect = (effectId: string, value: number) => {
    if (!selectedTrack) return;
    
    const updatedTrack = {
      ...selectedTrack,
      effects: selectedTrack.effects.map(effect =>
        effect.id === effectId ? { ...effect, value } : effect
      )
    };
    
    setSelectedTrack(updatedTrack);
    setTracks(prev => prev.map(track =>
      track.id === selectedTrack.id ? updatedTrack : track
    ));
  };

  const applyAIPreset = () => {
    if (!selectedTrack || !aiPreset) return;
    
    const presetEffects = {
      "podcast-enhance": { reverb: 15, echo: 5, bass: 3, treble: 8 },
      "music-master": { reverb: 25, echo: 10, bass: 5, treble: 5 },
      "ambient-space": { reverb: 60, echo: 40, bass: -2, treble: 2 },
      "vintage-warmth": { reverb: 35, echo: 20, bass: 8, treble: -3 },
      "modern-crisp": { reverb: 10, echo: 0, bass: 0, treble: 12 }
    };
    
    const preset = presetEffects[aiPreset as keyof typeof presetEffects];
    if (preset) {
      const updatedTrack = {
        ...selectedTrack,
        effects: selectedTrack.effects.map(effect => ({
          ...effect,
          value: preset[effect.id as keyof typeof preset] || effect.value
        }))
      };
      
      setSelectedTrack(updatedTrack);
      setTracks(prev => prev.map(track =>
        track.id === selectedTrack.id ? updatedTrack : track
      ));
      
      toast.success(`Applied ${aiPresets.find(p => p.id === aiPreset)?.name} preset`);
    }
  };

  const resetEffects = () => {
    if (!selectedTrack) return;
    
    const resetTrack = {
      ...selectedTrack,
      effects: selectedTrack.effects.map(effect => ({ ...effect, value: 0 }))
    };
    
    setSelectedTrack(resetTrack);
    setTracks(prev => prev.map(track =>
      track.id === selectedTrack.id ? resetTrack : track
    ));
    
    toast.success("All effects reset");
  };

  const exportTrack = () => {
    if (!selectedTrack) return;
    toast.success("Track exported successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Upload and Track Selection */}
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 huly-gradient-text">
            <Music className="h-5 w-5" />
            Audio Remix Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="audio-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Upload Audio File</p>
                  <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
                </div>
              </Label>
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {tracks.length > 0 && (
            <div className="space-y-2">
              <Label>Select Track</Label>
              <div className="grid grid-cols-1 gap-2">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTrack?.id === track.id
                        ? "huly-gradient text-white"
                        : "huly-glass border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{track.name}</span>
                      <Badge variant="secondary">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTrack && (
        <>
          {/* AI Presets */}
          <Card className="huly-glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Enhancement Presets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Choose AI Preset</Label>
                  <Select value={aiPreset} onValueChange={setAIPreset}>
                    <SelectTrigger className="huly-glass border-white/20">
                      <SelectValue placeholder="Select a preset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {aiPresets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          <div>
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-muted-foreground">{preset.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={applyAIPreset}
                    disabled={!aiPreset}
                    className="w-full huly-gradient text-white border-0"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Apply AI Preset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Effects Control */}
          <Card className="huly-glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Manual Effects Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTrack.effects.map((effect) => (
                <div key={effect.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">{effect.name}</Label>
                    <Badge variant="outline" className="min-w-[60px] text-center">
                      {effect.value > 0 && effect.id !== 'bass' && effect.id !== 'treble' ? '+' : ''}{effect.value}
                      {(effect.id === 'bass' || effect.id === 'treble') ? 'dB' : '%'}
                    </Badge>
                  </div>
                  <Slider
                    value={[effect.value]}
                    onValueChange={(value) => updateEffect(effect.id, value[0])}
                    min={effect.min}
                    max={effect.max}
                    step={effect.step}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" onClick={resetEffects} className="border-white/20">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
                
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                  className="border-white/20"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </>
                  )}
                </Button>
                
                <Button onClick={exportTrack} className="huly-gradient text-white border-0">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audio Waveform Visualization */}
          <Card className="huly-glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AudioWaveform className="h-5 w-5" />
                Audio Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-black/20 rounded-lg flex items-center justify-center border border-white/10">
                <div className="flex items-end gap-1 h-16">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-blue-500 to-purple-500 w-2 opacity-60 animate-pulse"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Real-time audio waveform visualization
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AudioRemixStudio;

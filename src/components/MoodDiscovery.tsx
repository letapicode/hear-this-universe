
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Target, Zap, Heart, Coffee, Moon, Music } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MoodDiscoveryProps {
  onContentSelect: (content: any) => void;
}

const MoodDiscovery = ({ onContentSelect }: MoodDiscoveryProps) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");

  const moods = [
    { id: 'energetic', label: 'Energetic', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-500' },
    { id: 'calm', label: 'Calm', icon: <Heart className="h-4 w-4" />, color: 'bg-blue-500' },
    { id: 'focused', label: 'Focused', icon: <Target className="h-4 w-4" />, color: 'bg-green-500' },
    { id: 'creative', label: 'Creative', icon: <Sparkles className="h-4 w-4" />, color: 'bg-purple-500' },
    { id: 'relaxed', label: 'Relaxed', icon: <Moon className="h-4 w-4" />, color: 'bg-indigo-500' }
  ];

  const activities = [
    { id: 'working', label: 'Working', icon: <Coffee className="h-4 w-4" /> },
    { id: 'exercising', label: 'Exercising', icon: <Zap className="h-4 w-4" /> },
    { id: 'commuting', label: 'Commuting', icon: <Music className="h-4 w-4" /> },
    { id: 'relaxing', label: 'Relaxing', icon: <Moon className="h-4 w-4" /> }
  ];

  const generateRecommendations = useMutation({
    mutationFn: async ({ mood, activity }: { mood: string; activity: string }) => {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          mood,
          activity,
          preferences: {},
          context: {
            timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("AI recommendations generated!");
    },
    onError: (error) => {
      console.error('Recommendation error:', error);
      toast.error("Failed to generate recommendations");
    }
  });

  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['ai-recommendations', selectedMood, selectedActivity],
    queryFn: async () => {
      if (!selectedMood || !selectedActivity) return [];
      
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select(`
          *,
          series:series_id(*)
        `)
        .eq('recommendation_type', selectedMood === 'focused' ? 'productivity' : 'mood')
        .order('confidence_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedMood && !!selectedActivity
  });

  const handleGenerateRecommendations = () => {
    if (!selectedMood || !selectedActivity) {
      toast.error("Please select both mood and activity");
      return;
    }

    generateRecommendations.mutate({ mood: selectedMood, activity: selectedActivity });
  };

  return (
    <div className="space-y-6">
      <Card className="huly-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 huly-gradient-text">
            <Brain className="h-5 w-5" />
            AI-Powered Discovery
          </CardTitle>
          <p className="text-muted-foreground">
            Tell us your mood and activity, and our AI will find perfect content for you
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">How are you feeling?</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`${
                    selectedMood === mood.id 
                      ? 'huly-gradient text-white border-0' 
                      : 'huly-glass border-white/20 text-foreground hover:bg-white/10'
                  } transition-all duration-200`}
                >
                  {mood.icon}
                  <span className="ml-2">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Activity Selection */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">What are you doing?</h3>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <Button
                  key={activity.id}
                  variant={selectedActivity === activity.id ? "default" : "outline"}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`${
                    selectedActivity === activity.id 
                      ? 'huly-gradient text-white border-0' 
                      : 'huly-glass border-white/20 text-foreground hover:bg-white/10'
                  } transition-all duration-200`}
                >
                  {activity.icon}
                  <span className="ml-2">{activity.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateRecommendations}
            disabled={!selectedMood || !selectedActivity || generateRecommendations.isPending}
            className="w-full huly-gradient text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-200 border-0"
          >
            {generateRecommendations.isPending ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                AI is thinking...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations Display */}
      {recommendations && recommendations.length > 0 && (
        <Card className="huly-glass border-white/10">
          <CardHeader>
            <CardTitle className="huly-gradient-text">Your AI Recommendations</CardTitle>
            <p className="text-muted-foreground">
              Curated for your {selectedMood} mood while {selectedActivity}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec: any) => (
                <div
                  key={rec.id}
                  className="p-4 huly-glass border-white/5 rounded-lg hover:huly-shadow-hover transition-all duration-300 cursor-pointer"
                  onClick={() => onContentSelect(rec.series)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">
                      {rec.series?.title || 'Recommended Content'}
                    </h4>
                    <Badge variant="secondary" className="huly-glass border-white/10">
                      {Math.round(rec.confidence_score * 100)}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {rec.series?.author || 'Various Authors'}
                  </p>
                  <p className="text-sm text-foreground/80 italic">
                    "{rec.reasoning}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodDiscovery;

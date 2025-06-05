
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Sparkles, Clock, BookOpen } from "lucide-react";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AIInsightsDashboard = () => {
  const { data: recommendations } = useAIRecommendations();

  const { data: moodSessions } = useQuery({
    queryKey: ['mood-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: listeningProgress } = useQuery({
    queryKey: ['listening-progress-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listening_progress')
        .select('*')
        .order('last_listened_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate insights
  const totalRecommendations = recommendations?.length || 0;
  const clickedRecommendations = recommendations?.filter(r => r.clicked).length || 0;
  const accuracyRate = totalRecommendations > 0 ? (clickedRecommendations / totalRecommendations) * 100 : 0;

  const recentMoods = moodSessions?.slice(0, 5).map(s => s.mood) || [];
  const moodCounts = recentMoods.reduce((acc: any, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const dominantMood = Object.entries(moodCounts).sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'balanced';

  const totalListeningTime = listeningProgress?.reduce((sum, progress) => sum + (progress.session_duration || 0), 0) || 0;
  const completedContent = listeningProgress?.filter(p => p.completed).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Accuracy Card */}
      <Card className="huly-glass border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">AI Recommendation Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-foreground">{accuracyRate.toFixed(1)}%</div>
              <Progress value={accuracyRate} className="mt-2" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {clickedRecommendations} of {totalRecommendations} recommendations followed
          </p>
        </CardContent>
      </Card>

      {/* Mood Insights Card */}
      <Card className="huly-glass border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Recent Mood Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-foreground capitalize">{dominantMood}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(moodCounts).slice(0, 3).map(([mood, count]: any) => (
                  <Badge key={mood} variant="secondary" className="text-xs huly-glass border-white/10">
                    {mood} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your most common mood lately
          </p>
        </CardContent>
      </Card>

      {/* Learning Progress Card */}
      <Card className="huly-glass border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-green-400" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-foreground">{completedContent}</div>
              <div className="text-sm text-muted-foreground">Content completed</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Keep up the great progress!
          </p>
        </CardContent>
      </Card>

      {/* Listening Time Card */}
      <Card className="huly-glass border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Listening Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-400" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(totalListeningTime / 60)}h
              </div>
              <div className="text-sm text-muted-foreground">This month</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(totalListeningTime / 60 / 30)} hours per day average
          </p>
        </CardContent>
      </Card>

      {/* Recommendation Trends */}
      <Card className="huly-glass border-white/10 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            AI Recommendation Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations?.slice(0, 3).map((rec: any) => (
              <div key={rec.id} className="flex items-center justify-between p-3 huly-glass border-white/5 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">
                    {rec.series?.title || 'Recommended Content'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {rec.recommendation_type} • {Math.round(rec.confidence_score * 100)}% confidence
                  </div>
                </div>
                <Badge 
                  variant={rec.clicked ? "default" : rec.dismissed ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {rec.clicked ? "Followed" : rec.dismissed ? "Dismissed" : "Pending"}
                </Badge>
              </div>
            ))}
            {(!recommendations || recommendations.length === 0) && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Start using AI recommendations to see insights here
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsDashboard;

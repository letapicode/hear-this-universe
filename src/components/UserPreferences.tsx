
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Brain, Plus, X } from "lucide-react";
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/useAIRecommendations";

const UserPreferences = () => {
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();

  const [listeningGoals, setListeningGoals] = useState(preferences?.listening_goals || "");
  const [preferredGenres, setPreferredGenres] = useState<string[]>(preferences?.preferred_genres || []);
  const [preferredAuthors, setPreferredAuthors] = useState<string[]>(preferences?.preferred_authors || []);
  const [newGenre, setNewGenre] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const handleAddGenre = () => {
    if (newGenre.trim() && !preferredGenres.includes(newGenre.trim())) {
      setPreferredGenres([...preferredGenres, newGenre.trim()]);
      setNewGenre("");
    }
  };

  const handleAddAuthor = () => {
    if (newAuthor.trim() && !preferredAuthors.includes(newAuthor.trim())) {
      setPreferredAuthors([...preferredAuthors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setPreferredGenres(preferredGenres.filter(g => g !== genre));
  };

  const handleRemoveAuthor = (author: string) => {
    setPreferredAuthors(preferredAuthors.filter(a => a !== author));
  };

  const handleSavePreferences = () => {
    updatePreferences.mutate({
      listening_goals: listeningGoals,
      preferred_genres: preferredGenres,
      preferred_authors: preferredAuthors,
      ai_recommendation_settings: {
        personalizedRecommendations: true,
        moodBasedSuggestions: true,
        learningPathRecommendations: true
      }
    });
  };

  return (
    <Card className="huly-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 huly-gradient-text">
          <Settings className="h-5 w-5" />
          AI Recommendation Preferences
        </CardTitle>
        <p className="text-muted-foreground">
          Help our AI understand your preferences for better recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Listening Goals */}
        <div>
          <Label htmlFor="goals" className="text-foreground font-medium">
            What are your listening goals?
          </Label>
          <Textarea
            id="goals"
            value={listeningGoals}
            onChange={(e) => setListeningGoals(e.target.value)}
            placeholder="e.g., Learn new skills, stay entertained during commute, improve focus while working..."
            className="mt-2 huly-glass border-white/20 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50"
            rows={3}
          />
        </div>

        {/* Preferred Genres */}
        <div>
          <Label className="text-foreground font-medium">Preferred Genres</Label>
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Add a genre..."
                className="huly-glass border-white/20 text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && handleAddGenre()}
              />
              <Button
                onClick={handleAddGenre}
                variant="outline"
                className="huly-glass border-white/20 text-foreground hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferredGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="huly-glass border-white/10 text-foreground hover:bg-red-500/20 cursor-pointer transition-colors"
                  onClick={() => handleRemoveGenre(genre)}
                >
                  {genre}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Preferred Authors */}
        <div>
          <Label className="text-foreground font-medium">Preferred Authors</Label>
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <Input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Add an author..."
                className="huly-glass border-white/20 text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAuthor()}
              />
              <Button
                onClick={handleAddAuthor}
                variant="outline"
                className="huly-glass border-white/20 text-foreground hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferredAuthors.map((author) => (
                <Badge
                  key={author}
                  variant="secondary"
                  className="huly-glass border-white/10 text-foreground hover:bg-red-500/20 cursor-pointer transition-colors"
                  onClick={() => handleRemoveAuthor(author)}
                >
                  {author}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* AI Settings Info */}
        <div className="p-4 huly-glass border-white/5 rounded-lg">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Features Enabled
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>✓ Personalized content recommendations</div>
            <div>✓ Mood-based suggestions</div>
            <div>✓ Learning path recommendations</div>
            <div>✓ Smart playlist generation</div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSavePreferences}
          disabled={updatePreferences.isPending}
          className="w-full huly-gradient text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-200 border-0"
        >
          {updatePreferences.isPending ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-pulse" />
              Saving Preferences...
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Save AI Preferences
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;

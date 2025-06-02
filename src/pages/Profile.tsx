
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";
import { useUserDownloads } from "@/hooks/useDownloads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, Trophy, TrendingUp, User, Edit3 } from "lucide-react";
import Header from "@/components/Header";
import LuxuryParticles from "@/components/LuxuryParticles";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useUserProfile();
  const { data: downloads = [] } = useUserDownloads();
  const updateProfile = useUpdateUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    favorite_genre: profile?.favorite_genre || ''
  });

  const handleSave = async () => {
    await updateProfile.mutateAsync(editData);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <LuxuryParticles />
      
      <Header 
        user={user}
        searchQuery=""
        onSearchChange={() => {}}
        onSignOut={handleSignOut}
      />

      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="glass-morphism border-white/20 col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="luxury-gradient text-white text-2xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Display Name"
                    value={editData.display_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="glass-morphism border-white/20"
                  />
                  <Textarea
                    placeholder="Bio"
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="glass-morphism border-white/20"
                  />
                  <Input
                    placeholder="Favorite Genre"
                    value={editData.favorite_genre}
                    onChange={(e) => setEditData(prev => ({ ...prev, favorite_genre: e.target.value }))}
                    className="glass-morphism border-white/20"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="luxury-button flex-1">
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="glass-morphism border-white/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <CardTitle className="text-white text-xl">
                    {profile?.display_name || user?.email}
                  </CardTitle>
                  {profile?.bio && (
                    <p className="text-gray-300 text-sm">{profile.bio}</p>
                  )}
                  {profile?.favorite_genre && (
                    <Badge className="luxury-gradient">{profile.favorite_genre}</Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="glass-morphism border-white/20 mt-4"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <Card className="glass-morphism border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="luxury-gradient p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {formatTime(profile?.total_listening_time || 0)}
                    </p>
                    <p className="text-gray-400">Total Listening Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="luxury-gradient p-3 rounded-xl">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {profile?.books_completed || 0}
                    </p>
                    <p className="text-gray-400">Books Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="luxury-gradient p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {profile?.current_streak || 0}
                    </p>
                    <p className="text-gray-400">Current Streak (days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="luxury-gradient p-3 rounded-xl">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {downloads.length}
                    </p>
                    <p className="text-gray-400">Downloaded Episodes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Downloads Section */}
        {downloads.length > 0 && (
          <Card className="glass-morphism border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Downloaded Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloads.map((download: any) => (
                  <div key={download.id} className="glass-morphism p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">
                          {download.series?.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          Episode {download.episodes?.episode_number}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Downloaded {new Date(download.downloaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;

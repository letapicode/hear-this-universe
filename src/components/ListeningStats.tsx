
import { TrendingUp, Clock, BookOpen, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListeningHistory } from "@/hooks/useListeningHistory";

const ListeningStats = () => {
  const { getSessionStats } = useListeningHistory();
  const stats = getSessionStats();

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const statCards = [
    {
      title: "Total Listening Time",
      value: formatDuration(stats.totalListeningTime),
      icon: Clock,
      color: "text-blue-400"
    },
    {
      title: "Books Completed",
      value: stats.completedBooks.toString(),
      icon: BookOpen,
      color: "text-green-400"
    },
    {
      title: "Total Sessions",
      value: stats.totalSessions.toString(),
      icon: TrendingUp,
      color: "text-purple-400"
    },
    {
      title: "Avg Session Time",
      value: formatDuration(stats.averageSessionTime),
      icon: Award,
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="glass-morphism border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center">
              <stat.icon className={`h-4 w-4 mr-2 ${stat.color}`} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListeningStats;

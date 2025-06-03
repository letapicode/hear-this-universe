
import RecentlyPlayed from "@/components/RecentlyPlayed";
import ListeningStats from "@/components/ListeningStats";

interface StatsSectionProps {
  onPlay: (content: any) => void;
}

const StatsSection = ({ onPlay }: StatsSectionProps) => {
  return (
    <>
      {/* Listening Stats */}
      <section className="container mx-auto px-8 mb-12">
        <ListeningStats />
      </section>

      {/* Recently Played */}
      <section className="container mx-auto px-8 mb-12">
        <RecentlyPlayed onPlay={onPlay} />
      </section>
    </>
  );
};

export default StatsSection;

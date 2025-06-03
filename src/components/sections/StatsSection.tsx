
import RecentlyPlayed from "@/components/RecentlyPlayed";
import ListeningStats from "@/components/ListeningStats";

interface StatsSectionProps {
  onPlay: (content: any) => void;
}

const StatsSection = ({ onPlay }: StatsSectionProps) => {
  return (
    <>
      {/* Listening Stats */}
      <section className="huly-section pb-8">
        <div className="huly-container">
          <ListeningStats />
        </div>
      </section>

      {/* Recently Played */}
      <section className="huly-section pb-8">
        <div className="huly-container">
          <RecentlyPlayed onPlay={onPlay} />
        </div>
      </section>
    </>
  );
};

export default StatsSection;

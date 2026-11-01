import { useApiData } from '../api/useApiData.js';
import { CapabilityCard } from './CapabilityCard.js';

type Entry = { teamName: string; totalPoints: number; rank: number };

export default function Leaderboard() {
  const state = useApiData<{ leaderboard: Entry[] }>('/api/leaderboard');
  const items = state.status === 'success' ? state.data.leaderboard : [];
  return (
    <CapabilityCard title="Leaderboard" description="Compare team point totals." status={state.status === 'success' && !items.length ? 'empty' : state.status} emptyText="No leaderboard scores yet.">
      <ol className="list-group list-group-numbered">
        {items.map((entry) => (
          <li key={entry.rank} className="list-group-item">{entry.teamName}: {entry.totalPoints} points</li>
        ))}
      </ol>
    </CapabilityCard>
  );
}

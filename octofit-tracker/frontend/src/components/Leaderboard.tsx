import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Entry = { teamName: string; totalPoints: number; rank: number };

export default function Leaderboard() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [items, setItems] = useState<Entry[]>([]);

  useEffect(() => {
    let active = true;
    getJson<{ leaderboard: Entry[] }>('/api/leaderboard').then(
      (data) => { if (active) { setItems(data.leaderboard); setStatus('success'); } },
      () => { if (active) setStatus('error'); },
    );
    return () => { active = false; };
  }, []);

  return (
    <CapabilityCard title="Leaderboard" description="Compare team point totals." status={status === 'success' && !items.length ? 'empty' : status} emptyText="No leaderboard scores yet.">
      <ol className="list-group list-group-numbered">
        {items.map((entry) => (
          <li key={entry.rank} className="list-group-item">{entry.teamName}: {entry.totalPoints} points</li>
        ))}
      </ol>
    </CapabilityCard>
  );
}

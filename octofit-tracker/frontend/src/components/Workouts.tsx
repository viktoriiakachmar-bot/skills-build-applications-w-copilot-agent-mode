import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Suggestion = { title: string; reason: string };

// Authentication is out of scope, so suggestions use the seeded demo user.
const demoUserEmail = 'mona@example.com';

export default function Workouts() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    let active = true;
    getJson<{ suggestions: Suggestion[] }>(`/api/workouts/suggestions/${encodeURIComponent(demoUserEmail)}`).then(
      (data) => { if (active) { setItems(data.suggestions); setStatus('success'); } },
      () => { if (active) setStatus('error'); },
    );
    return () => { active = false; };
  }, []);

  return (
    <CapabilityCard title="Workout suggestions" description="Recommend workouts from activity patterns." status={status === 'success' && !items.length ? 'empty' : status} emptyText="No workout suggestions yet.">
      <ul className="list-group">
        {items.map((suggestion, index) => (
          <li key={index} className="list-group-item">{suggestion.title} – {suggestion.reason}</li>
        ))}
      </ul>
    </CapabilityCard>
  );
}

import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Activity = { type: string; minutes: number; points: number };

export default function Activities() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [items, setItems] = useState<Activity[]>([]);

  useEffect(() => {
    let active = true;
    getJson<{ activities: Activity[] }>('/api/activities').then(
      (data) => { if (active) { setItems(data.activities); setStatus('success'); } },
      () => { if (active) setStatus('error'); },
    );
    return () => { active = false; };
  }, []);

  return (
    <CapabilityCard title="Activities" description="Track student activity minutes and points." status={status === 'success' && !items.length ? 'empty' : status} emptyText="No activities logged yet.">
      <ul className="list-group">
        {items.map((activity, index) => (
          <li key={index} className="list-group-item">{activity.type}: {activity.minutes} min, {activity.points} points</li>
        ))}
      </ul>
    </CapabilityCard>
  );
}

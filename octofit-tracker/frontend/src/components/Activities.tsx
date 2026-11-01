import { useApiData } from '../api/useApiData.js';
import { CapabilityCard } from './CapabilityCard.js';

type Activity = { type: string; minutes: number; points: number };

export default function Activities() {
  const state = useApiData<{ activities: Activity[] }>('/api/activities');
  const items = state.status === 'success' ? state.data.activities : [];
  return (
    <CapabilityCard title="Activities" description="Track student activity minutes and points." status={state.status === 'success' && !items.length ? 'empty' : state.status} emptyText="No activities logged yet.">
      <ul className="list-group">
        {items.map((activity, index) => (
          <li key={index} className="list-group-item">{activity.type}: {activity.minutes} min, {activity.points} points</li>
        ))}
      </ul>
    </CapabilityCard>
  );
}

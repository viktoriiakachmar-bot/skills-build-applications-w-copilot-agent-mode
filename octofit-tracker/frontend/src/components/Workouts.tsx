import { useApiData } from '../api/useApiData.js';
import { CapabilityCard } from './CapabilityCard.js';

type Suggestion = { title: string; reason: string };

// Authentication is out of scope, so suggestions use the seeded demo user.
const demoUserEmail = 'mona@example.com';

export default function Workouts() {
  const state = useApiData<{ suggestions: Suggestion[] }>(`/api/workouts/suggestions/${encodeURIComponent(demoUserEmail)}`);
  const items = state.status === 'success' ? state.data.suggestions : [];
  return (
    <CapabilityCard title="Workout suggestions" description="Recommend workouts from activity patterns." status={state.status === 'success' && !items.length ? 'empty' : state.status} emptyText="No workout suggestions yet.">
      <ul className="list-group">
        {items.map((suggestion, index) => (
          <li key={index} className="list-group-item">{suggestion.title} – {suggestion.reason}</li>
        ))}
      </ul>
    </CapabilityCard>
  );
}

import { useApiData } from '../api/useApiData.js';
import { CapabilityCard } from './CapabilityCard.js';

type Team = { name: string; mascot?: string; members: string[] };

export default function Teams() {
  const state = useApiData<{ teams: Team[] }>('/api/teams');
  const items = state.status === 'success' ? state.data.teams : [];
  return (
    <CapabilityCard title="Teams" description="Manage teams and members." status={state.status === 'success' && !items.length ? 'empty' : state.status} emptyText="No teams created yet.">
      <ul className="list-group">
        {items.map((team, index) => (
          <li key={index} className="list-group-item">{team.name} ({team.members.length} members)</li>
        ))}
      </ul>
    </CapabilityCard>
  );
}

import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Team = { name: string; mascot?: string; members: string[] };

export default function Teams() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [items, setItems] = useState<Team[]>([]);

  useEffect(() => {
    let active = true;
    getJson<{ teams: Team[] }>('/api/teams').then(
      (data) => { if (active) { setItems(data.teams); setStatus('success'); } },
      () => { if (active) setStatus('error'); },
    );
    return () => { active = false; };
  }, []);

  return (
    <CapabilityCard title="Teams" description="Manage teams and members." status={status === 'success' && !items.length ? 'empty' : status} emptyText="No teams created yet.">
      <ul className="list-group">
        {items.map((team, index) => (
          <li key={index} className="list-group-item">{team.name} ({team.members.length} members)</li>
        ))}
      </ul>
    </CapabilityCard>
  );
}

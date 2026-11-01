import type { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  status: 'loading' | 'error' | 'empty' | 'success';
  emptyText: string;
  children?: ReactNode;
};

export function CapabilityCard({ title, description, status, emptyText, children }: Props) {
  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {status === 'loading' && <p role="status">Loading {title.toLowerCase()}…</p>}
        {status === 'error' && <p role="alert" className="text-danger">Unable to load {title.toLowerCase()}. Please try again.</p>}
        {status === 'empty' && <p>{emptyText}</p>}
        {status === 'success' && children}
      </div>
    </section>
  );
}

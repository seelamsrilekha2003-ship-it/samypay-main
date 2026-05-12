import React from "react";

export default function StatCard({ title, value, icon }) {
	return (
		<div style={{ background: '#fff', padding: 14, borderRadius: 8, boxShadow: '0 6px 18px rgba(2,6,23,0.06)'}}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<div style={{ fontSize: 22 }}>{icon}</div>
				<div>
					<div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
					<div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
				</div>
			</div>
		</div>
	);
}

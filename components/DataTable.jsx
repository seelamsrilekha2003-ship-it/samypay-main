import React from "react";

export default function DataTable({ columns = [], rows = [] }) {
	return (
		<div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8 }}>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr>
						{columns.map((c, i) => (
							<th key={i} style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eef2f6' }}>{c}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 ? (
						<tr><td colSpan={columns.length} style={{ padding: 24, textAlign: 'center' }}>No records</td></tr>
					) : (
						rows.map((r, idx) => (
							<tr key={idx}>{columns.map((c, i) => <td key={i} style={{ padding: 10, borderBottom: '1px solid #f3f6fb' }}>{r[c] ?? ''}</td>)}</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

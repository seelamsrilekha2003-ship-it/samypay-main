import React from "react";

export default function Loader() {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
			<div style={{ width: 28, height: 28, borderRadius: 14, border: '4px solid #e6eefb', borderTopColor: '#0b58d6', animation: 'spin 1s linear infinite' }} />
			<style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
		</div>
	);
}

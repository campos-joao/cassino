import Link from "next/link";

const sports = [
  { name: "Futebol", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" /><circle cx="12" cy="12" r="4" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "E-Sport Futebol", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#aaa" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Tênis", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#aaa" strokeWidth="2" /><ellipse cx="12" cy="12" rx="4" ry="2" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Counter-Strike 2", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" stroke="#aaa" strokeWidth="2" /><path d="M12 8v8" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Vôlei", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" /><path d="M4 12a8 8 0 0 1 16 0" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Basquete", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" /><path d="M2 12h20" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Fórmula", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="4" rx="2" stroke="#aaa" strokeWidth="2" /><circle cx="8" cy="18" r="2" stroke="#aaa" strokeWidth="2" /><circle cx="16" cy="18" r="2" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Tênis de Mesa", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="12" r="4" stroke="#aaa" strokeWidth="2" /><rect x="14" y="10" width="6" height="4" rx="2" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "E-Sport Basquete", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#aaa" strokeWidth="2" /><path d="M12 8v8" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "League of Legends", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Dota 2", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#aaa" strokeWidth="2" /><path d="M8 8l8 8" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Valorant", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" stroke="#aaa" strokeWidth="2" /><path d="M6 12h12" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Beisebol", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" /><path d="M6 6l12 12" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Futsal", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "MMA", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="2" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Dardos", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" /><circle cx="12" cy="12" r="2" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Futebol Americano", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#aaa" strokeWidth="2" /><path d="M4 12a8 8 0 0 1 16 0" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Boxe", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="2" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
  { name: "Ciclismo", icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="16" r="3" stroke="#aaa" strokeWidth="2" /><circle cx="16" cy="16" r="3" stroke="#aaa" strokeWidth="2" /><path d="M8 16h8" stroke="#aaa" strokeWidth="2" /></svg>
  ) },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-white shadow-lg flex flex-col px-3 pt-8 gap-2 border-r border-gray-200 text-gray-700 fixed left-0 top-0 z-20">
      <h2 className="text-xs font-bold mb-4 text-red-600 tracking-widest ml-2">ESPORTES</h2>
      <nav className="flex flex-col gap-1">
        {sports.map((sport) => (
          <button key={sport.name} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-semibold text-gray-600">
            <span>{sport.icon}</span>
            <span>{sport.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

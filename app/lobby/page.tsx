import React from "react";
import Link from "next/link";

const games = [
  {
    name: "Roleta",
    description: "Jogue roleta clássica!",
    image: "/games/roleta.jpg",
    href: "/games/roleta"
  },
  {
    name: "Slots",
    description: "Tente a sorte nas slots!",
    image: "/games/slots.jpg",
    href: "/games/slots"
  }
];

export default function LobbyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Lobby de Jogos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {games.map((game) => (
          <Link href={game.href} key={game.name} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center hover:bg-gray-700 transition-colors">
            <img src={game.image} alt={game.name} className="w-40 h-40 object-cover rounded mb-4" />
            <h2 className="text-xl font-bold mb-2">{game.name}</h2>
            <p className="text-gray-300 text-center">{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

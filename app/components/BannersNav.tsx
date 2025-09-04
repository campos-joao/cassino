import React from "react";

const banners = [
  {
    image: "/banners/banner1.jpg",
    alt: "Cashback da madrugada",
    label: "Saiba mais!"
  },
  {
    image: "/banners/banner2.jpg",
    alt: "R$200K em prêmios",
    label: "Saiba mais!"
  }
];

const navItems = [
  { label: "SuperSpin", badge: "GRÁTIS" },
  { label: "Promoções", badge: "" },
  { label: "SuperSets", badge: "GRÁTIS" },
  { label: "Especial Vôlei", badge: "NOVO" },
  { label: "Aviator", badge: "" },
  { label: "Superbet Blackjack", badge: "NOVO" },
  { label: "Super Placar", badge: "" },
  { label: "Roleta Brasileira", badge: "" },
  { label: "Fortune Tiger", badge: "" }
];

export default function BannersNav() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Banners */}
      <div className="flex gap-4 w-full overflow-x-auto pb-2">
        {banners.map((banner, idx) => (
          <div key={idx} className="rounded-lg overflow-hidden shadow min-w-[320px] max-w-[400px] h-[110px] bg-gradient-to-r from-yellow-200 to-yellow-400 flex items-center justify-center">
            <span className="font-bold text-yellow-900 text-lg">{banner.alt}</span>
            {/* <img src={banner.image} alt={banner.alt} className="h-full w-auto" /> */}
            <button className="ml-4 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow hover:bg-red-700">{banner.label}</button>
          </div>
        ))}
      </div>
      {/* Navegação horizontal de jogos/categorias */}
      <div className="flex gap-3 w-full overflow-x-auto pb-1">
        {navItems.map((item, idx) => (
          <button key={idx} className="flex flex-col items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition min-w-[90px]">
            <span>{item.label}</span>
            {item.badge && <span className="text-[10px] font-bold text-yellow-500 mt-1">{item.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

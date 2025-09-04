import Image from "next/image";

import BannersNav from "./components/BannersNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fff3f3] to-[#f6f6fa] p-0 w-full">
      <div className="w-full max-w-5xl px-4 mt-6">
        <BannersNav />
      </div>
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-12 px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-yellow-900 mb-4 drop-shadow-lg">Cassino Online</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-yellow-700 mb-6">Diversão, emoção e sorte a um clique!</h2>
          <p className="text-gray-800 mb-8 text-base sm:text-lg">Bem-vindo ao seu cassino online! Jogue roleta, slots e muito mais. Cadastre-se, faça login e aproveite jogos incríveis inspirados nos melhores cassinos do Brasil.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/lobby" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-md text-lg transition-colors">Entrar no Lobby</a>
            <a href="/login" className="bg-white hover:bg-yellow-100 text-yellow-800 font-bold py-3 px-8 rounded-full shadow text-lg border border-yellow-300 transition-colors">Login</a>
          </div>
        </div>
      </section>
      <section className="w-full flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white/80 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <Image src="/games/roleta.jpg" alt="Roleta" width={128} height={128} className="w-32 h-32 object-cover rounded mb-4 border-4 border-yellow-300" />
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Roleta</h3>
            <p className="text-gray-700 text-center mb-2">Aposte na sorte e tente ganhar na roleta clássica!</p>
            <a href="/games/roleta" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-6 rounded-full shadow transition-colors">Jogar</a>
          </div>
          <div className="bg-white/80 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <Image src="/games/slots.jpg" alt="Slots" width={128} height={128} className="w-32 h-32 object-cover rounded mb-4 border-4 border-yellow-300" />
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Slots</h3>
            <p className="text-gray-700 text-center mb-2">Gire os rolos e busque grandes prêmios nos caça-níqueis!</p>
            <a href="/games/slots" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-6 rounded-full shadow transition-colors">Jogar</a>
          </div>
        </div>
      </section>
    </div>
  );
}

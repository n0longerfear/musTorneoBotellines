import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Match, Player } from "../types";

export function Matches() {
  const [matches, setMatches] = useLocalStorage<Match[]>("matches", []);
  const [players] = useLocalStorage<Player[]>("players", []);
  const [authCode, setAuthCode] = useState(""); // Código de autenticación
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null); // Para saber qué partido se está eliminando

  const getPlayerName = (id: string) => {
    return players.find((p) => p.id === id)?.name || "Unknown";
  };

  const handleDeleteMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const confirmDelete = () => {
    if (authCode !== "1234") {
      alert("Código incorrecto");
      return;
    }

    setMatches(matches.filter((m) => m.id !== selectedMatch?.id));
    setSelectedMatch(null);
    setAuthCode("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Partidos Jugados</h2>

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow p-4 relative">
            <div className="text-sm text-gray-600 mb-2">
              {new Date(match.date).toLocaleDateString()}
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <div className="font-semibold">{getPlayerName(match.team1.players[0])}</div>
                <div className="font-semibold">{getPlayerName(match.team1.players[1])}</div>
              </div>

              <div className="text-center font-bold text-xl">
                {match.team1.score} - {match.team2.score}
              </div>

              <div className="text-right">
                <div className="font-semibold">{getPlayerName(match.team2.players[0])}</div>
                <div className="font-semibold">{getPlayerName(match.team2.players[1])}</div>
              </div>
            </div>

            <button
              onClick={() => handleDeleteMatch(match)}
              className="absolute top-2 right-2 text-red-600"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
            <p>Solo Marcos tiene el código hijos de puta</p>

            <input
              type="password"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="w-full p-2 border rounded mt-2"
              placeholder="Código"
            />

            <div className="flex justify-end mt-4">
              <button onClick={() => setSelectedMatch(null)} className="mr-2 bg-gray-300 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

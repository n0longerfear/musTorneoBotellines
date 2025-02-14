import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Player, Match } from "../types";

export function Ranking() {
  const [players, setPlayers] = useLocalStorage<Player[]>("players", []);
  const [matches, setMatches] = useLocalStorage<Match[]>("matches", []);
  const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);
  const [deletingPlayer, setDeletingPlayer] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState("");

  useEffect(() => {
    const playerStats = players.map((player) => {
      const playerMatches = matches.filter(
        (match) =>
          match.team1.players.includes(player.id) ||
          match.team2.players.includes(player.id)
      );

      const matchesWon = playerMatches.filter((match) => {
        const isTeam1 = match.team1.players.includes(player.id);
        return isTeam1
          ? match.team1.score > match.team2.score
          : match.team2.score > match.team1.score;
      }).length;

      const totalPoints = playerMatches.reduce((acc, match) => {
        const isTeam1 = match.team1.players.includes(player.id);
        if (match.team1.score === match.team2.score) return acc + 1; // Empate
        return isTeam1
          ? match.team1.score > match.team2.score
            ? acc + 3
            : acc
          : match.team2.score > match.team1.score
          ? acc + 3
          : acc;
      }, 0);

      return {
        ...player,
        gamesPlayed: playerMatches.length,
        gamesWon: matchesWon,
        points: playerMatches.length > 0 ? totalPoints : 0,
      };
    });

    setSortedPlayers([...playerStats].sort((a, b) => b.points - a.points || b.gamesWon - a.gamesWon));
  }, [players, matches]);

  const handleDeletePlayer = (playerId: string) => {
    if (authCode !== "1234") {
      alert("Gilipollas no te lo sabes!! Jajajaj");
      return;
    }

    // Filtrar jugadores
    const updatedPlayers = players.filter((player) => player.id !== playerId);

    const updatedMatches = matches.filter(
      (match) =>
        !match.team1.players.includes(playerId) &&
        !match.team2.players.includes(playerId)
    );

    // Guardar cambios en localStorage
    setPlayers(updatedPlayers);
    setMatches(updatedMatches);

    // Reiniciar autenticación
    setDeletingPlayer(null);
    setAuthCode("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ranking de Jugadores</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-2 p-3 border-b font-semibold text-sm">
          <div>Pos</div>
          <div>Jugador</div>
          <div className="text-center">PJ</div>
          <div className="text-center">PG</div>
          <div className="text-right">Puntos</div>
          <div className="text-right">Acciones</div>
        </div>
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="grid grid-cols-6 gap-2 p-3 border-b last:border-0 items-center"
          >
            <div className="font-semibold">{index + 1}</div>
            <div>{player.name}</div>
            <div className="text-center">{player.gamesPlayed}</div>
            <div className="text-center font-semibold text-green-600">
              {player.gamesWon}
            </div>
            <div className="text-right font-semibold">{player.points}</div>
            <div className="text-right">
              {deletingPlayer === player.id ? (
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Código"
                    className="border p-1 rounded w-16 text-center"
                  />
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setDeletingPlayer(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingPlayer(player.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

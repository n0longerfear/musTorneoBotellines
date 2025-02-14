import React, { useState, useEffect } from "react";
import { Trophy, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Player, Match } from "../types";

export function Home() {
  const [players, setPlayers] = useLocalStorage<Player[]>("players", []);
  const [matches] = useLocalStorage<Match[]>("matches", []);
  const navigate = useNavigate();
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [updatedPlayers, setUpdatedPlayers] = useState<Player[]>([]);

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

    setUpdatedPlayers([...playerStats].sort((a, b) => b.points - a.points || b.gamesWon - a.gamesWon));
  }, [players, matches]);

  const topPlayers = updatedPlayers.slice(0, 3);

  const recentMatches = [...matches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        points: 0,
        gamesPlayed: 0,
        gamesWon: 0,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      setShowAddPlayer(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Trophy className="mx-auto text-indigo-600" size={48} />
        <h2 className="text-2xl font-bold mt-2">Torneo de Mus</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Jugadores</h3>
          <button
            onClick={() => setShowAddPlayer(true)}
            className="flex items-center text-indigo-600"
          >
            <Plus size={20} className="mr-1" />
            <span className="text-sm">Añadir Jugador</span>
          </button>
        </div>

        {showAddPlayer && (
          <form onSubmit={handleAddPlayer} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nombre del jugador"
                className="flex-1 p-2 border rounded"
                autoFocus
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Añadir
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddPlayer(false);
                  setNewPlayerName("");
                }}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {updatedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span>{player.name}</span>
              <span className="text-sm text-gray-600">
                {player.gamesPlayed} PJ | {player.gamesWon} PG
              </span>
            </div>
          ))}
        </div>
      </div>

      {topPlayers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Top Jugadores</h3>
          <div className="space-y-2">
            {topPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2">
                    {index + 1}
                  </span>
                  <span>{player.name}</span>
                </div>
                <span className="font-semibold">{player.points} pts</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/ranking")}
            className="mt-3 text-indigo-600 text-sm font-medium"
          >
            Ver ranking completo →
          </button>
        </div>
      )}

      {recentMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Últimos Partidos</h3>
          <div className="space-y-2">
            {recentMatches.map((match) => (
              <div key={match.id} className="p-2 bg-gray-50 rounded text-sm">
                <div className="flex justify-between items-center">
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                  <span className="font-semibold">
                    {match.team1.players.map((id) => players.find((p) => p.id === id)?.name).join(", ")}{" "}
                    ({match.team1.score}) - ({match.team2.score}){" "}
                    {match.team2.players.map((id) => players.find((p) => p.id === id)?.name).join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/matches")}
            className="mt-3 text-indigo-600 text-sm font-medium"
          >
            Ver todos los partidos →
          </button>
        </div>
      )}
    </div>
  );
}

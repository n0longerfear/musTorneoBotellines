import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Player, Match } from '../types';

export function Calendar() {
  const [players, setPlayers] = useLocalStorage<Player[]>('players', []);
  const [matches, setMatches] = useLocalStorage<Match[]>('matches', []);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const handlePlayerSelect = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length !== 4) return;

    const newMatch: Match = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      team1: {
        players: selectedPlayers.slice(0, 2),
        score: team1Score
      },
      team2: {
        players: selectedPlayers.slice(2, 4),
        score: team2Score
      },
      completed: true
    };

    // Update player statistics
    const updatedPlayers = players.map(player => {
      if (selectedPlayers.includes(player.id)) {
        const isTeam1 = selectedPlayers.slice(0, 2).includes(player.id);
        const isWinner = isTeam1 
          ? team1Score > team2Score 
          : team2Score > team1Score;
        
        return {
          ...player,
          gamesPlayed: player.gamesPlayed + 1,
          gamesWon: player.gamesWon + (isWinner ? 1 : 0),
          points: player.points + (isWinner ? 3 : team1Score === team2Score ? 1 : 0)
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    setMatches([...matches, newMatch]);
    setSelectedPlayers([]);
    setTeam1Score(0);
    setTeam2Score(0);
  };

  const getPlayerName = (id: string) => {
    return players.find(p => p.id === id)?.name || '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Nuevo Partido</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Seleccionar Jugadores</h3>
          <div className="grid grid-cols-2 gap-2">
            {players.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => handlePlayerSelect(player.id)}
                className={`p-2 rounded ${
                  selectedPlayers.includes(player.id)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>

        {selectedPlayers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Equipos Seleccionados</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1">Equipo 1:</p>
                <div className="flex gap-2">
                  {selectedPlayers.slice(0, 2).map(id => (
                    <div key={id} className="bg-gray-100 px-3 py-1 rounded">
                      {getPlayerName(id)}
                    </div>
                  ))}
                </div>
              </div>
              {selectedPlayers.length > 2 && (
                <div>
                  <p className="font-medium mb-1">Equipo 2:</p>
                  <div className="flex gap-2">
                    {selectedPlayers.slice(2, 4).map(id => (
                      <div key={id} className="bg-gray-100 px-3 py-1 rounded">
                        {getPlayerName(id)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedPlayers.length === 4 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Resultado</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Equipo 1
                </label>
                <input
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Equipo 2
                </label>
                <input
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={selectedPlayers.length !== 4}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Guardar Partido
        </button>
      </form>
    </div>
  );
}
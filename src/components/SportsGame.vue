<template>
  <div class="sports-prediction-game">
    <h3>NBA Playoffs Prediction</h3>
    <p>Predict the winners of tonight's NBA playoff games!</p>

    <!-- ⚙️ Game Input UI -->
    <div v-if="!predictionsSubmitted">
      <div v-for="game in todaysGames" :key="game.gameId" class="game-prediction">
        <h4>{{ game.homeTeam }} vs {{ game.awayTeam }} ({{ game.date }})</h4>
        <div class="prediction-options">
          <label :for="`home-${game.gameId}`">
            <input
              type="radio"
              :id="`home-${game.gameId}`"
              :value="game.homeTeam"
              :name="`game-${game.gameId}`"
              @change="predictWinner(game.gameId, game.homeTeam)"
              :disabled="predictionsSubmitted || resultsAvailable"
            />
            {{ game.homeTeam }}
          </label>
          <label :for="`away-${game.gameId}`">
            <input
              type="radio"
              :id="`away-${game.gameId}`"
              :value="game.awayTeam"
              :name="`game-${game.gameId}`"
              @change="predictWinner(game.gameId, game.awayTeam)"
              :disabled="predictionsSubmitted || resultsAvailable"
            />
            {{ game.awayTeam }}
          </label>
        </div>
        <p v-if="game.status && game.status !== 'Scheduled'">Status: {{ game.status }}</p>
        <p v-if="game.homeScore !== undefined && game.awayScore !== undefined">
          {{ game.homeTeam }}: {{ game.homeScore }} - {{ game.awayTeam }}: {{ game.awayScore }}
        </p>
      </div>

      <!-- 🚀 Submission Button -->
      <button
        @click="submitPredictions"
        :disabled="predictionsSubmitted || resultsAvailable || !allGamesPredicted"
        class="submit-predictions"
      >
        Submit Predictions
      </button>
      <p v-if="todaysGames.length === 0 && !loadingScores">No games scheduled for today.</p>
      <p v-if="loadingScores">Fetching live scores...</p>
      <p v-if="!allGamesPredicted && !predictionsSubmitted" class="warning">
        Please predict the winner for all games.
      </p>
    </div>

    <!-- 📊 Waiting for results -->
    <div v-else-if="predictionsSubmitted && !resultsAvailable">
      <p>Your predictions have been submitted. Live scores and results will be updated here.</p>
      <ul>
        <li v-for="game in todaysGames" :key="game.gameId">
          {{ game.homeTeam }} vs {{ game.awayTeam }}:
          <span v-if="game.homeScore !== undefined && game.awayScore !== undefined">
            {{ game.homeScore }} - {{ game.awayScore }}
          </span>
          <span v-else-if="game.status">{{ game.status }}</span>
          <span v-else>Loading...</span>
        </li>
      </ul>
    </div>

    <!-- ✅ Final Results -->
    <div v-else-if="resultsAvailable">
      <h3>Results</h3>
      <ul>
        <li v-for="game in todaysGames" :key="game.gameId">
          {{ game.homeTeam }} vs {{ game.awayTeam }}:
          Winner - {{ game.winner }}
          <span v-if="userPredictions[game.gameId] === game.winner" class="correct">✅ Correct!</span>
          <span v-else class="incorrect">❌ Incorrect</span>
        </li>
      </ul>
      <button @click="resetGame" class="play-again">Predict Again for Next Event</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 🧩 State & Supabase
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/composables/useUser';
import '@/styles/sports-game.css';

// ✅ Interfaces
interface Game {
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  winner?: string;
  date: string;
  homeTeamId: number;
  awayTeamId: number;
}

interface Team {
  id: number;
  name: string;
  full_name: string;
  abbreviation: string;
  city: string;
  conference: string;
}

// 📁 Composables & Refs
const { user } = useUser();
const todaysGames = ref<Game[]>([]);
const userPredictions = ref<Record<number, string>>({});
const predictionsSubmitted = ref(false);
const resultsAvailable = ref(false);
const loadingScores = ref(false);
const scoreUpdateInterval = ref<ReturnType<typeof setInterval> | null>(null);
const updateIntervalTime = 60000;
const teams = ref<Record<number, Team>>({});


// 🧮 Format Date
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 🏀 Fetch Teams
const fetchTeams = async () => {
  try {
    // Check if we already have teams data
    if (Object.keys(teams.value).length > 0) return;

    const res = await fetch(`https://www.balldontlie.io/api/v1/teams`);
    const data = await res.json();
    const teamMap: Record<number, Team> = {};
    
    data.data.forEach((team: Team) => {
      teamMap[team.id] = team;
    });
    
    teams.value = teamMap;
  } catch (err) {
    console.error('Error fetching teams:', err);
  }
};

const fetchTodaysGames = async () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  loadingScores.value = true;

  try {
    // First ensure we have team data
    await fetchTeams();

    const res = await fetch(
      `https://www.balldontlie.io/api/v1/games?start_date=${formattedDate}&end_date=${formattedDate}&per_page=100`
    );
    
    if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
    
    const data = await res.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid API response format');
    }

    todaysGames.value = data.data.map((game: any) => {
      const homeTeam = teams.value[game.home_team_id]?.abbreviation || game.home_team.full_name;
      const awayTeam = teams.value[game.visitor_team_id]?.abbreviation || game.visitor_team.full_name;
      
      return {
        gameId: game.id,
        homeTeam,
        awayTeam,
        homeTeamId: game.home_team_id,
        awayTeamId: game.visitor_team_id,
        homeScore: game.home_team_score,
        awayScore: game.visitor_team_score,
        status: game.status,
        date: game.date,
        winner: game.status === 'Final' 
          ? game.home_team_score > game.visitor_team_score ? homeTeam : awayTeam
          : undefined
      };
    });

    // Check if any games are in progress or final
    checkResults();
  } catch (error) {
    console.error("Error fetching NBA games:", error);
    todaysGames.value = [];
    // You might want to show an error message to the user here
  } finally {
    loadingScores.value = false;
  }
};

// 🔁 Fetch Live Scores
const fetchLiveScores = async () => {
  if (!todaysGames.value.length || resultsAvailable.value) return;
  
  try {
    const today = formatDate(new Date());
    const res = await fetch(
      `https://www.balldontlie.io/api/v1/games?start_date=${today}&end_date=${today}&per_page=100`
    );
    
    const data = await res.json();
    
    data.data.forEach((apiGame: any) => {
      const gameIndex = todaysGames.value.findIndex(g => g.gameId === apiGame.id);
      if (gameIndex !== -1) {
        const updatedGame = {
          ...todaysGames.value[gameIndex],
          homeScore: apiGame.home_team_score,
          awayScore: apiGame.visitor_team_score,
          status: apiGame.status
        };
        
        if (apiGame.status === 'Final' && !updatedGame.winner) {
          updatedGame.winner = apiGame.home_team_score > apiGame.visitor_team_score
            ? updatedGame.homeTeam
            : updatedGame.awayTeam;
        }
        
        todaysGames.value[gameIndex] = updatedGame;
      }
    });
    
    checkResults();
  } catch (err) {
    console.error('Live score error:', err);
  }
};

// 🧠 Logic
const predictWinner = (gameId: number, winner: string) => {
  userPredictions.value[gameId] = winner;
};

const submitPredictions = () => {
  predictionsSubmitted.value = true;
  resultsAvailable.value = false;
};

const rewardPointsForCorrectPrediction = async (gameId: number) => {
  const game = todaysGames.value.find(g => g.gameId === gameId);
  const predicted = userPredictions.value[gameId];
  if (predicted === game?.winner) {
    await supabase.from('user_rewards').insert([
      {
        user_id: user.value.id,
        source: `Prediction: ${game.homeTeam} vs ${game.awayTeam}`,
        points: 20,
      },
    ]);
  }
};

const checkResults = async () => {
  resultsAvailable.value = todaysGames.value.every((game) => game.status === 'Final');
  if (resultsAvailable.value) {
    for (const game of todaysGames.value) {
      if (userPredictions.value[game.gameId] === game.winner) {
        await rewardPointsForCorrectPrediction(game.gameId);
      }
    }
  }
};

const resetGame = () => {
  predictionsSubmitted.value = false;
  resultsAvailable.value = false;
  userPredictions.value = {};
  fetchTodaysGames();
};

const allGamesPredicted = computed(() =>
  todaysGames.value.every((game) => userPredictions.value[game.gameId])
);

// ⏳ Mount/Unmount
onMounted(async () => {
  await fetchTeams();
  await fetchTodaysGames();
  scoreUpdateInterval.value = setInterval(fetchLiveScores, updateIntervalTime);
});

onUnmounted(() => {
  if (scoreUpdateInterval.value) clearInterval(scoreUpdateInterval.value);
});
</script>

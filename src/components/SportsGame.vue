<template>
  <div class="sports-prediction-game">
    <h3>NBA Playoffs Prediction</h3>
    <p>Predict the winners of tonight's NBA playoff games!</p>

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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import "../styles/sports-game.css";
  // Properly added the import for external CSS

interface Game {
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  winner?: string;
  date: string;
}

interface Team {
  id: number;
  name: string;
  full_name: string;
  abbreviation: string;
}

const todaysGames = ref<Game[]>([]);
const userPredictions = ref<Record<number, string>>({});
const predictionsSubmitted = ref(false);
const resultsAvailable = ref(false);
const loadingScores = ref(false);
const scoreUpdateInterval = ref<number | null>(null);
const updateIntervalTime = 60000; // 60 seconds

const teams = ref<Record<number, Team>>({});

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchTeams = async () => {
  try {
    const response = await fetch('https://www.balldontlie.io/api/v1/teams');
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.status}`);
    }
    const data = await response.json();
    data.data.forEach((team: Team) => {
      teams.value[team.id] = team;
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    // Consider setting an error state to display to the user
  }
};

const fetchTodaysGames = async () => {
  const today = formatDate(new Date());
  loadingScores.value = true;
  try {
    const response = await fetch(`https://www.balldontlie.io/api/v1/games?start_date=${today}&end_date=${today}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.status}`);
    }
    const data = await response.json();

    todaysGames.value = data.data.map((game: any) => {
      return {
        gameId: game.id,
        homeTeam: teams.value[game.home_team_id]?.abbreviation || 'Unknown',
        awayTeam: teams.value[game.visitor_team_id]?.abbreviation || 'Unknown',
        homeScore: game.home_team_score,
        awayScore: game.visitor_team_score,
        status: game.status,
        date: game.date,
      };
    });
  } catch (error) {
    console.error('Error fetching today\'s games:', error);
    todaysGames.value = []; // Clear games on error
  } finally {
    loadingScores.value = false;
  }
};

const fetchLiveScores = async () => {
  if (!todaysGames.value.length || resultsAvailable.value) return;

  loadingScores.value = true;
  try {
    const response = await fetch(
      `https://www.balldontlie.io/api/v1/games?start_date=${formatDate(
        new Date()
      )}&end_date=${formatDate(new Date())}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch live scores: ${response.status}`);
    }
    const data = await response.json();

    data.data.forEach((apiGame: any) => {
      const game = todaysGames.value.find((g) => g.gameId === apiGame.id);
      if (game) {
        game.homeScore = apiGame.home_team_score;
        game.awayScore = apiGame.visitor_team_score;
        game.status = apiGame.status;

        if (apiGame.status === 'Final' && !game.winner) {
          game.winner =
            apiGame.home_team_score > apiGame.visitor_team_score
              ? teams.value[apiGame.home_team_id]?.abbreviation || 'Home'
              : teams.value[apiGame.visitor_team_id]?.abbreviation || 'Away';
        }
      }
    });
    checkResults();
  } catch (error) {
    console.error('Error fetching live scores:', error);
    // Consider showing a user-friendly error message
  } finally {
    loadingScores.value = false;
  }
};

const predictWinner = (gameId: number, winner: string) => {
  userPredictions.value[gameId] = winner;
};

const submitPredictions = () => {
  predictionsSubmitted.value = true;
  resultsAvailable.value = false;
  console.log('Predictions submitted:', userPredictions.value);
};

const checkResults = () => {
  resultsAvailable.value = todaysGames.value.every((game) => game.status === 'Final');
};

const resetGame = () => {
  predictionsSubmitted.value = false;
  resultsAvailable.value = false;
  userPredictions.value = {};
  fetchTodaysGames();
};

const allGamesPredicted = computed(() => {
  return todaysGames.value.every((game) => userPredictions[game.gameId]);
});

onMounted(async () => {
  await fetchTeams();
  await fetchTodaysGames();
  scoreUpdateInterval.value = window.setInterval(fetchLiveScores, updateIntervalTime) as any as number; // Type assertion here
});

onUnmounted(() => {
  if (scoreUpdateInterval.value) {
    clearInterval(scoreUpdateInterval.value as number); //  Clear interval
  }
});
</script>

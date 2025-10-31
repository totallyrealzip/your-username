(() => {
  const CHOICES = ["rock", "paper", "scissors"];
  const EMOJI = { rock: "🪨", paper: "📄", scissors: "✂️" };

  /** @type {HTMLButtonElement[]} */
  const choiceButtons = Array.from(document.querySelectorAll('.choice'));
  /** @type {HTMLDivElement} */
  const resultEl = document.getElementById('result');
  /** @type {HTMLOListElement} */
  const historyListEl = document.getElementById('historyList');
  /** @type {HTMLSpanElement} */
  const playerScoreEl = document.getElementById('playerScore');
  /** @type {HTMLSpanElement} */
  const cpuScoreEl = document.getElementById('cpuScore');
  /** @type {HTMLSpanElement} */
  const roundNumberEl = document.getElementById('roundNumber');
  /** @type {HTMLSpanElement} */
  const playerPickEl = document.getElementById('playerPick');
  /** @type {HTMLSpanElement} */
  const cpuPickEl = document.getElementById('cpuPick');
  /** @type {HTMLButtonElement} */
  const resetBtn = document.getElementById('resetBtn');
  /** @type {HTMLSelectElement} */
  const bestOfSelect = document.getElementById('bestOf');

  const state = {
    playerScore: 0,
    cpuScore: 0,
    roundNumber: 1,
    bestOf: parseInt(bestOfSelect.value, 10) || 3,
    gameOver: false,
  };

  function getCpuChoice() {
    const index = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[index];
  }

  function determineOutcome(player, cpu) {
    if (player === cpu) return 'draw';
    const wins =
      (player === 'rock' && cpu === 'scissors') ||
      (player === 'paper' && cpu === 'rock') ||
      (player === 'scissors' && cpu === 'paper');
    return wins ? 'win' : 'lose';
  }

  function updateScoreboard() {
    playerScoreEl.textContent = String(state.playerScore);
    cpuScoreEl.textContent = String(state.cpuScore);
    roundNumberEl.textContent = String(state.roundNumber);
  }

  function setResult(text, type) {
    resultEl.textContent = text;
    resultEl.classList.remove('win', 'lose', 'draw');
    if (type) resultEl.classList.add(type);
  }

  function addHistoryItem({ round, player, cpu, outcome }) {
    const li = document.createElement('li');
    const outcomeWord = outcome === 'win' ? 'won' : outcome === 'lose' ? 'lost' : 'drew';
    li.textContent = `R${round}: You ${outcomeWord} — You ${player} ${EMOJI[player]} vs CPU ${cpu} ${EMOJI[cpu]}`;
    historyListEl.prepend(li);
  }

  function haveWinner() {
    // First to majority of best-of series wins
    const needed = Math.floor(state.bestOf / 2) + 1;
    if (state.playerScore >= needed) return 'player';
    if (state.cpuScore >= needed) return 'cpu';
    return null;
  }

  function onChoiceClick(choice) {
    if (state.gameOver) return;

    const player = choice;
    const cpu = getCpuChoice();
    const outcome = determineOutcome(player, cpu);

    playerPickEl.textContent = `${EMOJI[player]} ${capitalize(player)}`;
    cpuPickEl.textContent = `${EMOJI[cpu]} ${capitalize(cpu)}`;

    if (outcome === 'win') state.playerScore += 1;
    else if (outcome === 'lose') state.cpuScore += 1;

    const message = outcome === 'win' ? 'You win this round!' : outcome === 'lose' ? 'You lose this round.' : "It's a draw.";
    setResult(message, outcome);

    addHistoryItem({ round: state.roundNumber, player, cpu, outcome });
    state.roundNumber += 1;
    updateScoreboard();

    const winner = haveWinner();
    if (winner) endGame(winner);
  }

  function endGame(winner) {
    state.gameOver = true;
    const text = winner === 'player' ? 'You won the match! 🎉' : 'CPU won the match. 🤖';
    setResult(text, winner === 'player' ? 'win' : 'lose');
    // Disable choice buttons for clarity
    choiceButtons.forEach(b => b.disabled = true);
  }

  function resetGame() {
    state.playerScore = 0;
    state.cpuScore = 0;
    state.roundNumber = 1;
    state.bestOf = parseInt(bestOfSelect.value, 10) || 3;
    state.gameOver = false;
    playerPickEl.textContent = '—';
    cpuPickEl.textContent = '—';
    setResult('Make your move!');
    historyListEl.innerHTML = '';
    updateScoreboard();
    choiceButtons.forEach(b => b.disabled = false);
  }

  function capitalize(s) { return s[0].toUpperCase() + s.slice(1); }

  // Event bindings
  choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => onChoiceClick(btn.dataset.choice));
  });
  resetBtn.addEventListener('click', resetGame);
  bestOfSelect.addEventListener('change', () => {
    // Changing series length resets the match
    resetGame();
  });

  // Initial paint
  updateScoreboard();
})();



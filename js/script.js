// Select DOM elements
const pokemon_name = document.querySelector('.pokemon_name');
const pokemon_number = document.querySelector('.pokemon_number');
const pokemon_image = document.querySelector('.pokemon_image');
const loading_image = document.querySelector('.loading_image');
const pokemonTypes = document.querySelector('.pokemon_types');
const input_search = document.querySelector('.input_search');
const form = document.querySelector('.form');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');
const btn_random = document.querySelector('.btn-random');
const dice_image = document.querySelector('#dice-image');
const weaknessesBox = document.querySelector('.weaknesses_box');
const strengthsBox = document.querySelector('.strengths_box');

// Set API URL and initial Pokemon
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let currentPokemon = 1;
let isShiny = localStorage.getItem('isShiny') === 'true' || false;

function renderPokemonImage() {
}

const toggleShinyButton = document.querySelector('#toggle-shiny');

toggleShinyButton.addEventListener('click', async () => {
  console.log('Toggle Shiny button clicked, isShiny:', isShiny);
  isShiny = !isShiny;
  toggleShinyButton.classList.toggle('active', isShiny);
  renderPokemon(currentPokemon);

});

async function fetchTypeData(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching type data:', error);
    return null;
  }
}

// Define the fetchPokemon function
const fetchPokemon = async (pokemon) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Buscar informações da evolução
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();

    return { ...data, evolutionChain: evolutionChainData };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return null;
  }
};

const fetchEvolutionDetails = async (evolutionChain, speciesName) => {
  // Percorra a cadeia de evolução para encontrar o Pokémon específico
  const findPokemonInChain = (chain, name) => {
    if (chain.species.name === name) {
      return chain;
    }
    for (const link of chain.evolves_to) {
      const result = findPokemonInChain(link, name);
      if (result) {
        return result;
      }
    }
    return null;
  };

  const specificPokemonChain = findPokemonInChain(evolutionChain.chain, speciesName);
  return specificPokemonChain ? specificPokemonChain.evolution_details : [];
};


const renderPokemonData = (name, types) => {
  const pokemonNumber = currentPokemon.toString().padStart(3, '0');
  const pokemonName = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  const pokemonTypes = types ? types.map(type => type.type.name) : [];

  document.querySelector('.pokemon_number').textContent = pokemonNumber;
  document.querySelector('.pokemon_name').textContent = pokemonName;
  document.querySelector('.pokemon_types').textContent = pokemonTypes.join(', ');
};

// Update the DOM with Pokemon data and types
async function updatePokemonData(data) {
  const pokemonNumber = data.id.toString().padStart(3, '0');
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  //Pokemon has shiny sprite
  var pokemonImage = data.sprites.front_default;
  const sprite = data.sprites.front_shiny
  if (!sprite) {
    isShiny = false;
    toggleShinyButton.style.display = "none"; // Hide the "Shiny" button
  } else {
    toggleShinyButton.style.display = "block"; // Show the "Shiny" button
    if (isShiny)
      pokemonImage = sprite;
  }

  const pokemonTypes = data.types.map(type => type.type.name);

  //input_search.value = data.name; // mostra o nome do pokemon no input
  document.querySelector('.pokemon_number').textContent = pokemonNumber;
  document.querySelector('.pokemon_name').textContent = pokemonName;
  document.querySelector('.pokemon_image').src = pokemonImage;
  renderPokemonTypes(pokemonTypes); // Call renderPokemonTypes with the current Pokemon's types
}

async function getRandomPokemonData() {
  const randomPokemonId = Math.floor(Math.random() * 1010) + 1; // Generate a random Pokemon ID between 1 and 1010
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
  const data = await response.json();
  const pokemonData = {
    name: data.name,
    number: data.id,
    types: data.types.map(type => type.type.name),
    abilities: data.abilities.map(ability => ability.ability.name),
    hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
    maxHp: data.stats.find(stat => stat.stat.name === 'hp').base_stat * 2,
  };
  return pokemonData;
}

const createPokemonData = (data) => {
  const pokemonData = {
    abilities: data.abilities.map(ability => ability.ability.name),
    hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
    maxHp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
  };
  return pokemonData;
}


// Render the Pokemon types in the DOM
const renderPokemonTypes = (types) => {
  const pokemonTypes = document.querySelector('.pokemon_types');
  pokemonTypes.innerHTML = '';
  if (!Array.isArray(types)) {
    pokemonTypes.innerHTML = 'N/A';
    return;
  }
  types.forEach(type => {
    const typeElement = document.createElement('div');
    typeElement.textContent = type;
    typeElement.classList.add('pokemon_type');
    typeElement.classList.add(`pokemon_type_${type}`);
    pokemonTypes.appendChild(typeElement);
  });
};

function calculateMoveEffectiveness(moveType, pokemonTypes) {
  let effectiveness = 1;

  pokemonTypes.forEach((type) => {
    const typeEffectiveness = typeChart[moveType][type];
    effectiveness *= typeEffectiveness;
  });

  return effectiveness;
}

const renderPokemonStrengths = (strengths) => {
  const strengthsBox = document.querySelector('.super_effective');
  strengthsBox.innerHTML = '';

  if (!Array.isArray(strengths) || strengths.length === 0) {
    strengthsBox.textContent = 'None';
  } else {
    strengths.forEach(strength => {
      const strengthElement = createTypeElement(strength);
      strengthsBox.appendChild(strengthElement);
    });
  }
};

const renderPokemonWeaknesses = (weaknesses) => {
  const weaknessesBox = document.querySelector('.not_very_effective');
  weaknessesBox.innerHTML = '';

  if (!Array.isArray(weaknesses) || weaknesses.length === 0) {
    weaknessesBox.textContent = 'N/A';
  } else {
    weaknesses.forEach(weakness => {
      const weaknessElement = createTypeElement(weakness);
      weaknessesBox.appendChild(weaknessElement);
    });
  }
};




const createTypeElement = (type) => {
  const typeElement = document.createElement('div');
  typeElement.textContent = type;
  typeElement.classList.add('pokemon_type');
  typeElement.classList.add(`pokemon_type_${type}`);
  return typeElement;
};


// Adicione esta função para renderizar os tipos imunes
const renderPokemonImmunity = (immunity) => {
  const immunityBox = document.querySelector('.immune');
  immunityBox.innerHTML = '';

  if (!Array.isArray(immunity) || immunity.length === 0) {
    immunityBox.textContent = 'N/A';
  } else {
    immunity.forEach(immuneType => {
      const immunityElement = createTypeElement(immuneType);
      immunityBox.appendChild(immunityElement);
    });
  }
};

document.body.addEventListener("click", playMusicFirstTime);

function playMusicFirstTime() {
  var bgMusic = document.getElementById("bgMusic");
  if (bgMusic.paused) {
    bgMusic.play();
  }
  document.body.removeEventListener("click", playMusicFirstTime);
}

document.getElementById("toggleAudioBtn").addEventListener("click", function () {
  var bgMusic = document.getElementById("bgMusic");
  var icon = this.querySelector("i");
  if (bgMusic.paused) {
    bgMusic.play();
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
  } else {
    bgMusic.pause();
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  }
});

var bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.15;


const renderPokemon = async (pokemon) => {
  loading_image.style.display = 'block';
  pokemon_image.style.display = 'none';
  input_search.disabled = true;

  btn_next.disabled = true;
  btn_prev.disabled = true;
  btn_random.disabled = true;

  const data = await fetchPokemon(pokemon);
  if (!data) {
    pokemon_name.innerHTML = MISSINGNO_NAME;
    pokemon_number.innerHTML = MISSINGNO_NUMBER;
    pokemon_image.src = MISSINGNO_IMAGE_URL;
    pokemonTypes.innerHTML = MISSINGNO_TYPES;
  } else {
    currentPokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const name = data.name;
    const types = data.types;
    const imageUrl = isShiny ? data.sprites.front_shiny : data.sprites.front_default;

    renderPokemonData(name, types);
    renderPokemonImage(imageUrl);

    const typeUrls = types.map(type => type.type.url);

    Promise.all(typeUrls.map(url => fetch(url)))
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(types => {
        const weaknesses = new Set();
        const strengths = new Set();
        const immunity = new Set();

        types.forEach(type => {
          type.damage_relations.double_damage_from.forEach(weakness => weaknesses.add(weakness.name));
          type.damage_relations.double_damage_to.forEach(strength => strengths.add(strength.name));
          type.damage_relations.no_damage_from.forEach(immune => immunity.add(immune.name));
        });

        const superEffectiveTypes = Array.from(strengths);
        const notVeryEffectiveTypes = Array.from(weaknesses);
        const immuneTypes = Array.from(immunity);

        const uniqueSuperEffectiveTypes = superEffectiveTypes.filter(type => !notVeryEffectiveTypes.includes(type));
        const uniqueNotVeryEffectiveTypes = notVeryEffectiveTypes.filter(type => !superEffectiveTypes.includes(type));

        renderPokemonWeaknesses(uniqueNotVeryEffectiveTypes);
        renderPokemonStrengths(uniqueSuperEffectiveTypes);
        renderPokemonImmunity(immuneTypes);
      });

    updatePokemonData(data);
    const pokemonData = createPokemonData(data);
    const healthBarHTML = createHealthBar(pokemonData.hp, pokemonData.maxHp);
    document.querySelector('.health_bar_container').innerHTML = healthBarHTML;
    const healthBar = document.querySelector('.health_bar_container .health_bar');
    healthBar.style.width = `${(pokemonData.hp / pokemonData.maxHp) * 100}%`;
    if (pokemonData.hp === pokemonData.maxHp) {
      healthBar.classList.add('green');
    } else {
      healthBar.classList.remove('green');
    }

    // Tratamento do botão "Shiny" com base no Shadow Mode
    console.log("Shadow Mode:", shadowMode);  // <-- Adicione esta linha
    console.log("Is Shiny Available:", isShinyAvailable(data));  // <-- Adicione esta linha

    if (shadowMode) {
      toggleShinyButton.style.display = "none"; // Esconde o botão "Shiny" no Shadow Mode
    } else if (isShinyAvailable(data)) {
      toggleShinyButton.style.display = "block"; // Mostra o botão "Shiny" se o Pokémon tem forma shiny
    } else {
      toggleShinyButton.style.display = "none"; // Esconde o botão "Shiny" se não houver forma shiny
    }
  }

  loading_image.style.display = 'none';
  pokemon_image.style.display = 'block';
  input_search.disabled = false;

  btn_next.disabled = false;
  btn_prev.disabled = false;
  btn_random.disabled = false;
};

// Função auxiliar para verificar se o Pokémon tem forma shiny
function isShinyAvailable(pokemonData) {
  return pokemonData && pokemonData.sprites && pokemonData.sprites.front_shiny;
}


// Função auxiliar para verificar se o Pokémon tem forma shiny
function isShinyAvailable(pokemonData) {
  return pokemonData && pokemonData.sprites && pokemonData.sprites.front_shiny;
}


// Handle the "Next" button click
const handleNext = async () => {
  if (currentPokemon === 1010) {
    currentPokemon = 1;
  } else {
    currentPokemon++;
  }
  isShiny = false; // Reset isShiny to false
  await renderPokemon(currentPokemon);
  if (shadowMode) {
    applyShadowMode();
  }
};

// Handle the "Random" button click
const handleRandom = async () => {
  const randomPokemonId = Math.floor(Math.random() * 1010) + 1;
  currentPokemon = randomPokemonId;
  isShiny = false; // Reset isShiny to false
  handleRoll();
  await renderPokemon(currentPokemon);
  if (shadowMode) {
    applyShadowMode();
  }
};

// Handle the "Previous" button click
const handlePrev = async () => {
  if (currentPokemon === 1) {
    currentPokemon = 1010;
  } else {
    currentPokemon--;
  }
  isShiny = false; // Reset isShiny to false
  await renderPokemon(currentPokemon);
  if (shadowMode) {
    applyShadowMode();
  }
};

// Handle the search form submission
const MISSINGNO_NAME = 'Missingno';
const MISSINGNO_NUMBER = '?';
const MISSINGNO_IMAGE_URL = 'images/missingno.png';
const MISSINGNO_TYPES = 'N/A';

const handleSearch = async (event) => {
  event.preventDefault();
  const pokemon = input_search.value.toLowerCase();
  if (pokemon === 'secret') {
    alert('You found the secret!');
  } else {
    const data = await fetchPokemon(pokemon);
    if (data === null) {
      pokemon_name.innerHTML = MISSINGNO_NAME;
      pokemon_number.innerHTML = MISSINGNO_NUMBER;
      pokemon_image.src = MISSINGNO_IMAGE_URL;
      pokemonTypes.innerHTML = MISSINGNO_TYPES;
    } else {
      currentPokemon = data.id;
      renderPokemon(currentPokemon);
    }
  }
};

// Handle the secret code input
const handleSecretCode = (event) => {
  const secretCode = 'Secret';
  const inputCode = event.target.value.toLowerCase();
  if (event.key === 'Enter' && inputCode === secretCode) {
    alert('Secret!');
  }
};

// Roll the dice animation
const handleRoll = () => {
  const dice = dice_image;
  const duration = 400;
  const interval = 40;

  const shakeInterval = setInterval(() => {
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    dice.style.transform = `translate(${x}px, ${y}px)`;
    const value = Math.floor(Math.random() * 6) + 1;
    dice_image.src = `/images/dices/dice-${value}.svg`;
  }, interval);

  setTimeout(() => {
    clearInterval(shakeInterval);
    dice.style.transform = 'translate(0, 0)';
  }, duration);
};

//Make the width based on the pokemon's HP value (fetch the HP value from the api)
const createHealthBar = (pokemonHp, pokemonMaxHp) => {
  const healthPercentage = (pokemonMaxHp);
  const healthBarHTML = `
    <div class="health_bar" style=" width: ${healthPercentage}%; position: relative;">
      <div class="hp_text" style="">${pokemonHp} / ${pokemonMaxHp}</div>
    </div>
  `;
  return healthBarHTML;
};


//Clean placeholder on click

const clearPlaceholder = () => {
  const searchInput = document.querySelector('.input_search');
  searchInput.placeholder = '';
};

const toggleShiny = () => {
  isShiny = !isShiny;
  renderPokemon(currentPokemon);
  toggleShinyButton.classList.toggle('active', isShiny);
};

// Add touch events for mobile devices
toggleShinyButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  toggleShiny();
});
toggleShinyButton.addEventListener('touchend', (event) => {
  event.preventDefault();
});

const handleShiny = async () => {
  if (currentPokemon === MISSINGNO_ID) {
    isShiny = false;
    toggleShinyButton.style.display = "none"; // Hide the "Shiny" button
    renderPokemon(MISSINGNO_ID);
  } else {
    isShiny = !isShiny;
    renderPokemon(currentPokemon);
    toggleShinyButton.style.display = "block"; // Show the "Shiny" button
  }
};


// Função para tocar o choro do Pokémon
function playPokemonCry(pokemonName) {
  const audio = document.getElementById('pokemonCryAudio');
  audio.src = `https://play.pokemonshowdown.com/audio/cries/${pokemonName}.mp3`;
  audio.play().catch(error => console.error('Erro ao tocar o choro do Pokémon:', error));
}

// Adicionando o evento de clique na imagem do Pokémon
document.querySelector('.pokemon_image').addEventListener('click', () => {
  const pokemonName = document.querySelector('.pokemon_name').textContent.toLowerCase();
  playPokemonCry(pokemonName);
});

// Variáveis globais para o Modo Sombra
let shadowMode = false;
let currentPokemonName = '';
let score = 0;
// Funções para esconder e mostrar os dados do Pokémon
function hidePokemonData() {
  document.querySelector('.pokemon_name').textContent = '???';
  document.querySelector('.pokemon_number').textContent = '???';
  document.querySelector('.health_bar_container').style.display = 'none';
  document.querySelector('.pokemon_types').style.display = 'none';
  document.querySelector('.super_effective').style.display = 'none';
  document.querySelector('.not_very_effective').style.display = 'none';
  document.querySelector('.immune').style.display = 'none';
}

function showPokemonData() {
  document.querySelector('.pokemon_name').textContent = currentPokemonName;
  document.querySelector('.pokemon_number').textContent = currentPokemon.toString().padStart(3, '0');
  document.querySelector('.health_bar_container').style.display = 'block';
  document.querySelector('.pokemon_types').style.display = 'block';
  document.querySelector('.super_effective').style.display = 'block';
  document.querySelector('.not_very_effective').style.display = 'block';
  document.querySelector('.immune').style.display = 'block';
}

// Função para ativar/desativar o Modo Sombra
function toggleShadowMode() {
  shadowMode = !shadowMode;
  if (shadowMode) {
    pokemon_image.classList.add('shadow-mode');
    hidePokemonData();
    input_search.placeholder = 'Guess!';
    input_search.value = '';
    toggleShinyButton.style.display = "none"; // Esconde o botão "Shiny" no Shadow Mode
  } else {
    pokemon_image.classList.remove('shadow-mode');
    showPokemonData();
    input_search.placeholder = 'Name or Number';
    renderPokemon(currentPokemon);
    if (isShinyAvailable(currentPokemon)) {
      toggleShinyButton.style.display = "block"; // Mostra o botão "Shiny" se o Pokémon atual tem forma shiny
    }
  }
}





function checkAnswer() {
  if (shadowMode) {
    const userGuess = input_search.value.toLowerCase();
    if (userGuess === currentPokemonName.toLowerCase()) {
      score++;
      updateScoreDisplay();
      showCorrectFeedback();
    } else {
      showIncorrectFeedback();
    }
    input_search.value = '';
    handleRandom(); // Mostrar um novo Pokémon aleatório após um acerto ou erro
  }
}


function updateScoreDisplay() {
  document.querySelector('.shadow-mode-button').textContent = `Shadow Mode (Score: ${score})`;
}

function showCorrectFeedback() {
  const feedbackElement = document.createElement('div');
  feedbackElement.textContent = 'Correct!';
  feedbackElement.classList.add('feedback', 'correct');
  document.body.appendChild(feedbackElement);
  setTimeout(() => feedbackElement.remove(), 2000);
}

function showIncorrectFeedback() {
  const feedbackElement = document.createElement('div');
  feedbackElement.textContent = 'Try again!';
  feedbackElement.classList.add('feedback', 'incorrect');
  document.body.appendChild(feedbackElement);
  setTimeout(() => feedbackElement.remove(), 2000);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (shadowMode) {
    checkAnswer();
  } else {
    handleSearch(event);
  }
});



// Código para o botão do Modo Sombra (adicionar este botão no HTML)
document.querySelector('.shadow-mode-button').addEventListener('click', toggleShadowMode);

// Função para aplicar o Modo Sombra
function applyShadowMode() {
  pokemon_image.classList.add('shadow-mode');
  hidePokemonData();
}



// Seletor para todos os elementos com classe "not_very_effective"
const notVeryEffectiveElements = document.querySelectorAll('.not_very_effective .types');

// Adicionar eventos de mouseover e mouseout a cada elemento
notVeryEffectiveElements.forEach((element) => {
  const types = element.textContent; // Obter o nome do tipo
  const multiplier = "0.5x"; // Substitua isso pelo seu cálculo de multiplicador

  element.addEventListener('mouseover', () => {
    showTooltip(element, `Multiplier: ${multiplier}`);
  });

  element.addEventListener('mouseout', () => {
    hideTooltip(element);
  });
});

// Add event listeners
btn_prev.addEventListener('click', handlePrev);
btn_next.addEventListener('click', handleNext);
btn_random.addEventListener('click', handleRandom);
form.addEventListener('submit', handleSearch);
input_search.addEventListener('keydown', handleSecretCode);



// Render a random Pokemon on page load
handleRandom();
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


// Define the fetchPokemon function
const fetchPokemon = async (pokemon) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return null;
  }
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

  input_search.value = data.name;
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

const types = {
  NORMAL: { weaknesses: ['FIGHTING'], strengths: [] },
  FIGHTING: { weaknesses: ['FLYING', 'PSYCHIC', 'FAIRY'], strengths: ['NORMAL', 'ROCK', 'STEEL', 'ICE', 'DARK'] },
  FLYING: { weaknesses: ['ROCK', 'ELECTRIC', 'ICE'], strengths: ['FIGHTING', 'BUG', 'GRASS'] },
  POISON: { weaknesses: ['GROUND', 'PSYCHIC'], strengths: ['GRASS', 'FAIRY'] },
  GROUND: { weaknesses: ['WATER', 'GRASS', 'ICE'], strengths: ['POISON', 'ROCK', 'STEEL', 'FIRE', 'ELECTRIC'] },
  ROCK: { weaknesses: ['FIGHTING', 'GROUND', 'STEEL', 'WATER', 'GRASS'], strengths: ['FLYING', 'BUG', 'FIRE', 'ICE'] },
  BUG: { weaknesses: ['FLYING', 'ROCK', 'FIRE'], strengths: ['GRASS', 'PSYCHIC', 'DARK'] },
  GHOST: { weaknesses: ['GHOST', 'DARK'], strengths: ['PSYCHIC', 'GHOST'] },
  STEEL: { weaknesses: ['FIGHTING', 'GROUND', 'FIRE'], strengths: ['ROCK', 'ICE', 'FAIRY'] },
  FIRE: { weaknesses: ['GROUND', 'ROCK', 'WATER'], strengths: ['BUG', 'STEEL', 'GRASS', 'ICE'] },
  WATER: { weaknesses: ['GRASS', 'ELECTRIC'], strengths: ['GROUND', 'ROCK', 'FIRE'] },
  GRASS: { weaknesses: ['FLYING', 'POISON', 'BUG', 'FIRE', 'ICE'], strengths: ['GROUND', 'ROCK', 'WATER'] },
  ELECTRIC: { weaknesses: ['GROUND'], strengths: ['FLYING', 'WATER'] },
  PSYCHIC: { weaknesses: ['BUG', 'GHOST', 'DARK'], strengths: ['FIGHTING', 'POISON'] },
  ICE: { weaknesses: ['FIGHTING', 'ROCK', 'STEEL', 'FIRE'], strengths: ['FLYING', 'GROUND', 'GRASS', 'DRAGON'] },
  DRAGON: { weaknesses: ['ICE', 'DRAGON', 'FAIRY'], strengths: ['DRAGON'] },
  DARK: { weaknesses: ['FIGHTING', 'BUG', 'FAIRY'], strengths: ['GHOST', 'PSYCHIC'] },
  FAIRY: { weaknesses: ['POISON', 'STEEL'], strengths: ['FIGHTING', 'DRAGON', 'DARK'] },
};

function calculateMultipliers(attackingType, defendingTypes) {
  var weaknesses = new Set();
  var strengths = new Set();

  defendingTypes.forEach(function(defendingType) {
    var multiplier = 1;
    types[defendingType].weaknesses.forEach(function(weakness) {
      if (weakness === attackingType && !weaknesses.has(defendingType)) {
        strengths.delete(defendingType);
        weaknesses.add(defendingType);
      } else if (!strengths.has(defendingType)) {
        multiplier *= 2;
        strengths.add(defendingType);
      }
    });
    types[defendingType].strengths.forEach(function(strength) {
      if (strength === attackingType && !strengths.has(defendingType)) {
        weaknesses.delete(defendingType);
        strengths.add(defendingType);
      } else if (!weaknesses.has(defendingType)) {
        multiplier *= 0.5;
        weaknesses.add(defendingType);
      }
    });
  });

  return {
    weaknesses: Array.from(weaknesses),
    strengths: Array.from(strengths),
  };
}

// Render the Pokemon weaknesses and strengths in the DOM
const renderPokemonWeaknesses = (weaknesses) => {
  const weaknessesBox = document.querySelector('.pokemon_weaknesses');
  weaknessesBox.innerHTML = '';
  if (!Array.isArray(weaknesses) || weaknesses.length === 0) {
    weaknessesBox.innerHTML = 'N/A';
    return;
  }
  if (weaknessesBox) {
    weaknesses.forEach(weakness => {
      const weaknessElement = document.createElement('div');
      weaknessElement.textContent = weakness;
      weaknessElement.classList.add('pokemon_weakness');
      weaknessElement.classList.add(`pokemon_type_${weakness}`);
      weaknessesBox.appendChild(weaknessElement);
    });
  }
};


const renderPokemonStrengths = (strengths) => {
  const strengthsBox = document.querySelector('.pokemon_strengths');
  strengthsBox.innerHTML = '';
  if (!Array.isArray(strengths) || strengths.length === 0) {
    strengthsBox.innerHTML = 'None';
    return;
  }
  if (strengthsBox) {
    strengths.forEach(strength => {
      const strengthElement = document.createElement('div');
      strengthElement.textContent = strength;
      strengthElement.classList.add('pokemon_strength');
      strengthElement.classList.add(`pokemon_type_${strength}`);
      strengthsBox.appendChild(strengthElement);
    });
  }
};



const renderPokemon = async (pokemon) => {
  loading_image.style.display = 'block';
  pokemon_image.style.display = 'none';
  input_search.disabled = true;

  btn_next.disabled = true;
  btn_prev.disabled = true;
  btn_random.disabled = true;

  //If pokemon shiny then button active
  toggleShinyButton.classList.toggle('active', isShiny);

  const data = await fetchPokemon(pokemon);
  if (!data) {
    const healthBarHTML = createHealthBar(0, 0); // Pass 0 as the first parameter to display 0 HP
    document.querySelector('.health_bar_container').innerHTML = healthBarHTML;
  } else {
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

        types.forEach(type => {
          type.damage_relations.double_damage_from.forEach(weakness => weaknesses.add(weakness.name));
          type.damage_relations.double_damage_to.forEach(strength => strengths.add(strength.name));
        });

        renderPokemonWeaknesses(Array.from(weaknesses));
        renderPokemonStrengths(Array.from(strengths));
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
  }

  loading_image.style.display = 'none';
  pokemon_image.style.display = 'block';
  input_search.disabled = false;

  btn_next.disabled = false;
  btn_prev.disabled = false;
  btn_random.disabled = false;
};  


// Handle the "Next" button click
const handleNext = async () => {
  if (currentPokemon === 1010) {
    currentPokemon = 1;
  } else {
    currentPokemon++;
  }
  isShiny = false; // Reset isShiny to false
  await renderPokemon(currentPokemon);
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

// Handle the "Random" button click
const handleRandom = async () => {
  const randomPokemonId = Math.floor(Math.random() * 1010) + 1;
  currentPokemon = randomPokemonId;
  isShiny = false; // Reset isShiny to false
  handleRoll();
  await renderPokemon(currentPokemon);
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

// Add event listeners
btn_prev.addEventListener('click', handlePrev);
btn_next.addEventListener('click', handleNext);
btn_random.addEventListener('click', handleRandom);
form.addEventListener('submit', handleSearch);
input_search.addEventListener('keydown', handleSecretCode);

// Render a random Pokemon on page load
handleRandom();
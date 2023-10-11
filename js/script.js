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


// Set API URL and initial Pokemon
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let currentPokemon = 1;

// Handle the "Toggle Shiny" button click
const toggleShinyButton = document.querySelector('#toggle-shiny');
let isShiny = false;

toggleShinyButton.addEventListener('click', async () => {
  const data = await fetchPokemon(currentPokemon);
  if (data === null) {
    // Handle error
  } else {
    isShiny = !isShiny;
    const pokemonImage = isShiny ? data.sprites.back_shiny : data.sprites.back_default;
    renderPokemonImage(pokemonImage);
  }
});

// Define the renderPokemonImage function
const renderPokemonImage = (imageUrl) => {
  const pokemonImage = document.querySelector('#pokemon-image');
  if (pokemonImage) { // Check if the element exists
    pokemonImage.src = imageUrl;
  }
};


// Render a random Pokemon
renderPokemon = async (pokemon) => {
  loading_image.style.display = 'block';
  pokemon_image.style.display = 'none';

  const data = await fetchPokemon(pokemon);
  if (data === null) {
    const healthBarHTML = createHealthBar(0, 0);
    document.querySelector('.health_bar_container').innerHTML = healthBarHTML;
  } else {
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
    const hasShiny = data.sprites.back_shiny !== null;
    renderPokemonData(pokemonData.name, pokemonData.types, hasShiny);
    const pokemonImage = data.sprites.back_default;
    renderPokemonImage(pokemonImage);
  }

  loading_image.style.display = 'none';
  pokemon_image.style.display = 'block';
};



// Define the fetchPokemon function
const fetchPokemon = async (pokemon) => {
  try {
    const response = await fetch(`${apiUrl}${pokemon}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
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

const init = async () => {
  const data = await fetchPokemon(currentPokemon);
  if (data === null) {
    // Handle error
  } else {
    const pokemonData = createPokemonData(data);
    const pokemonImage = data.sprites.back_default; // Get the back sprite of the Pokemon
    // Render the Pokemon data and image
    renderPokemonData(pokemonData.name, pokemonData.types);
    renderPokemonImage(pokemonImage);
  }
};

init();

// Update the DOM with Pokemon data and types
async function updatePokemonData(data) {
  const pokemonNumber = data.id.toString().padStart(3, '0');
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const pokemonImage = data.sprites.front_default;
  const pokemonTypes = data.types.map(type => type.type.name);

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

//make the width based on the pokemon's HP value (fetch the HP value from the api)
const createHealthBar = (pokemonHp, pokemonMaxHp) => {
  const healthPercentage = (pokemonMaxHp) ;
  const healthBarHTML = `
    <div class="health_bar" style=" width: ${healthPercentage}%; position: relative;">
      <div class="hp_text" style="">${pokemonHp} / ${pokemonMaxHp}</div>
    </div>
  `;
  return healthBarHTML;
};

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

// Render a random Pokemon
renderPokemon = async (pokemon) => {
  loading_image.style.display = 'block';
  pokemon_image.style.display = 'none';

  const data = await fetchPokemon(pokemon);
  if (data === null) {
    const healthBarHTML = createHealthBar(0, 0); // Pass 0 as the first parameter to display 0 HP
    document.querySelector('.health_bar_container').innerHTML = healthBarHTML;
  } else {
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
};





// Handle the "Next" button click
const handleNext = () => {
  if (currentPokemon === 1010) {
    currentPokemon = 1;
  } else {
    currentPokemon++;
  }
  renderPokemon(currentPokemon);
};

// Handle the "Previous" button click
const handlePrev = () => {
  if (currentPokemon === 1) {
    currentPokemon = 1010;
  } else {
    currentPokemon--;
  }
  renderPokemon(currentPokemon);
};

// Handle the search form submission
const handleSearch = async (event) => {
  event.preventDefault();
  const pokemon = input_search.value.toLowerCase();
  if (pokemon === 'secret') {
    alert('You found the secret!');
  } else {
    const data = await fetchPokemon(pokemon);
    if (data === null) {
      pokemon_name.innerHTML = 'Missingno';
      pokemon_number.innerHTML = '?';
      pokemon_image.src = 'images/missingno.png';
      pokemonTypes.innerHTML = 'N/A';
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

// Add event listeners
btn_prev.addEventListener('click', handlePrev);
btn_next.addEventListener('click', handleNext);
btn_random.addEventListener('click', handleRandom);
form.addEventListener('submit', handleSearch);
input_search.addEventListener('keydown', handleSecretCode);

// Render a random Pokemon on page load
renderPokemon(Math.floor(Math.random() * 1010) + 1);
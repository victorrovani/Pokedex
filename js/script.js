const pokemon_name = document.querySelector('.pokemon_name');
const pokemon_number = document.querySelector('.pokemon_number');
const pokemon_image = document.querySelector('.pokemon_image');
const pokemonTypes = document.querySelector('.pokemon_types');
const loading_image = document.querySelector('.loading_image');
const input_search = document.querySelector('.input_search');
const form = document.querySelector('.form');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');
const btn_random = document.querySelector('.btn-random');
const dice_image = document.querySelector('#dice-image');
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let currentPokemon = 1;

async function updatePokemonData(data) {
  const pokemonNumber = data.id.toString().padStart(3, '0');
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const pokemonImage = data.sprites.front_default;

  document.querySelector('.pokemon_number').textContent = pokemonNumber;
  document.querySelector('.pokemon_name').textContent = pokemonName;
  document.querySelector('.pokemon_image').src = pokemonImage;

  const types = await fetchPokemonTypes(data.id);
  if (types) {
    renderPokemonTypes(types);
  } else {
    document.querySelector('.pokemon_types').innerHTML = 'N/A';
  }
}

function updatePokemonData(data) {
  const pokemonNumber = data.id.toString().padStart(3, '0');
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const pokemonImage = data.sprites.front_default;
  const pokemonTypes = data.types.map(type => type.type.name);

  console.log('data.types:', data.types);
  console.log('pokemonTypes:', pokemonTypes);

  document.querySelector('.pokemon_number').textContent = pokemonNumber;
  document.querySelector('.pokemon_name').textContent = pokemonName;
  document.querySelector('.pokemon_image').src = pokemonImage;
  renderPokemonTypes(pokemonTypes); // Call renderPokemonTypes with the current Pokemon's types
}

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

const fetchPokemonTypes = async (pokemonId) => {
  try {
    const response = await fetch(`${apiUrl}${pokemonId}`);
    if (!response.ok) {
      throw new Error('N/A');
    }
    const data = await response.json();
    const types = data.types.map(type => type.type.name);

    console.log('data:', data);
    console.log('types:', types);

    return types;
  } catch (error) {
    console.error(error);
    return null;
  }
};



renderPokemonTypes(currentPokemon);


const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  if (!APIResponse.ok) {
    return null;
  }
  const data = await APIResponse.json();
  return data;
};
const renderPokemon = async (pokemon) => {
  loading_image.style.display = 'block';
  pokemon_image.style.display = 'none';

  const data = await fetchPokemon(pokemon);
  if (data === null) {
    pokemon_name.innerHTML = 'Missingno';
    pokemon_number.innerHTML = '?';
    pokemon_image.src = 'images/missingno.png';
    renderPokemonTypes(null); // Call renderPokemonTypes with null to display "N/A"
  } else {
    updatePokemonData(data); // Call updatePokemonData with the current Pokemon's data
  }

  loading_image.style.display = 'none';
  pokemon_image.style.display = 'block';
};

const handleNext = () => {
  if (currentPokemon === 1010) {
    currentPokemon = 1;
  } else {
    currentPokemon++;
  }
  renderPokemon(currentPokemon);
};

const handlePrev = () => {
  if (currentPokemon === 1) {
    currentPokemon = 1010;
  } else {
    currentPokemon--;
  }
  renderPokemon(currentPokemon);
};

const handleSearch = async (event) => {
  event.preventDefault();
  const pokemon = input_search.value.toLowerCase();
  if (pokemon === 'secret') {
    // Trigger special action here
    alert('You found the secret!');
  } else {
    const data = await fetchPokemon(pokemon);
    if (data === null) {
      pokemon_name.innerHTML = 'Missingno';
      pokemon_number.innerHTML = '?';
      pokemon_image.src = 'images/missingno.png';
    } else {
      currentPokemon = data.id;
      renderPokemon(currentPokemon);
    }
  }
};

const handleSecretCode = (event) => {
  const secretCode = 'Secret';
  const inputCode = event.target.value.toLowerCase();
  if (event.key === 'Enter' && inputCode === secretCode) {
    alert('Secret!');
  }
};

const handleRandom = async () => {
  const randomPokemonId = Math.floor(Math.random() * 1010) + 1;
  currentPokemon = randomPokemonId;
  handleRoll();
  await renderPokemon(currentPokemon);
};

const handleRoll = () => {
  const dice = dice_image; // The dice element
  const duration = 400; // Duration of the shaking animation in milliseconds
  const interval = 40; // Interval between position changes in milliseconds
  const startTime = Date.now(); // Start time of the shaking animation

  // Start the shaking animation
  const shakeInterval = setInterval(() => {
    const x = Math.random() * 10 - 5; // Random horizontal position change
    const y = Math.random() * 10 - 5; // Random vertical position change
    dice.style.transform = `translate(${x}px, ${y}px)`;
    const value = Math.floor(Math.random() * 6) + 1; // Random dice value between 1 and 6
    dice_image.src = `/images/dices/dice-${value}.svg`;
  }, interval);

  // Stop the shaking animation after the specified duration
  setTimeout(() => {
    clearInterval(shakeInterval);
    dice.style.transform = 'translate(0, 0)'; // Reset the dice position
  }, duration);
};

btn_prev.addEventListener('click', handlePrev);
btn_next.addEventListener('click', handleNext);
btn_random.addEventListener('click', handleRandom);
form.addEventListener('submit', handleSearch);

handleRandom();





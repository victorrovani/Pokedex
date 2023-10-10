const pokemon_name = document.querySelector('.pokemon_name');
const pokemon_number = document.querySelector('.pokemon_number');
const pokemon_image = document.querySelector('.pokemon_image');
const loading_image = document.querySelector('.loading_image');
const input_search = document.querySelector('.input_search');
const form = document.querySelector('.form');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');
const btn_random = document.querySelector('.btn-random');
const dice_image = document.querySelector('#dice-image');
let currentPokemon = 1;


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

    const missingnoImage = document.createElement('img');
    missingnoImage.setAttribute('src', 'images/missingno.png');
    missingnoImage.setAttribute('alt', 'Pokemon Image');
    missingnoImage.classList.add('missingno');
    pokemon_image_container.appendChild(missingnoImage);
  } else {
    pokemon_name.innerHTML = data.name;
    pokemon_number.innerHTML = data.id;
    pokemon_image.src = data.sprites.front_default;
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
  renderPokemon(randomPokemonId);
  // const random_dice = Math.floor(Math.random() * 6) + 1;
  // dice_image.src = `/images/dices/dice-${random_dice}.svg`;
  handleRoll()

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



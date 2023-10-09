const pokemon_name = document.querySelector('.pokemon_name');
const pokemon_number = document.querySelector('.pokemon_number');
const pokemon_image = document.querySelector('.pokemon_image');
const loading_image = document.querySelector('.loading_image');
const input_search = document.querySelector('.input_search');
const form = document.querySelector('.form');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');

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

btn_prev.addEventListener('click', handlePrev);
btn_next.addEventListener('click', handleNext);
form.addEventListener('submit', handleSearch);

renderPokemon(currentPokemon);
renderPokemon(currentPokemon);



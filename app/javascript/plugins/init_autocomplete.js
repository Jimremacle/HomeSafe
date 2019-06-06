import places from 'places.js';

const initAutocomplete = () => {
  const addressInput = document.getElementById('query');
  const addressInputStart = document.getElementById('query_start');
  const addressInputEnd = document.getElementById('query_end');
  if (addressInput && addressInputStart && addressInputEnd) {
    places({ container: addressInput });
    places({ container: addressInputStart });
    places({ container: addressInputEnd });
  }
};

export { initAutocomplete };

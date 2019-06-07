import places from 'places.js';

const initAutocomplete = () => {

  const addressInput = document.getElementById('report_address');
  if (addressInput) {
    places({ container: addressInput });
  };

  // const addressInput = document.getElementById('query');
  const addressInputStart = document.getElementById('query_start');
  const addressInputEnd = document.getElementById('query_end');
  if (addressInputStart && addressInputEnd) {
    // places({ container: addressInput });
    places({ container: addressInputStart });
    places({ container: addressInputEnd });
  }

};

const addressUpdate = document.getElementById('user_frequent_address');
if (addressUpdate) {
  places({ container: addressUpdate });
};

export { initAutocomplete };

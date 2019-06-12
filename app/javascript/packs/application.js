import  "bootstrap";
import  { initAutocomplete } from '../plugins/init_autocomplete';
import  { initMap } from '../plugins/init_heremap';
import  { browserLocation } from '../plugins/get_location';
import "../plugins/flatpickr";

initAutocomplete();
initMap();
browserLocation();

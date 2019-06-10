import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // Note this is important!

const dateInput = document.getElementById("report_occurence_timedate");
  if(dateInput) {
    flatpickr(dateInput, {enableTime: true,
    dateFormat: "Y-m-d H:i",});
  };

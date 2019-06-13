
function browserLocation() {
  const target = document.getElementById("distress");
  target.addEventListener("click", getLocation);
}

  function getLocation(event) {
    console.log(event);
    event.preventDefault();
    if (navigator.geolocation) {
      setTimeout(function(){
        navigator.geolocation.getCurrentPosition(showPosition, error, options);
        console.log(showPosition);
      }, 1000);
      // navigator.geolocation.getCurrentPosition(showPosition, error, options);
      // console.log(showPosition);
    } else {
      target.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    const button = document.getElementById("distress");
    const content = button.getAttribute("href");
    const coords = `?coords=[${position.coords.latitude},${position.coords.longitude}]`;
    window.location.href = content + coords;
  }

  function error(err) {
    alert(`ERREUR ${err.message}`);
  }

  const options = {
    enableHighAccuracy: true,
    setTimeout: 5000
  }
  // function showPosition(position) {
  //   var latlon = position.coords.latitude + "," + position.coords.longitude;

  //   var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=
  //   "+latlon+"&zoom=14&size=400x300&sensor=false&key=YOUR_:KEY";

  //   document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
  // }

export { browserLocation }

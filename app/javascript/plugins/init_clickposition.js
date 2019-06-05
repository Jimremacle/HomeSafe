/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map displays an alert box containing the latitude and longitude
 * of the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.

  let oldMarker = 0;

  map.addEventListener('tap', function (evt) {

    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    console.log(oldMarker);
    if (oldMarker !== 0) {
      map.removeObject(oldMarker)
      };
    const marker = new H.map.Marker(coord);
    console.log(marker);
    oldMarker = marker;

     map.addObject(marker);






    // alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
    //     ((coord.lat > 0) ? 'N' : 'S') +
    //     ' ' + Math.abs(coord.lng.toFixed(4)) +
    //      ((coord.lng > 0) ? 'E' : 'W'));
  });
}

export { setUpClickListener };


// Create an icon, an object holding the latitude and longitude, and a marker:




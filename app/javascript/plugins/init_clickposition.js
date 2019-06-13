/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map displays an alert box containing the latitude and longitude
 * of the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setUpClickListener(map, ui) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.


  let oldBubble = 0;

  map.addEventListener('tap', function (evt) {

    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    //console.log(oldMarker);

    if (oldBubble !== 0) {
       ui.removeBubble(oldBubble)
      };

    const bubble = new H.ui.InfoBubble(coord, { content: `<button type="button" class="btn btn-primary popup-report" data-toggle="modal" data-target="#exampleModalCenter" data-coord=${coord}>
            Report
          </button></div>` })

const repAddress = document.getElementById('report_address');
// console.log(repAddress);
repAddress.value = coord;

// var coordinates = coord.to_s.slice(7, 34);
// const coord_array = coord.split(" ");
// console.log(coord_array);
// const longitude = coord_array[0].to_f
// const latitude =  coord_array[1].to_f
// const address = Geocoder.search([@latitude, @longitude]).first.address
// const report.address = @address

    ui.addBubble(bubble)

    oldBubble = bubble;

  });
}

export { setUpClickListener };

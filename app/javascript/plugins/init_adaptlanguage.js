/**
 * Switches the map language to simplified Chinese
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 * @pama   {H.service.Platform} platform    A stub class to access HERE services
 */
function switchMapLanguage(map, platform){
  var mapTileService = platform.getMapTileService({
      type: 'base'
    }),
    // Our layer will load tiles from the HERE Map Tile API
    chineseMapLayer = mapTileService.createTileLayer(
      'maptile',
      'normal.day',
      pixelRatio === 1 ? 256 : 512,
      'png8',
      {lg: 'CHI', ppi: pixelRatio === 1 ? undefined : 320}
    );
  map.setBaseLayer(chineseMapLayer);

  // Display default UI components on the map and change default
  // language to simplified Chinese.
  // Besides supported language codes you can also specify your custom translation
  // using H.ui.i18n.Localization.
  var ui = H.ui.UI.createDefault(map, defaultLayers, 'zh-CN');

  // Remove not needed settings control
  ui.removeControl('mapsettings');
}

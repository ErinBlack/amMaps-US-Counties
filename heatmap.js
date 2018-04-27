// svg path for target icon
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

AmCharts.ready(function() {
    console.log('in AmCharts Ready');
    var select = document.getElementById( 'cities' );
    map = new AmCharts.AmMap();

    var dataProvider = {
        mapVar: AmCharts.maps.usCounties,
        images: [],
        areas: []
    }; // end dataProvider

    map.areasSettings = {
        autoZoom: true
    };

    map.addClassNames = {
        addClassNames: true
    };

    map.dataProvider = dataProvider;
    map.write("mapdiv");
    map.currentZoom = {
       "zoomLevel": map.zoomLevel(),
       "zoomLongitude": map.zoomLongitude(),
       "zoomLatitude": map.zoomLatitude()
   };

   addCity();
}); //end AmCharts.ready


// Add Cities to the Map
function addCity (){
    console.log('in add city');
    console.log('map.dataProvider.images', map.dataProvider.images);
    for ( var x in cities ) {
        var city = new AmCharts.MapImage();
          city.title = cities[x].city;
          city.latitude = cities[x].lat;
          city.longitude = cities[x].lng;
          city.countyFips = cities[x].county_fips;
          city.svgPath = targetSVG;
          city.zoomLevel = 5;
          city.scale = 0.5;
          city.chart = map;
          map.dataProvider.images.push( city );
         city.validate();
     } // end for loop
     console.log('map.dataProvider.images', map.dataProvider.images);
} // end addCity

$(function() {
    // Find the value of the selected industry dropdown
    $("#industiesSelect").change(function() {
        var id= $(this).children(":selected").attr("id");
        displayProviders(id);
        statesDropdown();
    }); // end industriesSelect

    // Find the id of the selected state dropdown
    $("#statesSelect").change(function() {
        var id = $(this).children(":selected").attr("id");
        cityDropdown(id);
    });// end statesSelect

    // Find the id of the selected state dropdown
    $("#citiesSelect").change(function() {
        addCity ();
        var selectBox = document.getElementById("citiesSelect");
        var selectedValue = selectBox.options[selectBox.selectedIndex ].value;
            // Match selected city with matching img by countyFips value
            function selectedImage(selectedValue){
                for (var i = 0; i < map.dataProvider.images.length; i++) {
                    var selectedImg = map.dataProvider.images[i];
                    var countyFips = selectedImg.countyFips;
                    if (countyFips == selectedValue){
                        var selectedImgZoom =  selectedImg.zoomLevel;
                        var selectedImgLat =  selectedImg.latitude;
                        var selectedImgLong =  selectedImg.longitude;
                        map.zoomToLongLat(selectedImgZoom, selectedImgLong, selectedImgLat, false);
                        return;
                    }
                } //
            } // end selectedImage
            selectedImage(selectedValue);
    }); // end citiesSelect

});

// svg path for target icon
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

AmCharts.ready(function() {
    industriesDropdown();
    var select = document.getElementById( 'cities' );
    map = new AmCharts.AmMap();

    map.colorSteps = 10;

    var dataProvider = {
        mapVar: AmCharts.maps.usCounties,
        images: [],
        areas: []
    }; // end dataProvider

    map.zoomControl = {
        buttonFillColor: '#5BC1A6',
        buttonIconColor: '#ffffff',
        homeButtonEnabled: true,
        homeIconColor: '#ffffff'
    };

    map.areasSettings = {
        autoZoom: true,
        color: "#b3e1eb",
        colorSolid: "#029bbd",
        outline: false,
        outlineAlpha: 0
    };

    map.imagesSettings = {
        color: '#707070'
    };

    map.addClassNames = {
        addClassNames: true
    };

    map.valueLegend = {
        right : 10,
        minValue : '<1',
        maxValue : '250+',

    };

    map.dataProvider = dataProvider;
    map.write("mapdiv");
    map.currentZoom = {
       "zoomLevel": map.zoomLevel(),
       "zoomLongitude": map.zoomLongitude(),
       "zoomLatitude": map.zoomLatitude()
   };

}); //end AmCharts.ready


// Add Cities to the Map
function addCity (){
    for ( var x in cities ) {
        var city = new AmCharts.MapImage();
          city.title = cities[x].city;
          city.latitude = cities[x].lat;
          city.longitude = cities[x].lng;
          city.countyFips = cities[x].county_fips;
          city.svgPath = targetSVG;
          city.zoomLevel = 9;
          city.scale = 0.5;
          city.chart = map;
          map.dataProvider.images.push( city );
         city.validate();
     } // end for loop
} // end addCity


// Populating Industries Dropdown
function industriesDropdown() {
    var select = document.getElementById( 'industiesSelect' );
    for ( var x in providers.categories ) {
      var category = providers.categories;
      var option = document.createElement( 'option' );
      option.value = category[ x ].type_of_work_name;
      option.id = x;
      option.text = category[ x ].type_of_work_name;
      select.appendChild( option );
  } // end for loop
} // end industriesDropdown

// Populating the States Dropdown Menu
function statesDropdown(){
  var select = document.getElementById( 'statesSelect' );
  for ( var x in states ) {
    var option = document.createElement( 'option' );
    var stateName = states[ x ].state_name;
    var stateId = states[ x ].state_id;
    option.id = stateId;
    option.value = stateId;
    option.text = stateName;
    select.appendChild( option );
  } // end for loop
} // end stateDropdown

// Populating Dropdown with all Cities
function cityDropdown (stateId){
    var select = document.getElementById( 'citiesSelect' );
    $('#citiesSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="">- Select a City -</option>')
    for ( var x in cities ) {
        if(cities[x].state_id == stateId) {
            var option = document.createElement( 'option' );
            option.value = cities[ x ].county_fips;
            option.text = cities[ x ].city + ', '+ cities[ x ].state_id ;
            select.appendChild( option );
        }
  } // end for loop
} // end cityDropdown

// Display all Providers on the Counties map
function displayProviders(id){
    map.dataProvider.areas = [];
    var indData = providers.categories[id].counties;
    for(var x in indData){
        var providerToAdd = new AmCharts.MapArea();
        var fipsLength = indData[x].county_fips.toString().length;
        if(fipsLength <= 4) {
            providerToAdd.id = 'C0' + indData[x].county_fips;
        }
        else{
            providerToAdd.id = 'C' + indData[x].county_fips;
        }
        providerToAdd.value = indData[x].providers / 20;
        providerToAdd.title = '<strong>' + indData[x].county + ' County, '+ indData[x].state + '</strong> </br> <strong>Providers: </strong>' + indData[x].providers;
        providerToAdd.chart = map.dataProvider;
        map.dataProvider.areas.push(providerToAdd);
    }
    map.validateData();

} // end displayProviders

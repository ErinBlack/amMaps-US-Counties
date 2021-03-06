$(function() {
    // Find the value of the selected industry dropdown
    $("#industiesSelect").change(function() {
        var id= $(this).children(":selected").attr("id");
        MapHelpers.displayProviders(id);
        MapHelpers.statesDropdown();
    }); // end industriesSelect

    // Find the id of the selected state dropdown
    $("#statesSelect").change(function() {
        var stateId = $(this).children(":selected").attr("id");
        MapHelpers.zoomState(stateId);
        MapHelpers.citiesDropdown(stateId);
    });// end statesSelect

    // Find the id of the selected state dropdown
    $("#citiesSelect").change(function() {
        MapHelpers.addCity();
        var selectBox = document.getElementById("citiesSelect");
        var selectedValue = selectBox.options[selectBox.selectedIndex ].value;
        MapHelpers.zoomCity(selectedValue);
    }); // end citiesSelect
});

// svg path for target icon
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

AmCharts.ready(function() {
    MapHelpers.industriesDropdown();
    var select = document.getElementById( 'cities' );
    map = new AmCharts.AmMap();

    map.colorSteps = 10;

    var dataProvider = {
        mapVar: AmCharts.maps.usCounties,
        images: [],
        areas: [{
            "id": "US",
            "outline": true,
            "outlineColor": "#707070",
            "outlineThickness": 1,
            "outlineAlpha": 0.3
          }]
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
        outline: true,
        outlineAlpha: 0
    };

    map.imagesSettings = {
        color: '#707070',

    };

    map.addClassNames = {
        addClassNames: true
    };

    map.valueLegend = {
        right : 10,
        minValue : '1',
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

var MapHelpers = {
    // Adding City Images to the Map
    addCity : function(){
        for ( var x in cities ) {
            var city = new AmCharts.MapImage();
              city.title = '<strong>' + cities[x].city + ', ' + cities[x].state_id + '</strong>';
              city.latitude = cities[x].lat;
              city.longitude = cities[x].lng;
              city.countyFips = cities[x].county_fips;
              city.svgPath = targetSVG;
              city.zoomLevel = 9;
              city.scale = 0.6;
              city.rollOverScale = 2;
              city.chart = map;
              map.dataProvider.images.push( city );
             city.validate();
         } // end for loop
    },
    //  Adding options to the industries dropdown
    industriesDropdown : function(){
        var select = document.getElementById( 'industiesSelect' );
        for ( var x in providers.categories ) {
          var category = providers.categories;
          var option = document.createElement( 'option' );
          option.value = category[ x ].type_of_work_name;
          option.id = x;
          option.text = category[ x ].type_of_work_name;
          select.appendChild( option );
      } // end for loop
  },
  // adding options to the state dropdown
    statesDropdown : function(){
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
    },
    // adding options to the cities dropdown
    citiesDropdown : function(stateId){
        var select = document.getElementById( 'citiesSelect' );
        $('#citiesSelect')
          .find('option')
          .remove()
          .end()
          .append('<option value=""></option>');
        for ( var x in cities ) {
          if(cities[x].state_id == stateId) {
              var option = document.createElement( 'option' );
              option.value = cities[ x ].county_fips;
              option.text = cities[ x ].city + ', '+ cities[ x ].state_id ;
              select.appendChild( option );
          }
        } // end for loop
    },
    // creates areas of all provider totals to add to the map
    displayProviders : function(id){
        map.dataProvider.areas = [{
            "id": "US",
            "outline": true,
            "outlineColor": "#707070",
            "outlineThickness": 1,
            "outlineAlpha": 0.3
          }];
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
        map.validateData(); // needed to refresh map
    },
    // zoom in on state when selected from dropdown
    zoomState : function(stateId){
        for(var x in states){
            if(states[x].state_id == stateId){
                var stateLat = states[x].lat;
                var stateLong = states[x].long;
                map.zoomToLongLat(5, stateLong, stateLat, false);
                return;
            }
        }
    },
    // zoom into city when selected from dropdown
    zoomCity : function(selectedValue){
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
        } //end for loop
    }
}; //end MapHelpers

'Use strict'



const BikeMap = (function() {

    document.getElementById("selContinents").innerHTML = "?";
    let inputElem = document.getElementById("input");

    const url = 'https://api.citybik.es/v2/networks';
    let myLatLng;
    let BikeNetwork = [];



    //Get the value of clicked button using jquery and call BikeMap.getCities with parameter value
    $(document).ready(function() {
        $('#europe').click(function() {
            // alert($(this).attr("value"));
            let value = $(this).attr("value");
            BikeMap.getCities($(this).attr("value"))
                // BikeMap.getCities(value);
                // alert(value)
        });
    });
    $(document).ready(function() {
        $('#america').click(function() {
            // alert($(this).attr("value"));
            let value = $(this).attr("value");
            BikeMap.getCities($(this).attr("value"))
                // BikeMap.getCities(value);
                // alert(value)

        });
    });




    // Google map call to define google
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCpCilSrre3u5TACGa1XjkVHCWGiBDZZ5o&callback=?',
        dataType: 'json',
        jsonCallback: 'BikeMap'
    })


    let countries = [];

    return {

        getCities: (value) => {

            if (value == "americas") {
                document.getElementById("selContinents").innerHTML = "North and South America";

            } else {
                document.getElementById("selContinents").innerHTML = "Europe";

            }

            // Call to RESTful COUNTRIES API with callback function that returns objects in JSON format. 
            $.get("https://restcountries.eu/rest/v2/region/" + value, (country) => {
                    // console.log(country);
                    console.log("success");
                })
                .done(function(country) {
                    console.log("finished");
                    for (prop in country) {
                        // console.log(country[prop].alpha2Code);
                        countries.push(country[prop].alpha2Code);
                    }
                    BikeMap.appendList();
                }).fail(function() {
                    console.log("error");
                    $('input[type=text]').attr('placeholder', 'Could not load cities :(');
                }).always(function() {
                    console.log("finished");
                });

        },

        // appendList: (countries) => {
        appendList: () => {

            // console.log(countries);

            // Call to CityBikes API with callback function. Returns all bikeNetwork objects in JSON format
            $.get(url, (companies) => {


                    // console.log(country);
                    console.log("success");
                })
                .done(function(companies) {
                    console.log("finished");
                    console.log(companies);

                    $('input[type=text]').attr('placeholder', 'Select city from list');
                    BikeNetwork = companies;

                    // let selCityElem = document.getElementById("selCity");
                    let selCityElem = document.getElementById("options");
                    selCityElem.innerHTML = "";
                    for (prop in companies) {

                        const arr = companies[prop];

                        for (var i = 0; i < arr.length; i++) {

                            let location = arr[i].location;
                            let code = location.country;
                            //jQuery utility function to find whether an element exist in array or not
                            if ($.inArray(code, countries) != -1) {

                                //Sets the select option values to each city's name 
                                selCityElem.innerHTML += `<option value="${location.city}" label="${location.city}">${arr[i].id}</option>`;
                            }


                        }


                        /**
                         * jQuery plugin to sort values alphabetically in select
                         * source: http://stackoverflow.com/questions/45888/what-is-the-most-efficient-way-to-sort-an-html-selects-options-by-value-while
                         */

                        $.fn.sort_select_box = function() {
                            // Get options from select box
                            let my_options = $("#" + this.attr('id') + ' option');
                            // sort alphabetically
                            my_options.sort(function(a, b) {
                                    if (a.value > b.value) return 1;
                                    else if (a.value < b.value) return -1;
                                    else return 0
                                })
                                //replace with sorted my_options;
                            $(this).empty().append(my_options);

                            // clearing any selections
                            $("#" + this.attr('id') + "option").attr('selected', false);
                        }

                        $('#options').sort_select_box();

                    }
                })
                .fail(function() {
                    console.log("error");
                    $('input[type=text]').attr('placeholder', 'Could not load cities :(');
                })
                .always(function() {
                    console.log("finished");
                });

        },


        getBikeDetails: () => {

            //Get value from selected option for Safari
            const x = document.getElementById("options").selectedIndex;
            let selCityId = document.getElementsByTagName("option")[x].text;

            // Get value from selected option in dataList
            // for Chrome
            for (var i = 0; i < document.getElementById('options').options.length; i++) {
                if (document.getElementById('options').options[i].value == document.getElementsByName("selCity")[0].value) {
                    // alert(document.getElementById('options').options[i].value);
                    selCityId = document.getElementById('options').options[i].text;

                    break;
                }
            }

            // alert(selCityId);

            let lat;
            let lng;
            for (prop in BikeNetwork) {
                let arr = BikeNetwork[prop];

                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].location.city == selCityId) {
                        lat = arr[i].location.latitude;
                        lng = arr[i].location.longitude;
                        // console.log(lat, lng);
                        myLatLng = { lat: lat, lng: lng };
                    }
                }

            }

            BikeMap.initMap(selCityId);



        },


        initMap: (selCityStations) => {


            // alert(selCityStations);
            $.get(url + '/' + selCityStations, (response) => {
                console.log("stations", response);
                let locations = [];
                for (prop in response) {

                    const stations = response[prop].stations;
                    for (let i = 0; i < stations.length; i++) {
                        locations.push([stations[i].latitude, stations[i].longitude, stations[i].name, stations[i].free_bikes]);

                    }
                }

                var styledMapType = new google.maps.StyledMapType(
                    [{
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#f5f5f5"
                            }]
                        },
                        {
                            "elementType": "labels.icon",
                            "stylers": [{
                                "visibility": "off"
                            }]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#616161"
                            }]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [{
                                "color": "#f5f5f5"
                            }]
                        },
                        {
                            "featureType": "administrative.land_parcel",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#bdbdbd"
                            }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#eeeeee"
                            }]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#757575"
                            }]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#e5e5e5"
                            }]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#9e9e9e"
                            }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#ffffff"
                            }]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#757575"
                            }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#dadada"
                            }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#616161"
                            }]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#9e9e9e"
                            }]
                        },
                        {
                            "featureType": "transit.line",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#e5e5e5"
                            }]
                        },
                        {
                            "featureType": "transit.station",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#eeeeee"
                            }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [{
                                "color": "#c9c9c9"
                            }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "labels.text.fill",
                            "stylers": [{
                                "color": "#9e9e9e"
                            }]
                        }
                    ], {
                        name: 'Styled Map'
                    });


                var bounds = new google.maps.LatLngBounds();
                // Displays a map in the map element
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    center: myLatLng,

                    mapTypeControlOptions: {
                        mapTypeIds: ['roadmap', 'satellite', 'hybrid',
                            'styled_map'
                        ]
                    }

                });


                //Associate the styled map with the MapTypeId and set it to display.
                map.mapTypes.set('styled_map', styledMapType);
                map.setMapTypeId('styled_map');

                var infowindow = new google.maps.InfoWindow(),
                    marker;

                // Display multiple markers on a map
                for (var i = 0; i < locations.length; i++) {
                    console.log(locations[i])
                    var position = new google.maps.LatLng(locations[i][0], locations[i][1]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map
                    });
                    // Attaches an info window to a marker with the provided message. When the
                    // marker is clicked, the info window will open with the set values.
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {

                        return function() {
                            infowindow.setContent("Get your bike at: " + locations[i][2] + "<br> Bikes available: " + locations[i][3]);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));

                }
                // Automatically center the map fitting all markers on the map screen
                map.fitBounds(bounds);

            });
            document.getElementById("input").addEventListener("click", BikeMap.deleteVal);
        },
        //Clear the input field when clicked
        deleteVal: () => {

            inputElem.value = "";

        },

        init: () => {

            document.getElementById("input").addEventListener("change", BikeMap.getBikeDetails);

        }
    }

})();


BikeMap.init();
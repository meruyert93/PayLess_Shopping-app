let markers = [];
let infoWindow;
let map;

/**Connecting Map Location API  */
/*Creating google map*/
function initMap() {
    // The location of Munich
    const munich = { lat: 48.137154, lng: 11.576124 };
    // The map, centered at Munich
    map = new google.maps.Map(document.getElementById("map"), {
    //  maxZoom: 20,
        center: munich,
    });
    infoWindow = new google.maps.InfoWindow()
}

searchMarketsNear('München, Deutschland');

/*Triggering Button when Enter is pressed */
function triggerBtn() {
    input = document.getElementById('inputValue');
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("myBtn").click();
        }
    });
}

/*Searching markets by ZIP code or region */
function searchMarketsNear(searchedPlace) {
    input = document.getElementById('inputValue').value;
    if (input !== null && input !== '') {
        searchedPlace = input;
    } else {
        searchedPlace = 'München, Deutschland';
    }
    
    const LocationApiUrl = `https://www.edeka.de/api/marketsearch/markets?searchstring=${searchedPlace}&size=124`;
    fetch(LocationApiUrl)
        .then(response => response.json())
        .then(data => {
            /*Calling functions */
            clearLocations()
            displayStores(data);
            showStoresMarker(data);
            setOnClickListener();
            autoCompleteInSearch()
            triggerBtn();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

let storesHTML = "";
let nameSupermarket;
let addressSupermarket;
let zipCodeSupermarket;
let citySupermarket;
let urlSupermarket;
let phoneSupermarket;

/*Displaying Supermarkets as a list in the container */
function displayStores(data) {
    for ( let i = 0; i < data.markets.length; i++) {
        nameSupermarket = data.markets[i].name;
        addressSupermarket = data.markets[i].contact.address.street;
        zipCodeSupermarket = data.markets[i].contact.address.city.zipCode;
        citySupermarket = data.markets[i].contact.address.city.name;
        urlSupermarket = data.markets[i].url;
        phoneSupermarket = data.markets[i].contact.phoneNumber;

        storesHTML +=  `
            <div class="store-container">
                <div class="store-info-container">
                    <div class="store-name font-weight-bold text-large">
                        <span>${nameSupermarket}</span>
                    </div>
                    <div class="store-address">
                        <span>${addressSupermarket},</span>
                        <span>${zipCodeSupermarket} ${citySupermarket}</span>
                    </div>
                    <div class="store-opening-hours">
                        <span class="font-weight-bold">Opening times:</span> <span> Weekday from 07:00 to 20:00 </span>
                    </div>
                    <div class="store-phone-number">
                        ${phoneSupermarket}
                    </div>
                </div>
                <div class="store-number-container">
                    <div class="website"> 
                        <span>
                            <a href="${urlSupermarket}"><i class="fa fa-globe fa-2x"></i></a>
                        </span>
                    </div>
                    <div class = "store-number">
                        
                        ${i + 1} 

                    </div>
                </div>
            </div>
            `;
    };
    document.querySelector('.stores-list').innerHTML = storesHTML;  
};

/* Showing Supermarket Markers on the Google Map */
function showStoresMarker(data) {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < data.markets.length; i++){
        let Lat = data.markets[i].coordinates.lat;
        let lon = data.markets[i].coordinates.lon;
        let latLng = new google.maps.LatLng(Lat, lon);
        let position = i + 1;
        nameSupermarket = data.markets[i].name;
        addressSupermarket = data.markets[i].contact.address.street;
        phoneSupermarket = data.markets[i].contact.phoneNumber;
        bounds.extend(latLng);
    
        createMarker(latLng, nameSupermarket, addressSupermarket, phoneSupermarket, position);
    }
    map.fitBounds(bounds);
}

/*Creating Markers to display them on the Google map */
function createMarker(latlng, nameSupermarket, addressSupermarket, phoneSupermarket, position) {
    let html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${nameSupermarket}
            </div>
            <div class="store-info-status">
            Open until 8:00 PM
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fa fa-location-arrow"></i>
                </div>
                ${addressSupermarket}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fa fa-phone"></i>
                </div>
                ${phoneSupermarket}
            </div>
        </div>
        `;
    let marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: `${position}`
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    } )

    markers.push(marker);

};

/*Triggering Info Window on the google map */
function setOnClickListener() {
    const storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

function autoCompleteInSearch()  {
    let input = document.getElementById('inputValue');
    let autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
};

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    }
    markers.length = 0;
}

/**ATTENTION! CODE belo is just temporary stored, it will be deleted */

/**Temporary stored commented code for future using to display wether the store open or now */
    // const options = { weekday: 'long' };
    // var today = new Date().toLocaleTimeString('en-DE', options);
    // console.log(today);
    // if (today == object.markets[0].businessHours.sunday) {
    //     console.log('Currently open')
    // } else {
    //     console.log('Currently closed')
    // }

// function searchstores(data) {
//     // let foundStores = [];
//     let inputValue = document.getElementById('inputValue').value;
//     // console.log(inputValue);
//     for (let i = 0; i < data.markets.length; i++) {
//     }
// };

// function processButtonSearch() {
//     let button = document.getElementById('searchbutton');
//         button.addEventListener('click', function() {
//             geocodeAddress(map);
//         });       
//     };
    
// function geocodeAddress(resultsMap) {
//     const geocoder = new google.maps.Geocoder();
//     var address = document.getElementById('inputValue').value;
//     geocoder.geocode({'address': address}, function(results, status) {
//         if (status === 'OK') {
//             resultsMap.setCenter(results[0].geometry.location);
//             // new google.maps.Marker({
//             //   map: resultsMap,
//             //   position: results[0].geometry.location
//             // });
//         } else {
//             alert('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }

/**part of the Function for autoCompleteInSearch()  */
   // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    //     autocomplete.addListener("places_changed", function () {
    //     let place = autocomplete.getPlaces();
    //     if (!place.geometry) {
    //         window.alert("Autocomplete's returned place contains no geomtery");
    //         return;
    //     }
    //     //if the place has a geometry,then present it on a map
    //     if(place.geometry.viewport) {
    //         map.fitBounds(place.geometry.viewport);
    //     } else {
    //         map.setCenter(place.geometry.location);
    //         map.setZoom(17);
    //     }
    // });
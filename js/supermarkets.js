let markers = [];
let infoWindow;
let map;
let input = document.getElementById('inputValue');

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

/*Triggering Function when Enter is pressed */
input.addEventListener("keyup", function(e) {
    if (e.key === 'Enter' && input.value !== '') {
        searchMarketsNear(input.value);
    }
});

//Adding eventListener to Input
input.addEventListener('input', function() {
    searchMarketsNear(input.value);
});

/*Searching markets by ZIP code or region */
function searchMarketsNear(searchedPlace) {
    const locationApiUrl = `https://www.edeka.de/api/marketsearch/markets?searchstring=${searchedPlace}&size=124`;
    fetch(locationApiUrl)
        .then(response => response.json())
        .then(data => {
            /*Calling functions */
            clearLocations()
            displayStores(data);
            showStoresMarker(data);
            setOnClickListener();
            autoCompleteInSearch()
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
                            <a href="${urlSupermarket}" target="_blank"><i class="fa fa-globe fa-2x"></i></a>
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
    let autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);
};

function clearLocations() {
    infoWindow.close();
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
    }
    markers = [];
    storesHTML = [];
};
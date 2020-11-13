//Animation text
var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };



//API connection
const contentDiv = document.getElementById('content');
const apiUrl = 'https://www.edeka.de/eh/service/eh/offers';

fetch(apiUrl)
  .then(response => response.json())
  .then(content => {
    //   console.log(content);
      let htmlRepresentation = "";  
      content.docs.forEach(element => {
        htmlRepresentation += `
        
 

        <div class="item">
            <div class="class="col-sm-12 col-lg-6">
                <div class="card h-100" style="width: 18rem;">
                    <img src=${element.bild_app} class="card-img-top"  alt="Card image cap">
                    <div class="card-body">
                    <h5 class="card-title">${element.titel}</h5>
                    <p class="card-text">${element.beschreibung}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item font-weight-bold">Price: <span class="text-danger h4">${element.preis} Euro</span></spand></li>
                    <li class="list-group-item text-muted">Basic Price: <span class="text-danger">${element.basicPrice}</span></spand></li>
                    </ul>
                    <div class="card-body">
                    <a href="#" class="card-link">Add to Basket</a>
                    </div>
                </div>
            </div>
        </div>
       

      `;
      });

      return htmlRepresentation;
  })
  .then(htmlRepresetation =>{
       
            contentDiv.innerHTML = htmlRepresetation;
        

                //Owl Carousel Creation
                $('.owl-carousel').owlCarousel({
                    autoplay: true,
                    autoplayHoverPause: true,
                    margin: 10,
                    stagePadding: 5,
                    nav: true,
                    loop: true,
                    navText: [
                        "<i class='fa fa-chevron-left fa-2x'></i>",
                        "<i class='fa fa-chevron-right fa-2x'></i>"
                     ],
                    responsive:{
                        0: {
                            items: 1,
                        }, 
                        485: {
                            items: 2,
                        },
                        728: {
                            items:3,
                            
                        },
                        960: {
                            items:3,
                        },
                        1200: {
                            items:5,
                        }
                    }
                    
                });

                $('owl-carousel').on('mousewheel', 'owl-stage', function(e){
                    if(e.deltaY>0) {
                        $('.owl-carousel').trigger('next-owl');
                    } else  {
                        $('owl-carousel').trigger('prev.owl');
                    }
                    e.preventDefault();
                });

            console.log(htmlRepresetation);
        
    });
    let markers = [];
    let infoWindow;
    var map;
  /**Connecting Map Location API  */
        /*Creating google map*/
        function initMap() {
            // The location of Munich
            const munich = { lat: 48.137154, lng: 11.576124 };
            // The map, centered at Munich
            map = new google.maps.Map(document.getElementById("map"), {
              zoom: 15,
              center: munich,
            });
            infoWindow = new google.maps.InfoWindow()
    
        }

const LocationApiUrl = 'https://www.edeka.de/api/marketsearch/markets?searchstring=Munchen&size=124';

fetch(LocationApiUrl)
    .then(response => response.json())
    .then(data => {
        
        let storesHTML = "";
        let nameSupermarket;
        let addressSupermarket;
        let zipCodeSupermarket;
        let citySupermarket;
        let urlSupermarket;
        let phoneSupermarket;
        
        for ( var i = 0; i < data.markets.length; i++) {

            nameSupermarket = data.markets[i].name;
            addressSupermarket = data.markets[i].contact.address.street;
            zipCodeSupermarket = data.markets[i].contact.address.city.zipCode;
            citySupermarket = data.markets[i].contact.address.city.name;
            urlSupermarket = data.markets[i].url;
            phoneSupermarket = data.markets[i].contact.phoneNumber;

            // console.log(phoneSupermarket);
            // console.log(urlSupermarket);
            // console.log(citySupermarket);
            // console.log(zipCodeSupermarket);
            // console.log(addressSupermarket);
            // console.log(nameSupermarket);
 
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

        }
        //  Object.entries(object).forEach(function(object) {
        //      console.log(object);
        //  });
        
        // const options = { weekday: 'long' };
        // var today = new Date().toLocaleTimeString('en-DE', options);
        // console.log(today);

        // if (today == object.markets[0].businessHours.sunday) {
        //     console.log('Currently open')
        // } else {
        //     console.log('Currently closed')
        // }
       
        document.querySelector('.stores-list').innerHTML = storesHTML;   

        var markers = [];
        
        function showStoresMarker() {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < data.markets.length; i++){
                var Lat = data.markets[i].coordinates.lat;
                var lon = data.markets[i].coordinates.lon;
                var latLng = new google.maps.LatLng(Lat, lon);
                var position = i + 1;
                nameSupermarket = data.markets[i].name;
                addressSupermarket = data.markets[i].contact.address.street;
                phoneSupermarket = data.markets[i].contact.phoneNumber;
                bounds.extend(latLng);
                createMarker(latLng, nameSupermarket, addressSupermarket, phoneSupermarket, position);
            }

            map.fitBounds(bounds);
        }
    
        function createMarker(latlng, nameSupermarket, addressSupermarket, phoneSupermarket, position) {
            var html = `
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
            
            var marker = new google.maps.Marker({
                map: map,
                position: latlng,
                label: `${position}`
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(html);
                infoWindow.open(map, marker);
            } )

            markers.push(marker);
            console.log(markers);


        };
        showStoresMarker();
        
    } );     
    

  
    
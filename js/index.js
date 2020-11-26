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

//API connection for products from EDEKA
const contentDiv = document.getElementById('content');
const apiUrl = 'https://www.edeka.de/eh/service/eh/offers';
let htmlRepresentation = ""; 

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        displayProducts(data)
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function displayProducts(data) {
    data.docs.forEach(element => {
        htmlRepresentation += `
        <div class="item">
            <div class="card-group" style="height: 69vh">
                <div class="card h-100" style="width: 18rem;">
                    <img src=${element.bild_app} class="card-img-top"  alt="Card image cap">
                    <div class="card-body scroll h-100">
                    <h5 class="card-title">${element.titel}</h5>
                    <p class="card-text">${element.beschreibung}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item font-weight-bold">Price: <span class="text-danger h4">${element.preis} Euro</span></spand></li>
                    <li class="list-group-item text-muted ${element.basicPrice ? "" : "hidden" }">Basic Price: <span class="text-danger">${element.basicPrice}</span></spand></li>
                    </ul>
                    <div class="card-body">
                    <a href="#" class="card-link add-to-cart" data-name="${element.titel}" data-price="${element.preis}">Add to Basket</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    });
    contentDiv.innerHTML = htmlRepresentation;
    creationOwlCarousel ();
};

function creationOwlCarousel () {
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
            $('owl-carousel').trigger('prev-owl');
        }
            e.preventDefault();
    });
};

/**Coding section for Cards */

let removerCartItemButtons = document.getElementsByClassName('btn-danger');
//console.log(removerCartItemButtons);
for (let i = 0; i < removerCartItemButtons.length; i++){
    let button = removerCartItemButtons[i];
    button.addEventListener('click', function(e) {
        let buttonClicked = e.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal();

    });
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (let i = 0; i<cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')
        console.log(priceElement, quantityElement);
    }
}
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
            <div class="card-group" style="height: 40rem">
                <div class="card" style="width: 18rem;">
                    <img src=${element.bild_app} class="card-img-top cart-item-image"  alt="Card image cap">
                    <div class="card-body scroll h-50">
                    <h5 class="card-title product-item-title">${element.titel}</h5>
                    <p class="card-text">${element.beschreibung}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item font-weight-bold">Price: <span class="text-danger h4 product-item-price">${element.preis} Euro</span></spand></li>
                    <li class="list-group-item text-muted ${element.basicPrice ? "" : "hidden" }">Basic Price: <span class="text-danger">${element.basicPrice}</span></spand></li>
                    </ul>
                    <div class="card-footer">
                    <button class="btn btn-outline-success add-to-cart text-center" type="button">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    });
    contentDiv.innerHTML = htmlRepresentation;
    creationOwlCarousel ();
    ready();
};

function creationOwlCarousel () {
    //Owl Carousel Creation
    $('.owl-carousel').owlCarousel({
        autoplay: false,
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
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    let removerCartItemButtons = document.getElementsByClassName('btn-danger');
    //console.log(removerCartItemButtons);
    for (let i = 0; i < removerCartItemButtons.length; i++){
        let button = removerCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    let addToCartButtons = document.getElementsByClassName('add-to-cart')
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    let cartItems = document.getElementsByClassName('cart-items')[0]
    if (cartItems.firstChild || cartItems.childNodes.length ) {
        alert('Thank you for your purchase!');
        
    } else {
        alert('You did not add products yet');
    }

    while ( cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

function removeCartItem(e) {
    let buttonClicked = e.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal();
}

function quantityChanged(e) {
    let input = e.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    } 
    updateCartTotal();
}

function addToCartClicked(e) {
    let button = e.target;
    let productItem = button.parentElement.parentElement.parentElement.parentElement;
    let title = productItem.getElementsByClassName('product-item-title')[0].innerText;
    let price = productItem.getElementsByClassName('product-item-price')[0].innerText;
    let imageSrc = productItem.getElementsByClassName('cart-item-image')[0].src
    console.log(title, price, imageSrc);
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for  (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return; 
        }
    }
    let cartRowContents = `                           
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
        cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem );
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0;
    for (let i = 0; i<cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('Euro', ''));
        let quantity = quantityElement.value
        total = total + (price *quantity)
    }
    total = Math.round(total*100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = total + ' Euro';
}
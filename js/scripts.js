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
const api_url = fetch('https://www.edeka.de/eh/service/eh/offers');
var htmlRepresentation = "";

api_url
  .then(response => response.json())
  .then(content => {
      console.log(content);
    
       htmlRepresentation = `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src=${content.docs[0].bild_app} alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${content.docs[0].titel}</h5>
                <p class="card-text">${content.docs[0].beschreibung}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item font-weight-bold">Price: <span class="text-danger h4">${content.docs[0].preis} Euro</span></spand></li>
                <li class="list-group-item text-muted">Basic Price: <span class="h6">${content.docs[0].basicPrice}</span></spand></li>
            </ul>
            <div class="card-body">
                <a href="#" class="card-link">Add to Basket</a>
            </div>
        </div>
      `;
      return htmlRepresentation;
  })
  .then(htmlRepresetation =>{
        // for( var i = 0; i <content.length; i++) {
            contentDiv.innerHTML = htmlRepresetation;
        // }
            console.log(htmlRepresetation);
    })


// fetch(api_url);
// const data = await response.json();
// console.log(data);

// const contentDiv = document.getElementById('content');
// const apiPromise = fetch("https://...")

// // apiPromise
//     .then(result => result.json())
//     .then(content => {
//         console.log(content);
//         const htmlRepresetation = `
//         <ul>
//             <li>Name: ${content.name}</li>
//             <li>Birthday: ${content.birthday} </li>
//             <li> Favourite hobby: ${content.favouriteHobby}</li>
//         </ul>
//         `;
//         return htmlRepresetation;

//     })
//     .then(htmlRepresetation =>{
//         contentDiv.innerHTML = htmlRepresetation;
//         console.log(htmlRepresetation);
//     })

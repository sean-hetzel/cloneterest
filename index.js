URL = "http://localhost:3000/pins";

fetch(URL)
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        console.log(json);
        renderPins(json);
    });

function renderPins(json) {
    json.forEach(function(pin) {
        console.log(pin.url);
        const pinCard = document.createElement("div");
        pinCard.setAttribute("class", "pin_card");
        const pinImage = document.createElement("img");
        pinImage.setAttribute("src", pin.url);
        pinCard.appendChild(pinImage);
        document.getElementById("pins_div").appendChild(pinCard);
    });
}

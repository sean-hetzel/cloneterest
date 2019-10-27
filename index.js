document.addEventListener("DOMContentLoaded", () => {
    console.log("%c DOM Content Loaded and Parsed!", "color: magenta");

    // PORT = 3000;

    // URL for json file of pins
    // URL = `http://localhost:${PORT}/pins`;

    // Heroku URL:
    URL = "https://shrouded-savannah-12292.herokuapp.com/api/v1/pins"

    //////////////////////////////// FORM START ///////////////////////////////////
    // create form for posting a pin
    const add_pin_form = document.createElement("form");

    // create pin image url input
    const imageUrl = document.createElement("input");
    imageUrl.placeholder = "Image URL";

    // create pin name input
    const imageName = document.createElement("input");
    imageName.placeholder = "Title (optional)";

    // create pin description input
    const imageDesc = document.createElement("input");
    imageDesc.placeholder = "Description (optional)";

    // create submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Share";
    submitButton.id = "submit_button";

    // appending form elements to add_pin_form
    add_pin_form.appendChild(imageUrl);
    add_pin_form.appendChild(imageName);
    add_pin_form.appendChild(imageDesc);
    add_pin_form.appendChild(submitButton);

    // add add_pin_form to new_pin_div
    document.getElementById("new_pin_div").appendChild(add_pin_form);

    // add event listener to submit button for add_pin_form and fetch post do add post function
    document.getElementById("new_pin_div").addEventListener("submit", event => {
        event.preventDefault();
        postData = {
            url: event.target[0].value, // image url
            name: event.target[1].value, // name
            description: event.target[2].value // description
        };
        addPost(postData);
        add_pin_form.reset(); // reset form
    });
    ////////////////////////////////// FORM END ///////////////////////////////////

    // fetch post to add pin to pins.json database given to formData from add_pin_form
    function addPost(postData) {
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name: postData.name, // save name do database
                description: postData.description, // save description do database
                url: postData.url // save image url do database
            })
        })
            .then(response => response.json())
            .then(pinObj => {
                renderPins(pinObj);
            });
    }

    // fetch all image pins on page load
    fetch(URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            json.forEach(function(pin) {
                renderPins(pin);
            });
        });

    // render pins
    function renderPins(pin) {
        // create pin card
        const pinCard = document.createElement("div");
        pinCard.classList.add("pin_card");

        // create image with link to view larger
        const pinImage = document.createElement("img");
        pinImage.src = pin.url;
        pinImage.alt = pin.name;
        pinImage.onclick = function() {
            window.location.href = pin.url;
        };

        // create pin name
        const pinName = document.createElement("h2");
        pinName.textContent = pin.name;

        // create pin description
        const pinDesc = document.createElement("p");
        pinDesc.textContent = pin.description;

        // create delete button with fetch to delete pin from pins.json database
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete_post");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            fetch(`${URL}/${pin.id}`, { method: "DELETE" });
            pinCard.remove();
        });

        // append image, name, description & delete button to pin card
        pinCard.appendChild(pinImage);
        pinCard.appendChild(pinName);
        pinCard.appendChild(pinDesc);
        pinCard.appendChild(deleteButton);

        // append pin to pins div
        document.getElementById("pins_div").prepend(pinCard);
    }
});

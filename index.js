document.addEventListener("DOMContentLoaded", () => {
    console.log("%c Clone of Pinterest made by Sean Hetzel", "color: cyan");

    // PORT = 3000;

    // URL for json file of pins
    // URL = `http://localhost:${PORT}/pins`;

    // Heroku URL:
    URL = "https://shrouded-savannah-12292.herokuapp.com/api/v1/pins";

    //////////////////////////////// FORM START ///////////////////////////////////
    // create form for posting a pin
    const add_pin_form = document.createElement("form");

    // create pin image url input
    const imageUrl = document.createElement("input");
    imageUrl.placeholder = "Image URL";
    imageUrl.type = "url";
    imageUrl.required = true;

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

    // loading spinner
    const loading = document.createElement("div");
    loading.classList.add("loading");
    loading.id = "loading";
    document.getElementById("new_pin_div").appendChild(loading);

    // fetch all image pins on page load
    fetch(URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            json.forEach(function(pin) {
                console.log(pin);
                document.getElementById("loading").style.display = "none";
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
        pinCard.appendChild(pinImage);

        // create pin name
        const pinName = document.createElement("h2");
        pinName.textContent = pin.name;
        pinCard.appendChild(pinName);

        // create pin description
        const pinDesc = document.createElement("p");
        pinDesc.textContent = pin.description;
        pinCard.appendChild(pinDesc);

        // create like count
        const likeCount = document.createElement("p");
        likeCount.classList.add("like_count");

        // create like button
        const likeButton = document.createElement("img");
        likeButton.classList.add("heart", "button");
        if (pin.likes > 0) {
            likeButton.src = "Heart-icon.png";
            likeCount.textContent = pin.likes.toLocaleString();
        } else {
            likeButton.src = "Heart-icon-outline.png";
            likeCount.textContent = "";
        }
        likeButton.alt = "Like";
        likeButton.addEventListener("click", () => {
            fetch(`${URL}/${pin.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    likes: pin.likes + 1
                })
            })
                .then(response => response.json())
                .then(pin => {
                    console.log(pin)
                });
        });
        pinCard.appendChild(likeButton);
        pinCard.appendChild(likeCount);

        // create confirm deletion button
        const deleteConfirmButton = document.createElement("button");
        deleteConfirmButton.classList.add("confirm_deletion", "button");
        deleteConfirmButton.textContent = "Confirm Deletion";
        deleteConfirmButton.style.display = "none";
        pinCard.appendChild(deleteConfirmButton);

        // create delete button with fetch to delete pin from pins.json database
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete_post", "button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteButton.style.display = "none";
            deleteConfirmButton.style.display = "block";
        });
        deleteConfirmButton.addEventListener("click", () => {
            fetch(`${URL}/${pin.id}`, { method: "DELETE" });
            pinCard.remove();
        });
        pinCard.appendChild(deleteButton);

        // append pin to pins div
        document.getElementById("pins_div").prepend(pinCard);
    }
});

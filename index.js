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
        pinCard.classList.add("pin_card");
        const pinImage = document.createElement("img");
        pinImage.src = pin.url;
        pinImage.onclick = function() {
            window.location.href = pin.url;
        };

        const pinName = document.createElement("h2");
        pinName.textContent = pin.name;

        const pinDesc = document.createElement("p");
        pinDesc.textContent = pin.description;
        pinCard.appendChild(pinImage);
        pinCard.appendChild(pinName);
        pinCard.appendChild(pinDesc);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete_post");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            fetch(`${URL}/${pin.id}`, { method: "DELETE" });
        });
        pinCard.appendChild(deleteButton);
        document.getElementById("pins_div").appendChild(pinCard);
    });

    const add_pin_form = document.createElement("form");
    const imageUrl = document.createElement("input");
    const imageName = document.createElement("input");
    const imageDesc = document.createElement("input");
    const submitButton = document.createElement("button");
    imageUrl.placeholder = "Image URL";
    imageName.placeholder = "Name (optional)";
    imageDesc.placeholder = "Description (optional)";
    submitButton.textContent = "Share";
    submitButton.id = "submit_button";
    add_pin_form.appendChild(imageUrl);
    add_pin_form.appendChild(imageName);
    add_pin_form.appendChild(imageDesc);
    add_pin_form.appendChild(submitButton);
    document.getElementById("new_pin_div").appendChild(add_pin_form);
}

document.getElementById("new_pin_div").addEventListener("submit", event => {
    event.preventDefault();
    console.log(event);
    postData = {
        url: event.target[0].value,
        name: event.target[1].value,
        description: event.target[2].value
    };
    addPost(postData);
    add_pin_form.reset();
    console.log(postData);
});

function addPost(postData) {
    fetch("http://localhost:3000/pins", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            url: postData.url,
            name: postData.name,
            description: postData.description
        })
    });
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("%c DOM Content Loaded and Parsed!", "color: magenta");
});

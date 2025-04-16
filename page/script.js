async function addCity() {
    let name = document.querySelector("#add-name").value;
    let country = document.querySelector("#add-country").value;
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {name: name, country: country}));
    let resp = await fetch(req);
    if (resp.ok) {
        document.querySelector("#add-controls #status-msg").textContent = `${name} Successfully added!`;
        document.querySelector("#add-name").value = "";
        document.querySelector("#add-country").value = "";
        await getAllCities();
        await eventListeners("delete");
    } else {
        if (resp.status === 409) {
            document.querySelector("#add-controls #status-msg").textContent = `${name} is already in the database. Try again.`;
        } else {
            document.querySelector("#add-controls #status-msg").textContent = "Error: One or both inputs are empty.";
        }
    }
}

async function deleteCity(cityID) {
    console.log(cityID);
    let req = new Request("http://localhost:8000/cities", optionsGen("DELETE", {id: cityID}));
    let resp = await fetch(req);
    if (resp.ok) {
        await getAllCities();
        await eventListeners("delete");
    }
}

async function eventListeners(arg) {
    if (arg === "delete") {
        let allButtons = document.querySelectorAll(".city button");
        let allCities = document.querySelectorAll(".cities-in-list");
        for (let i=0; i<allButtons.length; i++) {
            allButtons[i].addEventListener("click", () => {deleteCity(allCities[i].cityID)});
        }
    } else if (arg === "add") {
        document.querySelector("#add-controls button").addEventListener("click", addCity);
    } else if (arg === "search") {
        document.querySelector("#search-controls button").addEventListener("click", searchCity);
    }
}

async function driver() {
    let startupSuccess = await getAllCities();
    if (startupSuccess) {
        await eventListeners("delete");
        await eventListeners("add");
        await eventListeners("search");
    } else {
        return;
    }
}

async function getAllCities() {
    document.querySelector("#city-list").innerHTML = "";
    let h2 = document.createElement("h2");
    h2.textContent = "List of Cities";
    document.querySelector("#city-list").appendChild(h2);
    let req = new Request("http://localhost:8000/cities");
    try {
        let resp = await fetch(req);
        if (resp.ok) {
            let reso = await resp.json();
            for (let city of reso) {
                let div = document.createElement("div");
                div.classList.add("city");
                div.classList.add("cities-in-list");
                div.innerHTML = `<p>${city.name}, ${city.country}</p><button>Delete</button>`;
                div.cityID = city.id;
                document.querySelector("#city-list").appendChild(div);
            }
        }
        return true;
    } catch (e) {
        let p = document.createElement("p");
        p.textContent = "Network error. Cities unavaliable.";
        p.style.textAlign = "center";
        document.querySelector("#city-list").appendChild(p);
        return false;
    }
}

function optionsGen(method, body) {
    return {method: method, body: JSON.stringify(body), headers: {"content-type": "application/json"}};
}

async function searchCity() {
    let text = document.querySelector("#search-text").value;
    let country = document.querySelector("#search-country").value;
    let req = new Request(`http://localhost:8000/cities/search?text=${text}&country=${country}`);
    let resp = await fetch(req);
    if (resp.status === 400) {
        document.querySelector("#search-controls #status-msg").textContent = "Error: Text input empty."
        return;
    }

    let reso = await resp.json();
    if (reso.length === 0) {
        document.querySelector("#search-controls #status-msg").textContent = "No cities found";
        document.querySelector("#search-list").innerHTML = "";
    } else {
        document.querySelector("#search-list").innerHTML = "";

        for (let city of reso) {
            let div = document.createElement("div");
            div.classList.add("city");
            div.innerHTML = `<p>${city.name}, ${city.country}</p>`;
            document.querySelector("#search-list").appendChild(div);
        }
        if (reso.length === 1) {
            document.querySelector("#search-controls #status-msg").textContent = `${reso.length} city found`;
        } else {
            document.querySelector("#search-controls #status-msg").textContent = `${reso.length} cities found`;
        }
    }
}

driver();
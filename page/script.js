async function addCity() {
    let name = document.querySelector("#add-name").value;
    let country = document.querySelector("#add-country").value;
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {name: name, country: country}));
    let resp = await fetch(req);
    if (resp.ok) {
        document.querySelector("#status-msg").textContent = `${name} Successfully added!`;
        document.querySelector("#add-name").value = "";
        document.querySelector("#add-country").value = "";
        await getAllCities();
        await eventListeners("delete");
    } else {
        if (resp.status === 409) {
            document.querySelector("#status-msg").textContent = `${name} is already in the database. Try again.`;
        } else {
            document.querySelector("#status-msg").textContent = "Something went wrong";
        }
    }
}

async function deleteCity(cityID) {
    let req = new Request("http://localhost:8000/cities", optionsGen("DELETE", {id: cityID}));
    let resp = await fetch(req);
    if (resp.ok) {
        await getAllCities();
        await eventListeners("delete");
    }
}

async function eventListeners(arg) {
    if (arg === "delete") {
        let allCities = document.querySelectorAll(".city button");
        for (let city of allCities) {
            city.addEventListener("click", () => {deleteCity(city.cityID)});
        }
    } else if (arg === "add") {
        document.querySelector("#add-controls button").addEventListener("click", addCity);
    }
}

async function driver() {
    let startupSuccess = await getAllCities();
    if (startupSuccess) {
        await eventListeners("delete");
        await eventListeners("add");
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

driver();
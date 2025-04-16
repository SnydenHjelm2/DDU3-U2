const cities = [
    { id: 2, name: "Lille", country: "France"},
    { id: 3, name: "Nantes", country: "France"},
    { id: 5, name: "Bremen", country: "Germany"},
    { id: 10, name: "Dresden", country: "Germany"},
    { id: 11, name: "Heidelberg", country: "Germany"},
    { id: 12, name: "Venice", country: "Italy"},
    { id: 13, name: "Rome", country: "Italy"},
    { id: 16, name: "Graz", country: "Austria"},
    { id: 20, name: "Basel", country: "Switzerland"},
    { id: 21, name: "Lucerne", country: "Switzerland"},
    { id: 22, name: "Kraków", country: "Poland"},
    { id: 23, name: "Warsaw", country: "Poland"}, 
    { id: 24, name: "Poznań", country: "Poland"},
    { id: 28, name: "Ghent", country: "Belgium"},
    { id: 31, name: "Maastricht", country: "Netherlands"},
    { id: 38, name: "Maribor", country: "Slovenia"},
    { id: 42, name: "Strasbourg", country: "France"},
  ];

async function handler(req) {
    let headersObj = new Headers();
    headersObj.set("Access-Control-Allow-Origin", "*");
    headersObj.set("Access-Control-Allow-Methods", "OPTIONS, POST, DELETE");
    headersObj.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return new Response(null, {headers: headersObj});
    }

    let url = new URL(req.url);
    let idURLPattern = new URLPattern({pathname: "/cities/:id"});

    if (url.pathname === "/cities" || url.pathname === "/cities/") {
        headersObj.set("content-type", "application/json");
        if (req.method === "GET") {
            return new Response(JSON.stringify(cities), {headers: headersObj});
        } else if (req.method === "POST") {
            if (req.headers.get("Content-Type") !== "application/json") {
                return new Response(JSON.stringify({"error": "Invalid Content-Type, JSON expected"}), {status: 400, headers: headersObj});
            }
            let reqBody = await req.json();
            if (!reqBody.name || !reqBody.country) {
                return new Response(JSON.stringify("Invalid request body"), {status: 400, headers: headersObj});
            }

            let id = cities.sort((a, b) => a.id - b.id);
            let obj = {
                id: id[id.length - 1].id + 1,
                name: reqBody.name,
                country: reqBody.country
            }
            if (cities.find((x) => x.name.toLowerCase() === obj.name.toLowerCase())) {
                return new Response(JSON.stringify("Error: City already exists"), {status: 409, headers: headersObj});
            } else {
                cities.push(obj);
                return new Response(JSON.stringify(obj), {headers: headersObj});
            }
        } else if (req.method === "DELETE") {
            if (req.headers.get("Content-Type") !== "application/json") {
                return new Response(JSON.stringify({"error": "Invalid Content-Type, JSON expected"}), {status: 400, headers: headersObj});
            }

            let reqBody = await req.json();
            if (!reqBody.id) {
                return new Response(JSON.stringify("Invalid request body"), {status: 400, headers: headersObj});
            }

            let city = cities.find((x) => x.id === parseInt(reqBody.id));
            if (!city) {
                return new Response(JSON.stringify("Error: No city found"), {status: 404, headers: headersObj});
            } else {
                let index = cities.findIndex((x) => x.id === city.id);
                cities.splice(index, 1);
                return new Response(JSON.stringify("Delete OK"), {headers: headersObj});
            }
        }
    } else if (url.pathname === "/cities/search") {
        let paramText = url.searchParams.has("text");
        let text = url.searchParams.get("text");
        if (paramText && text) {
            if (req.method === "GET") {
                let country = url.searchParams.get("country");

                if (country) {
                    let citiesInCountry = cities.filter((x) => x.country.toLowerCase() === country.toLowerCase());
                    let resultCities = citiesInCountry.filter((x) => x.name.includes(text));
                    return new Response(JSON.stringify(resultCities), {headers: headersObj});
                } else {
                    let resultCities = cities.filter((x) => x.name.includes(text));
                    return new Response(JSON.stringify(resultCities), {headers: headersObj});
                }
            }
        } else {
            return new Response(JSON.stringify("Error: Missing parameter 'text'"), {status: 400, headers: headersObj});
        }
    }



    let idURLMatch = idURLPattern.exec(url);
    if (idURLMatch) {
        if (req.method === "GET") {
            let id = idURLMatch.pathname.groups.id;
            if (isNaN(parseInt(id))) {return new Response(JSON.stringify("Bad Request, Invalid endpoint or method"), {status: 400, headers: headersObj})};
            let city = cities.find((x) => x.id === parseInt(id));
            if (!city) {
                return new Response(JSON.stringify("Error: City not found"), {status: 404, headers: headersObj});
            } else {
                return new Response(JSON.stringify(city), {headers: headersObj});
            }
        }
    }

    return new Response(JSON.stringify("Bad Request, Invalid endpoint or method"), {status: 400, headers: headersObj});
}

Deno.serve(handler);
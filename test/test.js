function optionsGen(method, body) {
    let obj = {
        method: method,
        body: JSON.stringify(body),
        headers: {"content-type": "application/json"}
    }
    return obj;
}

document.querySelector("#test1-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities/");
    fetch(req).then((resp) => {
        if (resp.status === 200 ) {
            document.querySelector("#test1 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test1 h5").textContent = "Something went wrong!";
            document.querySelector("#test1").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (typeof reso === "object") {
            document.querySelector("#test1 h5").textContent += " Response body was Array";
            document.querySelector("#test1").style.backgroundColor = "lime";
        }
    });
});

document.querySelector("#test2-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {"name": "Malmö", "country": "Sweden"}));
    fetch(req).then((resp) => {
        if (resp.status === 200) {
            document.querySelector("#test2 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test2 h5").textContent = "Something went wrong!";
            document.querySelector("#test2").style.backgroundColor = "tomato";
            return; 
        }
    }).then((reso) => {
        if (reso.id) {
            document.querySelector("#test2 h5").textContent += " Response body correct";
            document.querySelector("#test2").style.backgroundColor = "lime";
        }
    });
});

document.querySelector("#test3-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("DELETE", {"id": 2}));
    fetch(req).then((resp) => {
        if (resp.status === 200) {
            document.querySelector("#test3 h5").textContent = `Successfull! ${resp.status}, ${resp.statusText}.`;
            return resp.text();
        } else {
            document.querySelector("#test3 h5").textContent = "Something went wrong!";
            document.querySelector("#test3").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (reso === "Delete OK") {
            document.querySelector("#test3 h5").textContent += " Correct Response Body";
            document.querySelector("#test3").style.backgroundColor = "lime";
        }
    });
});

document.querySelector("#test4-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities");
    fetch(req).then((resp) => {
        if (resp.status === 200) {
            document.querySelector("#test4 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test4 h5").textContent = "Something went wrong!";
            document.querySelector("#test4").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        let malmo = reso.find((x) => x.name === "Malmö");
        let lille = reso.find((x) => x.name === "Lille");

        if (malmo && !lille) {
            document.querySelector("#test4 h5").textContent += " Correct response body";
            document.querySelector("#test4").style.backgroundColor = "lime";
        } else {
            document.querySelector("#test4 h5").textContent = "Malmö does not exist, or Lille does exist";
            document.querySelector("#test4").style.backgroundColor = "tomato";
        }
    });
});

document.querySelector("#test5-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities/43");
    fetch(req).then((resp) => {
        if (resp.status === 200) {
            document.querySelector("#test5 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test5 h5").textContent = "Something went wrong!";
            document.querySelector("#test5").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (reso.id === 43) {
            document.querySelector("#test5 h5").textContent += " Correct response body";
            document.querySelector("#test5").style.backgroundColor = "lime";
        } else {
            document.querySelector("#test5 h5").textContent = "Incorrect ID in response body";
            document.querySelector("#test5").style.backgroundColor = "tomato";
        }
    });
});

document.querySelector("#test6-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities/search?text=en");
    fetch(req).then((resp) => {
        if (resp.status === 200) {
            document.querySelector("#test6 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test6 h5").textContent = "Something went wrong!";
            document.querySelector("#test6").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (reso.length === 4 && reso[0].name === "Bremen") {
            document.querySelector("#test6 h5").textContent += " Correct response body";
            document.querySelector("#test6").style.backgroundColor = "lime";
        } 
    });
});

document.querySelector("#test7-b").addEventListener("click", () => {
    let req = new Request("http://localhost:8000/cities/search?text=en&country=Sweden");
    fetch(req).then((resp) => {
        if (resp.status === 200) {
            document.querySelector("#test7 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test7 h5").textContent = "Something went wrong!";
            document.querySelector("#test7").style.backgroundColor = "tomato";
        }
    }).then((reso) => {
        if (reso.length === 0) {
            document.querySelector("#test7 h5").textContent += " Correct Response body";
            document.querySelector("#test7").style.backgroundColor = "lime";
        }
    });
});

document.querySelector("#test8-b").addEventListener("click", async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {"name": "Dresden", "country": "Germany"}));
    let resp = await fetch(req);
    if (resp.status === 409) {
        document.querySelector("#test8 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test8 h5").textContent = "Something went wrong!";
        document.querySelector("#test8").style.backgroundColor = "tomato";
    }
    let reso = await resp.text();
    if (typeof reso === "string") {
        document.querySelector("#test8 h5").textContent += " Correct response body";
        document.querySelector("#test8").style.backgroundColor = "lime";
    }
});
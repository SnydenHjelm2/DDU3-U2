function optionsGen(method, body) {
    let obj = {
        method: method,
        body: JSON.stringify(body),
        headers: {"content-type": "application/json"}
    }
    return obj;
}

async function tester() {
    await test1();
    await test2();
    await test3();
    await test4();
    await test5();
    await test6();
    await test7();
    await test8();
    await test9();
    await test10();
    await test11();
    await test12();
    await test13();
    await test14();
}

const test1 = () => {
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
        if (reso.length === 17) {
            document.querySelector("#test1 h5").textContent += " Correct Response body";
            document.querySelector("#test1").style.backgroundColor = "lime";
        }
    });
};

const test2 = async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {"name": "Malmö", "country": "Sweden"}));
    let resp = await fetch(req);
    if (resp.status === 200) {
        document.querySelector("#test2 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test2 h5").textContent = "Something went wrong!";
        document.querySelector("#test2").style.backgroundColor = "tomato";
        return;
    }
    let reso = await resp.json();
    if (reso.name && reso.country && reso.id) {
        document.querySelector("#test2 h5").textContent += " Correct response body";
        document.querySelector("#test2").style.backgroundColor = "lime";
    }
};

const test3 = async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("DELETE", {"id": 2}));
    let resp = await fetch(req);
    if (resp.status === 200) {
        document.querySelector("#test3 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test3 h5").textContent = "Something went wrong!";
        document.querySelector("#test3").style.backgroundColor = "tomato";
        return;
    }
    let reso = await resp.json();
    if (reso === "Delete OK") {
        document.querySelector("#test3 h5").textContent += " Correct response body";
        document.querySelector("#test3").style.backgroundColor = "lime";
    }
};

const test4 = async () => {
    let req = new Request("http://localhost:8000/cities");
    let resp = await fetch(req);
    if (resp.status === 200) {
        document.querySelector("#test4 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test4 h5").textContent = "Something went wrong!";
        document.querySelector("#test4").style.backgroundColor = "tomato";
        return;
    }
    let reso = await resp.json();
    let malmo = reso.find((x) => x.name === "Malmö");
    let lille = reso.find((x) => x.name === "Lille");
    console.log(malmo);
    console.log(lille);
    if (malmo && !lille) {
        document.querySelector("#test4 h5").textContent += " Correct response body";
        document.querySelector("#test4").style.backgroundColor = "lime";
    } else {
        document.querySelector("#test4 h5").textContent = "Malmö does not exist, or Lille does exist";
        document.querySelector("#test4").style.backgroundColor = "tomato";
    }
};

const test5 = () => {
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
};

const test6 = () => {
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
};

const test7 = () => {
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
};

const test8 = async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {"name": "Dresden", "country": "Germany"}));
    let resp = await fetch(req);
    if (resp.status === 409) {
        document.querySelector("#test8 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test8 h5").textContent = "Something went wrong!";
        document.querySelector("#test8").style.backgroundColor = "tomato";
        return;
    }
    let reso = await resp.json();
    if (typeof reso === "string") {
        document.querySelector("#test8 h5").textContent += " Correct response body";
        document.querySelector("#test8").style.backgroundColor = "lime";
    }
};

const test9 = async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("POST", {"name": "Ystad"}));
    let resp = await fetch(req);
    if (resp.status === 400) {
        document.querySelector("#test9 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test9 h5").textContent = "Something went wrong!";
        document.querySelector("#test9").style.backgroundColor = "tomato";
        return;
    }
    let reso = await resp.text();
    if (typeof reso === "string") {
        document.querySelector("#test9 h5").textContent += " Correct response body";
        document.querySelector("#test9").style.backgroundColor = "lime";
    }
};

const test10 = async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("DELETE", {"id": 56}));
    let resp = await fetch(req);
    if (resp.status === 404) {
        document.querySelector("#test10 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`; 
    } else {
        document.querySelector("#test10 h5").textContent = "Something went wrong!";
        document.querySelector("#test10").style.backgroundColor = "tomato";
        return;
    }
    let reso = await resp.text();
    if (typeof reso === "string") {
        document.querySelector("#test10 h5").textContent += " Correct response body";
        document.querySelector("#test10").style.backgroundColor = "lime";
    }
};

const test11 = async () => {
    let req = new Request("http://localhost:8000/cities", optionsGen("DELETE", {}));
    let resp = await fetch(req);
    if (resp.status === 400) {
        document.querySelector("#test11 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
    } else {
        document.querySelector("#test11 h5").textContent = "Something went wrong!";
        document.querySelector("#test11").style.backgroundColor = "tomtao";
        return;
    }
    let reso = await resp.json();
    if (reso === "Invalid request body") {
        document.querySelector("#test11 h5").textContent += " Correct response body";
        document.querySelector("#test11").style.backgroundColor = "lime";
    }
};

const test12 = () => {
    let req = new Request("http://localhost:8000/messages", optionsGen("POST", {"from": 1, "to": 2, "password": "pass"}));
    fetch(req).then((resp) => {
        if (resp.status === 400) {
            document.querySelector("#test12 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test12 h5").textContent = "Something went wrong!";
            document.querySelector("#test12").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (reso === "Bad Request, Invalid endpoint or method") {
            document.querySelector("#test12 h5").textContent += " Correct response body";
            document.querySelector("#test12").style.backgroundColor = "lime";
        }
    })
};

const test13 = () => {
    let req = new Request("http://localhost:8000/cities/search");
    fetch(req).then((resp) => {
        if (resp.status === 400) {
            document.querySelector("#test13 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test13 h5").textContent = "Something went wrong!";
            document.querySelector("#test13").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (reso === "Error: Missing parameter 'text'") {
            document.querySelector("#test13 h5").textContent += " Correct response body";
            document.querySelector("#test13").style.backgroundColor = "lime";
        }
    });
};

const test14 = () => {
    let req = new Request("http://localhost:8000/mordor", optionsGen("DELETE", {}));
    fetch(req).then((resp) => {
        if (resp.status === 400) {
            document.querySelector("#test14 h5").textContent = `Success! ${resp.status}, ${resp.statusText}.`;
            return resp.json();
        } else {
            document.querySelector("#test14 h5").textContent = "Something went wrong";
            document.querySelector("#test14").style.backgroundColor = "tomato";
            return;
        }
    }).then((reso) => {
        if (reso === "Bad Request, Invalid endpoint or method") {
            document.querySelector("#test14 h5").textContent += " Correct response body";
            document.querySelector("#test14").style.backgroundColor = "lime";
        }
    });
};

tester();
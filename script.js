const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != "") requestApi(inputField.value);
});

locationBtn.addEventListener("click", () =>{
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(onSuccess, onError) : alert("Seu navegador não suporta api de geolocalização");
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=0a34f362a8ec3dfbad3e1db4850a7325`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=0a34f362a8ec3dfbad3e1db4850a7325`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("erro");
}

function fetchData(){
    infoTxt.innerText = "Obtendo detalhes metereológicos...";
    infoTxt.classList.add("pendente");
    
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Algo está errado";
        infoTxt.classList.replace("pendente", "erro");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){ 
        infoTxt.classList.replace("pendente", "erro");
        infoTxt.innerText = `${inputField.value} não é um nome de cidade válido`;
    }else{
        
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800) wIcon.src = "icones/limpo.svg";
        if(id >= 200 && id <= 232) wIcon.src = "icones/tempestade.svg";  
        if(id >= 600 && id <= 622) wIcon.src = "icones/neve.svg";
        if(id >= 701 && id <= 781) wIcon.src = "icones/nevoeiro.svg";
        if(id >= 801 && id <= 804) wIcon.src = "icones/nuvem.svg";
        if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) wIcon.src = "icones/chuva.svg";
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
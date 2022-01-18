// declared variables

function myWeatherApp(){
    
var cityInput = document.querySelector("#city");
var searchEL = document.querySelector("#search");
var container = document.querySelector(".card-body");
var cityTitle =document.createElement("h3");
var tempEl = document.createElement("p");
var windEl = document.createElement("p");
var humidityEl = document.createElement("p");
var uviEl = document.createElement("p");
var spanEl =document.createElement("span");
var fiveDays= document.querySelector(".fiveday");
var fiveTitle = document.createElement("h3");
var fiveContainer = document.querySelector("#days-container"); 
var recentCont = document.querySelector("#recent");
var weatherIcon =document.createElement("img");
let searchRecent = JSON.parse(localStorage.getItem("Cities")) || [];

// functions
function weatherApp(city){
 
  
  var cityUrl="https://api.openweathermap.org/data/2.5/weather?q=";
  var cityKey="&units=imperial"+ "&appid=1c312546873edc1140d757b8b39deb9c";
  var search = `${cityUrl}${city}${cityKey}`;
  axios.get(search)
    .then(function(res){
        container.classList.remove('d-none')
        fiveDays.classList.remove('d-none');
        console.log(res);
        cityInput.value="";
        cityTitle.textContent = res.data.name + " " +"("+ moment().format("L")+")";
        cityTitle.classList="font-weight-bold";
        tempEl.textContent = "Temp: "+ res.data.main.temp+"°F";
        windEl.textContent= "Wind: "+res.data.wind.speed+" MPH";
        humidityEl.textContent="Humidity: "+res.data.main.humidity+"%";
        var icon = res.data.weather[0].icon;
        weatherIcon.setAttribute('class', 'weather_image')
        weatherIcon.setAttribute("src",`https://openweathermap.org/img/wn/${icon}@2x.png`);

        container.appendChild(cityTitle);
        container.append(weatherIcon);
        container.appendChild(tempEl);
        container.appendChild(windEl);
        container.appendChild(humidityEl);
        

        var lat = res.data.coord.lat;
        var lon = res.data.coord.lon;
        var key = "&appid=1c312546873edc1140d757b8b39deb9c";
        var url = "https://api.openweathermap.org/data/2.5/onecall?";
        var findUv =`${url}${key}&lat=${lat}&lon=${lon}`;

       
        fetch(findUv)
        .then(function(response){
            return response.json();
            
        }).then(function(data){
            
            console.log(data)
           
            
            uviEl.textContent="UV-index: ";
            var uvi =data.current.uvi
            spanEl.textContent=uvi
            spanEl.classList='uvi';
            if(uvi<2){
                spanEl.style.backgroundColor="green";
            }
            else if(uvi<4){
                spanEl.style.backgroundColor="yellow";
                spanEl.style.color="black"
            }
            else if(uvi<6){
                spanEl.style.backgroundColor="orange";  
            }
            else if(uvi<8){
                spanEl.style.backgroundColor="tomato"; 
            }
            else if(uvi<10){
                spanEl.style.backgroundColor="red";
            }
            else if(uvi>11){
                spanEl.style.backgroundColor="purple"; 
            }
           
           
            uviEl.appendChild(spanEl)
            container.appendChild(uviEl);
            

        });


        var urlF ="https://api.openweathermap.org/data/2.5/forecast?id=";
        var keyF ="&units=imperial"+"&appid=1c312546873edc1140d757b8b39deb9c";
        var forecast= urlF+res.data.id+keyF;

        axios.get(forecast)
        .then(function(response){
            
          var days = document.querySelectorAll('.show');
           for (i=0; i<days.length; i++){
               days[i].innerHTML = "";
              var daysIndex = i * 8 + 4;
              var fDate = new Date(response.data.list[daysIndex].dt * 1000);
              var year = fDate.getFullYear();
              var month = fDate.getMonth()+1;
              var day = fDate.getDate();
              var weekDaysEl = document.createElement("p");
               weekDaysEl.textContent= `${month}/${day}/${year}`;
               days[i].appendChild(weekDaysEl);

               
              var iconWeather = document.createElement("img");
               iconWeather.setAttribute("src",  "https://openweathermap.org/img/wn/" + response.data.list[daysIndex].weather[0].icon + "@2x.png")
               days[i].append(iconWeather);


              var tempEl = document.createElement("p");
               tempEl.textContent =`Temp:  ${(response.data.list[daysIndex].main.temp)}`;
               days[i].append(tempEl);

               var humidityEl = document.createElement("p");
               humidityEl.textContent =`Humidity: ${(response.data.list[daysIndex].main.humidity)}%`;
               days[i].append(humidityEl)
           }

        })
       


         
    });

}



function searchFunc(){
    recentCont.innerHTML= "";
    for(let i=0; i < searchRecent.length; i++){
        const btnItem = document.createElement("input");
        btnItem.setAttribute('type', 'text');
        btnItem.setAttribute('readonly', true);
        btnItem.setAttribute('class', 'form-control d-block text-center mt-2 bg-warning');
        btnItem.setAttribute('value', searchRecent[i]);
        btnItem.addEventListener('click', function(){
            const citi = btnItem.value 
            weatherApp(citi);
            
        })
        
        recentCont.appendChild(btnItem);
        
    }
    

}
        searchEL.addEventListener('click',function(){
            const findValue = cityInput.value;
            weatherApp(findValue);
            searchRecent.push(findValue);
            let uniqueChars = [...new Set(searchRecent)];
            localStorage.setItem("Cities", JSON.stringify(uniqueChars));
            searchFunc();
        });

        searchFunc();

    if(searchRecent.length > 0){
        weatherApp(searchRecent[searchRecent.length - 1]);
    }


};

myWeatherApp();
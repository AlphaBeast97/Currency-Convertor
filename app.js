const apiKey = '1f21bb88e95cd9982a96ecf6666b8d2e';
const apiUrl = 'https://api.exchangeratesapi.io/v1/latest';
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
let msg = document.querySelector(".msg");

for(let select of dropdowns) {
    for(currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }
        if(select.name === "to" && currCode === "PKR"){
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amountVal = amount.value;
    amountVal = parseFloat(amountVal);
    if(!Number.isInteger(amountVal) || amountVal <= 0){
        setTimeout(() => {
            msg.textContent = "Enter correct Amount!";
            msg.style.color = "red";
            amount.style.animation = "error 150ms 2";
        }, 300);
        amount.style.animation = "";
        return 1;
    }
    msg.style.color = "rgb(255, 228, 78)";
    msg.innerHTML = "Loading...";

    const URL = `${apiUrl}?access_key=${apiKey}&symbols=${fromCurr.value},${toCurr.value}`;

    try {
        // Fetch the exchange rate data from the API
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the JSON response

        // Check if the 'rates' property exists in the data
        if (!data.rates) {
            throw new Error("Unable to fetch exchange rates.");
        }

        // Extract the conversion rates
        const fromRate = data.rates[fromCurr.value];
        const toRate = data.rates[toCurr.value];

        if (fromRate === undefined || toRate === undefined) {
            throw new Error("Invalid currency code(s).");
        }
        // Calculate the converted amount.
        const convertedAmount = (amountVal / fromRate) * toRate;

        // Display the result
        msg.innerHTML = `${amountVal} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        // Handle errors during the API request or data processing
        console.error("Error fetching exchange rate:", error);
        msg.textContent = "Failed to fetch exchange rate.";
        msg.style.color = "red";
    }


    // this was my attempt 
    // const URL = `${apiUrl}?access_key=${apiKey}&from=${fromCurr}&to=${toCurr}&amount=${amountVal}`;
    
    // try{
    //     const response = await fetch(URL);
    //     const data = await response.json();
    //     console.log(data);
    //     const conversionRate = data.rates[toCurr.value];
    //     const convertedAmount = amountVal * conversionRate;
    //     msg.textContent = `${amountVal} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;
    // }catch (error){
    //     console.error("Error fetching exchange rate:", error);
    //     msg.textContent = "Failed to fetch exchange rate.";
    //     msg.style.color = "red";
    // }
})
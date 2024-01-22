const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const resetBtn = document.querySelector("[data-resetBtn]");
const symbols = '~`!@#$%^&*()[]{}:<>.?';


let password = "";
let passwordLength = 10;
let checkCount = 1;
//set strength circle colour grey
setIndicator("#ccc");


//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;


    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / (max-min)) + "% 100%"
}

handleSlider();

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});






//set strength colour
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow --> HW
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked)  hasUpper = true;
    if(lowercaseCheck.checked)  hasLower = true;
    if(numbersCheck.checked)    hasNum = true;
    if(symbolsCheck.checked)    hasSymbol = true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator('#0f0');
    }
    else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSymbol) && 
        passwordLength >= 6
    ) {
        setIndicator('#ff0');
    }
    else {
        setIndicator('#f00');
    }
}






//copy to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.textContent = "copied";
    }
    catch(e) {
        copyMsg.textContent = 'failed';
    }

    //to make copied msg visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active")
    }, 2000);
}

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
})





// handle checkbox count
function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });

    //special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})






//generating password
function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max-min) ) + min;
}

function generateRandomNumber() {
    return getRandomInt(0,9);
}

function generateLowercase() {
    return String.fromCharCode( getRandomInt(97,123) );
}

function generateUppercase() {
    return String.fromCharCode( getRandomInt(65,91) );
}

function generateSymbol() {
    let randNum = getRandomInt(0, symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap -> arr[i], arr[j]
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    //none of the checkboxes are selected
    if(checkCount == 0)   
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //remove old password
    password = "";




    //lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked) {
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowercase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }



    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    
    //compulsary addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition 
    for(let i=0; i<passwordLength - funcArr.length; i++) {
        let randIdex = getRandomInt(0, funcArr.length);
        password += funcArr[randIdex]();
    }

    //password shuffle
    password = shufflePassword(Array.from(password));

    //display password
    passwordDisplay.value = password;

    //calculation strength
    calcStrength();
});


resetBtn.addEventListener('click', () => {
    passwordLength = 10;
    password = "";
    passwordDisplay.value = password;
    handleSlider();

    allCheckBox.forEach((checkbox) => {
        checkbox.checked = false;
    })

    setIndicator("#ccc");
});
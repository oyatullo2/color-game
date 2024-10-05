document.addEventListener('keydown',function(event){
    if(event.key==='Enter'){
        document.querySelector("#refresh").click()
    }
})

window.onload=function alertt(){
    showAlert();
}

function showAlert(massage){
    let yangi=document.querySelector("#alertt");
    yangi.innerHTML;
    yangi.style.display='block'
}

document.querySelector("#x").addEventListener('click',function(){
    document.querySelector(".welcome").style.display='none';
    document.querySelector(".main").style.display='block'
    document.querySelector('body').style.backgroundColor='white'
})

// Elementlarni olish
const colorDisplay = document.getElementById('color');
const boxes = document.querySelectorAll('.color-box div');
const statusDisplay = document.getElementById('status');
const attemptDisplay = document.getElementById('attemp');
const refreshButton = document.getElementById('refresh');
const header = document.getElementById('header');
const scoreDisplay = document.getElementById('score'); // Score elementi

// Boshlang'ich qiymatlar
let score = 0;
let attempts = 3;
let correctColor;
let correctBoxIndex;
let gameOver = false; // O'yin holatini nazorat qilish uchun

// Tasodifiy rang hosil qilish
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random()).toFixed(2); // Alfa qiymat
    return `rgba(${r},${g},${b},${a})`;
}

// Ranglarni qutilarga joylashtirish
function assignColors() {
    gameOver = false; // O'yin boshidan boshlanganini ko'rsatish
    correctColor = getRandomColor();
    colorDisplay.textContent = correctColor;

    // Qaysi box to'g'ri rangni o'z ichiga oladi
    correctBoxIndex = Math.floor(Math.random() * boxes.length);
    
    // Console.log orqali to'g'ri rangning indexini ko'rsatish
    console.log(`Correct color is in box ${correctBoxIndex + 1}`);

    boxes.forEach((box, index) => {
        if (index === correctBoxIndex) {
            box.style.backgroundColor = correctColor; // To'g'ri rangni bitta qutiga joylashtirish
        } else {
            box.style.backgroundColor = getRandomColor(); // Qolgan qutilarga tasodifiy ranglar
        }
        box.classList.remove('disabled'); // Qutilarni ishga tushirish
    });

    // Refresh tugmasini faollashtirishni o'chirish
    refreshButton.disabled = true;
}

// Ranglarni normalizatsiya qilish (taqqoslash uchun)
function normalizeColor(color) {
    let temp = document.createElement("div");
    temp.style.backgroundColor = color;
    document.body.appendChild(temp);
    let computedColor = window.getComputedStyle(temp).backgroundColor;
    document.body.removeChild(temp);
    return computedColor;
}

// Yorqin rang uchun qora matn qilish
function updateTextColorIfWhite(color) {
    const rgbaValues = color.match(/\d+/g).map(Number); // rgba qiymatlarini ajratish
    const brightness = (rgbaValues[0] * 0.299 + rgbaValues[1] * 0.587 + rgbaValues[2] * 0.114); // Yorqinlikni hisoblash

    // Agar yorqinlik katta bo'lsa (oq rang yoki unga yaqin bo'lsa), matn qora bo'ladi
    if (brightness > 186) {
        scoreDisplay.style.color = '#000';
        colorDisplay.style.color = '#000';
    }
}

// Rangni tanlash va tekshirish
function checkColor(event) {
    if (attempts > 0 && !gameOver && !event.target.classList.contains('disabled')) {
        const selectedColor = normalizeColor(event.target.style.backgroundColor); // Tanlangan rangni normallashtirish
        const normalizedCorrectColor = normalizeColor(correctColor); // To'g'ri rangni normallashtirish

        if (selectedColor === normalizedCorrectColor) {
            statusDisplay.textContent = "Your status: Correct!";
            header.style.backgroundColor = correctColor; // Header fon rangini o'zgartirish
            score++; // Skorni oshirish
            scoreDisplay.textContent = `Score : ${score}`; // Score-ni yangilash

            updateTextColorIfWhite(correctColor); // Agar rang oq bo'lsa, matn rangini qora qilish

            // Hamma boxlarni to'g'ri rangga o'zgartirish
            boxes.forEach(box => {
                box.style.backgroundColor = correctColor;
                box.classList.add('disabled'); // Boxlarni ishlamas qilish
            });
            gameOver = true; // O'yinni tugatish

            // Refresh tugmasini faollashtirish
            refreshButton.disabled = false;
        } else {
            attempts--;
            statusDisplay.textContent = "Your status: Incorrect !.";
            attemptDisplay.textContent = `Attempt: ${attempts}`;
        }

        if (attempts === 0 && !gameOver) {
            statusDisplay.textContent = "Your status: Game Over!";
            boxes.forEach(box => box.classList.add('disabled')); // O'yin tugasa, barcha boxlarni bloklash
            
            // Refresh tugmasini faollashtirish
            refreshButton.disabled = false;
        }
    }
}

// Qutilarga bosinganda rangni tekshirishni boshlash
boxes.forEach(box => {
    box.addEventListener('click', checkColor);
});

// Sahifani yangilash va o'yinni qayta boshlash
refreshButton.addEventListener('click', () => {
    if (attempts === 0 || gameOver) {
        attempts = 3;
        attemptDisplay.textContent = `Attempt: ${attempts}`;
        statusDisplay.textContent = "Your status: ";
        header.style.backgroundColor = ' rgb(79, 181, 236)'; // Header fon rangini defaultga qaytarish
        scoreDisplay.style.color = '#fff'; // Score va header rangini default oq qilish
        colorDisplay.style.color = '#fff';
        assignColors(); // Ranglarni yangidan berish
    }
});

// O'yinni boshlash
assignColors();

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");
    const closeBtn = document.querySelector(".overlay-close");
    const overlayImg = document.querySelector(".overlay-img");
    const overlayCountry = document.querySelector(".overlay-country");
    const overlayDesc = document.querySelector(".overlay-desc");
    const overlayStatus = document.querySelector(".overlay-status");
    const rentBtn = document.querySelector(".rent-btn");
    let activeButton = null;

    // 1. ОРЕНДА ТА LOCALSTORAGE
    let rentedHouses = JSON.parse(localStorage.getItem("rentedHouses")) || [];

    document.querySelectorAll(".desc-btn").forEach(btn => {
        if (rentedHouses.includes(btn.dataset.id)) {
            btn.dataset.rent = "true";
        }

        btn.addEventListener("click", () => {
            activeButton = btn;
            overlayImg.src = btn.dataset.img;
            overlayCountry.textContent = `${btn.dataset.flag} ${btn.dataset.country}`;
            overlayDesc.textContent = btn.dataset.desc;
            
            if (btn.dataset.rent === "true") {
                overlayStatus.textContent = "❌ Вже орендовано";
                overlayStatus.style.color = "red";
                rentBtn.textContent = "Орендовано";
                rentBtn.disabled = true;
            } else {
                overlayStatus.textContent = "✅ Доступно для оренди";
                overlayStatus.style.color = "green";
                rentBtn.textContent = `Орендувати — ${btn.dataset.price} грн/день`;
                rentBtn.disabled = false;
            }
            overlay.classList.remove("hidden");
        });
    });

    rentBtn.addEventListener("click", () => {
        if (!activeButton) return;

        let attempts = 0;
        while (attempts < 3) {
            const phone = prompt("Введіть ваш номер телефону (наприклад +380501234567):");
            if (phone === null) return; // user cancelled
            const cleaned = phone.replace(/[^+\d]/g, '');
            if (/^\+?\d{7,15}$/.test(cleaned)) {
                // success
                alert("Ми звяжемось з вами протягом 20 хвилин");

                activeButton.dataset.rent = "true";
                overlayStatus.textContent = "❌ Вже орендовано";
                overlayStatus.style.color = "red";
                rentBtn.textContent = "Орендовано";
                rentBtn.disabled = true;

                if (!rentedHouses.includes(activeButton.dataset.id)) {
                    rentedHouses.push(activeButton.dataset.id);
                    localStorage.setItem("rentedHouses", JSON.stringify(rentedHouses));
                }
                return;
            } else {
                alert("Невірний номер. Спробуйте ще раз або натисніть Скасувати.");
                attempts++;
            }
        }
    });

    closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.add("hidden"); });

    // 2. ГОРИЗОНТАЛЬНА ПРОКРУТКА
    const gallery = document.querySelector('.gallery');
    gallery.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        gallery.scrollLeft += evt.deltaY;
    });

    // 3. ПАДАЮЧІ КУЛЬКИ (ЕФЕКТ)
    const container = document.getElementById("ball-container");
    function createBall() {
        const ball = document.createElement("div");
        ball.classList.add("falling-ball");
        const size = Math.random() * 8 + 4;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.left = `${Math.random() * 100}vw`;
        ball.style.animationDuration = `${Math.random() * 3 + 5}s`;
        container.appendChild(ball);
        ball.addEventListener("animationend", () => ball.remove());
    }
    setInterval(createBall, 300);
});
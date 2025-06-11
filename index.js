let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
    signup.style.color = "white";
    login.style.color = "#3b141c";
});

login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
    login.style.color = "white";
    signup.style.color = "#3b141c";
});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-box");
    const signupForm = document.querySelector(".signup-box");

    // Handle Login
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent form from submitting the default way

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            const response = await fetch("http://localhost:5161/api/Auth/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                // You can store a token here, e.g., localStorage.setItem("token", data.token);
                window.location.href = "/order.html"; // redirect after login
            } else {
                alert(data.message || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Network error. Please try again.");
        }
    });

    // Handle Signup
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = signupForm.name.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm.confirm_password.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5161/api/Auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful!");
                window.location.href = "/signin.html"; // redirect after signup
            } else {
                alert(data.message || "Signup failed.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Network error. Please try again.");
        }
    });
});


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

// Dummy authentication - no storage needed

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-box");
    const signupForm = document.querySelector(".signup-box");

    // Handle Login (Dummy - always succeeds)
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // Simple validation
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Dummy login - always successful
        alert("Login successful! Welcome back!");
        sessionStorage.setItem("loggedInUser", JSON.stringify({
            email: email
        }));
        window.location.href = "./order.html";
    }); 

    // Handle Signup (Dummy - always succeeds)
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const name = signupForm.name.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm.confirm_password.value;

        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Dummy signup - always successful
        alert("Signup successful! You can now login.");
        
        // Switch to login tab
        slider.classList.remove("moveslider");
        formSection.classList.remove("form-section-move");
        login.style.color = "white";
        signup.style.color = "#3b141c";
        
        // Clear the signup form
        signupForm.reset();
    });
});
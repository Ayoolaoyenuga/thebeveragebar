const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
  document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton.addEventListener("click", () => menuOpenButton.click());

navLinks.forEach((link) => {
  link.addEventListener("click", () => menuOpenButton.click());
});
const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetweem: 25,
  slidesPerView: 3,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerview: 1,
    },
    768: {
      slidesPerview: 2,
    },
    1024: {
      slidesPerview: 3,
    },
  },
});

// Contact Form Handler
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");
  
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nameInput = contactForm.querySelector('input[placeholder="Your name"]');
    const emailInput = contactForm.querySelector('input[placeholder="Your email"]');
    const messageInput = contactForm.querySelector('textarea');
    
    try {
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      };

      const response = await fetch("http://localhost:5161/api/Comment/{id}", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        alert("Thank you! Your message has been sent successfully.");
        contactForm.reset(); // Clear the form
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to send message. Please try again.");
    }
  });
});

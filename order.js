var typed = new Typed("#text", {
  strings: [
    " aroma awakens memories and flavor stirs the soul",
    " creativity is brewed, blended, shaken, and served.",
    " chilled meets cozy and flavor knows no limits",
  ],
  typeSpeed: 50,
  backSpeed: 60,
  backDelay: 1000,
  loop: true,
});

const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetweem: 25,
  slidesPerView: 3,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch products from API
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5161/api/Products");
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Create HTML for a single product
  function createProductHTML(product) {
    // Use the backend URL for images
    const backendUrl = "http://localhost:5161";
    const imagePath = `${backendUrl}/images/${product.productimg}${product.productimg.includes('.') ? '' : '.png'}`;
      
    return `
      <li class="testimonial swiper-slide">
        <img src="${imagePath}" alt="${product.name}" class="user-image" onerror="this.src='images/default-product.png'">
        <h3 class="name">${product.name}</h3>
        <i class="feedback">₦${product.price.toLocaleString()}</i>
      </li>
    `;
  }

  // Create HTML for a category section
  function createCategorySection(category) {
    return `
      <section class="testimonials-section" id="category-${category.id}">
        <h2 class="section-title">${category.name}</h2>
        <div class="section-class">
          <div class="slider-container swiper">
            <div class="slider-wrapper">
              <ul class="testimonials-list swiper-wrapper">
                ${category.products.map(product => createProductHTML(product)).join('')}
              </ul>
              <div class="swiper-pagination"></div>
              <div class="swiper-slide-button swiper-button-prev"></div>
              <div class="swiper-slide-button swiper-button-next"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Initialize products
  async function initializeProducts() {
    const categories = await fetchProducts();
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero-section');
    
    // Verify image paths and log any missing images
    categories.forEach(category => {
      category.products.forEach(product => {
        const img = new Image();
        const backendUrl = "http://localhost:5161";
        const imagePath = `${backendUrl}/images/${product.productimg}${product.productimg.includes('.') ? '' : '.png'}`;
        img.onerror = () => console.warn(`Warning: Image not found for ${product.name}: ${imagePath}`);
        img.src = imagePath;
      });
    });
    
    // Clear existing product sections
    const existingSections = document.querySelectorAll('.testimonials-section');
    existingSections.forEach(section => section.remove());
    
    // Add new product sections after hero section
    categories.forEach(category => {
      heroSection.insertAdjacentHTML('afterend', createCategorySection(category));
    });

    // Initialize all new Swiper instances
    categories.forEach(category => {
      new Swiper(`#category-${category.id} .slider-container`, {
        loop: true,
        grabCursor: true,
        spaceBetween: 25,
        slidesPerView: 3,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    });
  }

  // Initialize products on page load
  await initializeProducts();

  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const feedbackMessage = document.createElement("div");
  feedbackMessage.id = "feedback-message";
  document.body.appendChild(feedbackMessage);

  let cart = [];

  const products = document.querySelectorAll(".testimonial");
  products.forEach((product) => {
    product.addEventListener("click", () => {
      const name = product.querySelector(".name").textContent.trim();
      const rawPrice = product.querySelector(".feedback").textContent.trim();
      const cleanPrice = parseInt(rawPrice.replace(/[₦,]/g, ""));

      if (!name || isNaN(cleanPrice)) {
        console.warn("Missing or invalid product data:", { name, cleanPrice });
        return;
      }

      const existingItem = cart.find((item) => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price: cleanPrice, quantity: 1 });
      }

      updateCartUI();
      showPopupMessage(`${name} added to cart ✅`);
    });
  });

  function updateCartUI() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const li = document.createElement("li");
      li.style.fontSize = "1.1rem";
      li.style.fontWeight = "600";
      li.style.marginBottom = "10px";

      li.innerHTML = `
  ${item.name} ×${item.quantity} - ₦${itemTotal.toLocaleString()}
  <button class="remove-btn">Remove</button>
`;

      li.querySelector("button").addEventListener("click", () => {
        cart.splice(index, 1);
        updateCartUI();
      });

      cartList.appendChild(li);
    });

    cartTotal.textContent = `Total: ₦${total.toLocaleString()}`;
    cartTotal.style.fontSize = "1.3rem";
    cartTotal.style.fontWeight = "bold";
  }

  function showPopupMessage(message) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.position = "fixed";
    feedbackMessage.style.bottom = "30px";
    feedbackMessage.style.right = "30px";
    feedbackMessage.style.background = "#28a745";
    feedbackMessage.style.color = "#fff";
    feedbackMessage.style.padding = "10px 20px";
    feedbackMessage.style.borderRadius = "8px";
    feedbackMessage.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    feedbackMessage.style.fontSize = "1rem";
    feedbackMessage.style.zIndex = 1000;
    feedbackMessage.style.opacity = 1;

    setTimeout(() => {
      feedbackMessage.style.transition = "opacity 0.5s ease";
      feedbackMessage.style.opacity = 0;
    }, 1800);
  }

  updateCartUI();

  const checkoutForm = document.getElementById("checkout-form");
  const checkoutMessage = document.getElementById("checkout-message");

  checkoutForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !address) {
      checkoutMessage.style.color = "red";
      checkoutMessage.textContent = "Please fill in all required fields.";
      return;
    }

    if (cart.length === 0) {
      checkoutMessage.style.color = "red";
      checkoutMessage.textContent =
        "Your cart is empty. Please add items before submitting.";
      return;
    }

    try {
      const orderData = {
        customerName: name,
        phoneNumber: phone,
        deliveryAddress: address,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      const response = await fetch("http://localhost:5161/api/OrderItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        checkoutMessage.style.color = "green";
        checkoutMessage.textContent = `✅ Thank you, ${name}! Your order has been submitted successfully.`;
        
        // Clear cart and form
        cart = [];
        checkoutForm.reset();
        updateCartUI();
      } else {
        throw new Error(data.message || "Failed to submit order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      checkoutMessage.style.color = "red";
      checkoutMessage.textContent = "Failed to submit order. Please try again.";
    }
  });
});

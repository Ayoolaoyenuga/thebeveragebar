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
      const response = await fetch("http://localhost:5161/api/Category");
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
    // Use the exact backend URL format
    const backendUrl = "http://localhost:5161";
    // Don't add .png extension - use the exact image name from the API
    const imagePath = `${backendUrl}/images/${product.productimg}`;
      
    return `
      <li class="testimonial swiper-slide" data-product-id="${product.id}">
        <img src="${imagePath}" alt="${product.name}" class="user-image" 
             onerror="console.error('Failed to load image:', '${imagePath}')">
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

  // Update the click handler for products
  function initializeProductClickHandlers() {
    const products = document.querySelectorAll(".testimonial");
    products.forEach((product) => {
      product.addEventListener("click", () => {
        const productId = product.dataset.productId;
        const name = product.querySelector(".name").textContent.trim();
        const rawPrice = product.querySelector(".feedback").textContent.trim();
        const cleanPrice = parseInt(rawPrice.replace(/[₦,]/g, ""));

        if (!name || isNaN(cleanPrice) || !productId) {
          console.warn("Missing or invalid product data:", { name, cleanPrice, productId });
          return;
        }

        const existingItem = cart.find((item) => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ 
            productId: productId,
            name: name,
            price: cleanPrice,
            quantity: 1 
          });
        }

        updateCartUI();
        showPopupMessage(`${name} added to cart ✅`);
      });
    });
  }

  // Initialize products
  async function initializeProducts() {
    const categories = await fetchProducts();
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero-section');
    
    // Log the image URLs we're trying to load
    categories.forEach(category => {
      category.products.forEach(product => {
        console.log(`Loading image for ${product.name}:`, `http://localhost:5161/images/${product.productimg}`);
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

    // Initialize click handlers for the new products
    initializeProductClickHandlers();
  }

  // Initialize products on page load
  await initializeProducts();

  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const feedbackMessage = document.createElement("div");
  feedbackMessage.id = "feedback-message";
  document.body.appendChild(feedbackMessage);

  let cart = [];

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
    const phone = document.getElementById("phonenumber").value.trim();
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
        name: name,
        phoneNumber: phone,
        deliveryAddress: address,
        items: cart.map(item => ({
          quantity: item.quantity,
          productId: item.productId
        }))
      };

      const response = await fetch("http://localhost:5161/api/OrderItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      // Log the response for debugging
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
        data = { message: responseText };
      }

      if (response.ok) {
        checkoutMessage.style.color = "green";
        checkoutMessage.textContent = `✅ Thank you, ${name}! Your order has been submitted successfully.`;
        
        // Clear cart and form
        cart = [];
        checkoutForm.reset();
        updateCartUI();
      } else {
        throw new Error(data.message || responseText || "Failed to submit order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      checkoutMessage.style.color = "red";
      checkoutMessage.textContent = `Failed to submit order: ${error.message}`;
    }
  });

  // Helper: Get category ID from hash (e.g. #/category/1)
  function getCategoryIdFromHash() {
    const match = window.location.hash.match(/^#\/category\/(\d+)/);
    return match ? match[1] : null;
  }

  // Fetch and render a single category by ID
  async function fetchAndRenderCategory(categoryId) {
    try {
      const response = await fetch(`http://localhost:5161/api/Category/${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      const category = await response.json();

      // Find or create the section to render into
      let section = document.getElementById("category-section");
      if (!section) {
        section = document.createElement("section");
        section.id = "category-section";
        document.querySelector("main").insertBefore(section, document.querySelector(".pending-orders-section"));
      }

      // Render category title and products
      section.innerHTML = `
        <h2>${category.name}</h2>
        <ul class="testimonials-list swiper-wrapper">
          ${category.products.map(product => `
            <li class="testimonial swiper-slide">
              <img src="http://localhost:5161/images/${product.productimg}" alt="${product.name}" class="user-image">
              <h3 class="name">${product.name}</h3>
              <i class="feedback">₦${product.price.toLocaleString()}</i>
            </li>
          `).join('')}
        </ul>
      `;

      // (Optional) Re-initialize Swiper if needed
      // new Swiper(".slider-wrapper", { ... });

    } catch (error) {
      console.error(error);
    }
  }

  // Listen for hash changes (routing)
  window.addEventListener("hashchange", () => {
    const categoryId = getCategoryIdFromHash();
    if (categoryId) fetchAndRenderCategory(categoryId);
  });

  // On page load, check if a category route is present
  document.addEventListener("DOMContentLoaded", () => {
    const categoryId = getCategoryIdFromHash();
    if (categoryId) fetchAndRenderCategory(categoryId);
  });
});

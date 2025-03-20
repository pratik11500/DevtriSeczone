document.addEventListener("DOMContentLoaded", function () {
  // Navbar toggle behavior
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler) {
    navbarToggler.addEventListener("click", function () {
      navbarCollapse.classList.toggle("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !navbarCollapse.contains(e.target) &&
        !navbarToggler.contains(e.target)
      ) {
        navbarCollapse.classList.remove("show");
      }
    });

    // Close menu when clicking a nav link
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        navbarCollapse.classList.remove("show");
      });
    });
  }

  // Navbar scroll behavior
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Chatbot functionality
  const chatbotIcon = document.querySelector(".chatbot-icon");
  const chatbotContainer = document.querySelector(".chatbot-container");
  const closeChat = document.querySelector(".close-chat");
  const chatbotMessages = document.querySelector(".chatbot-messages");
  const chatOptions = document.querySelectorAll(".chat-option");

  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "bot-message";
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  const responses = {
    services:
      "We offer various services including security services, IT security, manpower solutions, staffing services, consistency services, and payroll services.",
    contact:
      "You can reach us at:\nPhone: +91 78270 50067\nEmail: info@devtriseczone.com",
    location:
      "We are located at:\nShop/4, Panchdhapa Apt, Thankar Pada, Kalyan, Maharashtra, India, 421301",
    hours:
      "Our office hours are:\nMonday to Saturday: 9:00 AM - 6:00 PM\nSunday: Closed",
  };

  if (chatbotIcon && chatbotContainer) {
    chatbotIcon.addEventListener("click", () => {
      chatbotContainer.style.display = "block";
    });

    closeChat.addEventListener("click", () => {
      chatbotContainer.style.display = "none";
    });

    // Handle chat options
    chatOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const type = option.getAttribute("data-option");
        addMessage(option.textContent, true);
        setTimeout(() => {
          addMessage(responses[type]);
        }, 500);
      });
    });

    // Close chat when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !chatbotContainer.contains(e.target) &&
        !chatbotIcon.contains(e.target) &&
        chatbotContainer.style.display === "block"
      ) {
        chatbotContainer.style.display = "none";
      }
    });
  }

  // Slideshow functionality
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");

  function showSlides() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    slides[slideIndex - 1].classList.add("active");
    setTimeout(showSlides, 3000); // Change slide every 3 seconds
  }

  if (slides.length > 0) {
    slides[0].classList.add("active");
    setTimeout(showSlides, 3000);
  }

  // Lazy loading images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      // Store original src in data-src
      if (!img.dataset.src) {
        img.dataset.src = img.src;
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent placeholder
      }
      imageObserver.observe(img);
    });
  }

  // Contact toggle functionality
  const contactToggle = document.querySelector(".contact-toggle");
  const contactOptions = document.querySelector(".contact-options");

  if (contactToggle) {
    contactToggle.addEventListener("mouseenter", function () {
      contactOptions.classList.add("show");
    });

    contactToggle.addEventListener("mouseleave", function () {
      contactOptions.classList.remove("show");
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 75,
          behavior: "smooth",
        });
      }
    });
  });

  // Form validation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        e.preventDefault();
        alert("Please fill in all fields");
        return false;
      }

      if (!isValidEmail(email)) {
        e.preventDefault();
        alert("Please enter a valid email address");
        return false;
      }
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

    // Contact form submission handler
  document.querySelectorAll("#contact-form form, #contactForm").forEach((form) => {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      const formData = {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
      };

      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        const popup = document.getElementById("popup-notification");

        if (data.success) {
          console.log('Form submitted successfully');
          popup.textContent = "Message sent successfully!";
          popup.style.backgroundColor = "#28a745";
          this.reset();
          if (document.querySelector('.overlay')) {
            document.querySelector('.overlay').style.display = "none";
          }
          if (document.querySelector('#contact-form')) {
            document.querySelector('#contact-form').style.right = "-350px";
          }
        } else {
          popup.textContent = "Failed to send message";
          popup.style.backgroundColor = "#dc3545";
        }

        popup.style.display = "block";
        setTimeout(() => {
          popup.style.display = "none";
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });


  // Initialize Bootstrap tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
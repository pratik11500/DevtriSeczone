async function updateVisitorCount() {
  try {
    const response = await fetch('/visitor-count');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const visitorCountElement = document.querySelector('.visitor-counter span');
    if (visitorCountElement) {
      visitorCountElement.textContent = `${data.count} Visitors`;
    }
  } catch (err) {
    console.error('Error updating visitor count:', err);
  }
}

// Update visitor count immediately and every 30 seconds
setInterval(updateVisitorCount, 30000);

document.addEventListener("DOMContentLoaded", function () {
  // Update visitor count when page loads
  updateVisitorCount();
  // Navbar toggle behavior
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler) {
    navbarToggler.addEventListener("click", function (e) {
      e.stopPropagation();
      navbarCollapse.classList.toggle("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (navbarCollapse.classList.contains("show") && 
          !navbarCollapse.contains(e.target) && 
          !navbarToggler.contains(e.target)) {
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
        name: this.querySelector('[name="name"]').value.trim(),
        email: this.querySelector('[name="email"]').value.trim(),
        message: this.querySelector('[name="message"]').value.trim()
      };

      if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all fields');
        submitButton.disabled = false;
        return;
      }

      try {
        console.log('Sending form data:', formData);
        const response = await fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        const popup = document.getElementById("popup-notification");

        if (data.success) {
          console.log('Form submitted successfully:', data);
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
          console.error('Submission failed:', data.error);
          popup.textContent = "Failed to send message";
          popup.style.backgroundColor = "#dc3545";
        }

        popup.style.display = "block";
        setTimeout(() => {
          popup.style.display = "none";
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        submitButton.disabled = false;
      } finally {
        submitButton.disabled = false;
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

  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-message');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const typingIndicator = document.getElementById('typing-indicator');

  async function sendMessage(message) {
    if (!message.trim()) return;

    addMessage(message, true);
    typingIndicator.style.display = "block";
    chatInput.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        typingIndicator.style.display = "none";

        if (data.reply) {
            addMessage(data.reply);
        } else {
            addMessage("Sorry, I couldn't process your request.");
        }
    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.style.display = "none";
        addMessage("Sorry, there was an error processing your message.");
    }
  }

  sendButton.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(chatInput.value);
    }
  });

  function addMessage(message,isUser){
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }


});

// Help Bot functionality
document.addEventListener('DOMContentLoaded', function() {
  const botToggle = document.getElementById('bot-toggle');
  const botContainer = document.getElementById('bot-container');
  const closeBot = document.getElementById('close-bot');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-message');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const typingIndicator = document.getElementById('typing-indicator');

  botToggle.addEventListener('click', function() {
    if (botContainer.style.display === 'none' || !botContainer.style.display) {
        botContainer.style.display = 'block';
    }
});

  closeBot.addEventListener('click', () => {
    botContainer.style.display = 'none';
  });

  async function sendMessage(message) {
    if (!message.trim()) return;

    addMessage(message, true);
    typingIndicator.style.display = "block";
    chatInput.value = '';

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      typingIndicator.style.display = "none";

      if (data.reply) {
        addMessage(data.reply);
      } else {
        addMessage("Sorry, I couldn't process your request.");
      }
    } catch (error) {
      console.error('Chat error:', error);
      typingIndicator.style.display = "none";
      addMessage("Sorry, there was an error processing your message.");
    }
  }

  function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  sendButton.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(chatInput.value);
    }
  });

  // Add initial bot message
  addMessage("Hello! How can I help you today?");
});

// Slideshow functionality
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].classList.add('active');
    setTimeout(showSlides, 3000); // Change slide every 3 seconds
}

if (slides.length > 0) {
    slides[0].classList.add('active');
    setTimeout(showSlides, 3000);
}

// Lazy loading images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        // Store original src in data-src
        if (!img.dataset.src) {
            img.dataset.src = img.src;
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent placeholder
        }
        imageObserver.observe(img);
    });
}
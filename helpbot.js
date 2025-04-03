/**
 * Devtri Seczone - Help Bot JavaScript
 * Author: Web Development Team
 * Version: 1.0
 * 
 * This script handles the interactive help bot functionality that assists users
 * with common questions about Devtri Seczone's services and support.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Help Bot Elements
    const helpBotIcon = document.getElementById('helpBotIcon');
    const helpBotChat = document.getElementById('helpBotChat');
    const helpBotContainer = document.querySelector('.help-bot-container');
    const closeHelpBot = document.getElementById('closeHelpBot');
    const helpBotMessages = document.getElementById('helpBotMessages');
    const helpBotInput = document.getElementById('helpBotInput');
    const sendMessage = document.getElementById('sendMessage');
    const quickQuestionBtns = document.querySelectorAll('.quick-question-btn');

    // Knowledge Base for Help Bot Responses
    const knowledgeBase = {
        // Common questions and responses
        "what services do you offer": 
            "We offer a range of services including Security Services, IT Security, Staffing, and Payroll Services. Our security offerings include Security Auditing, Penetration Testing, Incident Response, and Security Consulting. You can visit our Services page for more details.",

        "do you offer security audits": 
            "Yes, we provide comprehensive security audits to evaluate your organization's security posture against industry standards and best practices. Our auditing services include ISO 27001 gap analysis, compliance assessments, and technical control verification.",

        "how can i contact support": 
            "You can reach our support team via phone at +91 78270 50067 or email us at info.ds@devtriseczone.com. Our office hours are Monday to Friday, 9:00 AM - 6:00 PM and Saturday 10:00 AM - 2:00 PM.",

        "what is penetration testing": 
            "Penetration testing is a simulated cyber attack against your computer system to check for exploitable vulnerabilities. Our experts perform both external and internal network testing, web application testing, and social engineering simulations.",

        "how much do your services cost": 
            "Our pricing varies based on the specific services you need, the size of your organization, and the complexity of your IT infrastructure. Please contact us for a customized quote based on your requirements.",

        "do you offer emergency services": 
            "Yes, our incident response team is available 24/7 for emergency cybersecurity incidents. In case of a security breach or incident, contact our emergency response line at +91 78270 50067.",

        "how long does a security assessment take": 
            "The timeline for a security assessment depends on the scope and complexity. A basic vulnerability assessment may take 1-2 weeks, while a comprehensive security audit could take 3-4 weeks. We'll provide a detailed timeline during our initial consultation.",

        "do you work with small businesses": 
            "Yes, we work with businesses of all sizes. We have tailored security solutions designed specifically for small businesses that provide essential protection while being cost-effective.",

        "what industries do you serve": 
            "We serve a wide range of industries including financial services, healthcare, retail, manufacturing, government, and education. Each industry has unique security requirements, and we customize our solutions accordingly.",

        "what is your approach to security": 
            "We take a holistic approach to security, considering people, processes, and technology. We believe in defense-in-depth strategies and proactive security measures rather than reactive ones.",

        "where are you located": 
            "Our office is located at Shop/4, Panchdhapa Apt, Kalyan, Maharashtra, 421301, India. We serve clients globally and can provide remote services for many of our offerings.",

        "do you offer training": 
            "Yes, we offer comprehensive security awareness training for organizations. This includes customized training programs, phishing simulation exercises, security awareness campaigns, and executive briefings.",

        "what certifications do you have": 
            "Our company holds certifications including ISO 27001, CMMI Level 5, CREST, and PCI DSS. Our security professionals maintain various individual certifications such as CISSP, CEH, OSCP, and CISA.",

        "how can i schedule a consultation": 
            "You can schedule a consultation by filling out the contact form on our website, calling us at +91 78270 50067, or emailing us at info.ds@devtriseczone.com. We'll get back to you within 24 business hours."
    };

    // Default responses when no match is found
    const defaultResponses = [
        "I'm not sure I understand. Could you rephrase your question?",
        "That's a great question. For more detailed information, please contact our team at info.ds@devtriseczone.com or call +91 78270 50067.",
        "I don't have specific information about that. Would you like to speak with one of our security experts? You can reach us at +91 78270 50067.",
        "I don't have enough information to answer that question. For personalized assistance, please contact our support team."
    ];

    // Help Bot functions

    // Initialize Help Bot
    function initHelpBot() {
        // Show/hide chat window when help bot icon is clicked
        if (helpBotIcon) {
            helpBotIcon.addEventListener('click', function() {
                toggleHelpBot();
            });
        }

        // Close chat window when close button is clicked
        if (closeHelpBot) {
            closeHelpBot.addEventListener('click', toggleHelpBot);
        }

        // Send message when send button is clicked
        if (sendMessage) {
            sendMessage.addEventListener('click', sendUserMessage);
        }

        // Send message when Enter key is pressed
        if (helpBotInput) {
            helpBotInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendUserMessage();
                }
            });
        }

        // Handle quick question buttons
        if (quickQuestionBtns) {
            quickQuestionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const question = this.getAttribute('data-question');
                    helpBotInput.value = question;
                    sendUserMessage();
                });
            });
        }

        // Close chat when clicking outside of it
        document.addEventListener('click', function(e) {
            // If help bot is open
            if (helpBotChat && helpBotChat.classList.contains('active')) {
                // Check if click was outside of the help bot container
                if (!helpBotContainer.contains(e.target) || e.target === helpBotContainer) {
                    helpBotChat.classList.remove('active');
                }
            }
        });

        // Prevent click on helpBotContainer from closing it (event propagation)
        helpBotContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Store chat history in local storage
        loadChatHistory();
    }

    // Toggle help bot chat window
    function toggleHelpBot() {
        if (helpBotChat) {
            helpBotChat.classList.toggle('active');

            // Scroll to bottom of chat when opened
            if (helpBotChat.classList.contains('active')) {
                scrollToBottom();

                // Focus on input field
                if (helpBotInput) {
                    helpBotInput.focus();
                }
            }
        }
    }

    // Send user message
    function sendUserMessage() {
        if (!helpBotInput || !helpBotInput.value.trim()) return;

        const userMessage = helpBotInput.value.trim();

        // Add user message to chat
        addMessage(userMessage, 'user');

        // Clear input field
        helpBotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Process the message and get a response after a short delay
        setTimeout(() => {
            removeTypingIndicator();
            processUserMessage(userMessage);
        }, 1000);
    }

    // Process user message and generate a response
    function processUserMessage(message) {
        const normalizedMessage = message.toLowerCase();
        let response = '';

        // Check for a matching response in the knowledge base
        let foundResponse = false;

        for (const key in knowledgeBase) {
            if (normalizedMessage.includes(key)) {
                response = knowledgeBase[key];
                foundResponse = true;
                break;
            }
        }

        // If no direct match, look for keywords
        if (!foundResponse) {
            if (normalizedMessage.includes('security') && normalizedMessage.includes('audit')) {
                response = knowledgeBase["do you offer security audits"];
                foundResponse = true;
            } else if (normalizedMessage.includes('contact') || normalizedMessage.includes('support') || normalizedMessage.includes('help')) {
                response = knowledgeBase["how can i contact support"];
                foundResponse = true;
            } else if (normalizedMessage.includes('service') || normalizedMessage.includes('offer')) {
                response = knowledgeBase["what services do you offer"];
                foundResponse = true;
            } else if (normalizedMessage.includes('penetration') || normalizedMessage.includes('pen test')) {
                response = knowledgeBase["what is penetration testing"];
                foundResponse = true;
            } else if (normalizedMessage.includes('cost') || normalizedMessage.includes('price') || normalizedMessage.includes('fee')) {
                response = knowledgeBase["how much do your services cost"];
                foundResponse = true;
            }
        }

        // If still no match, use a default response
        if (!foundResponse) {
            const randomIndex = Math.floor(Math.random() * defaultResponses.length);
            response = defaultResponses[randomIndex];
        }

        // Add bot response to chat
        addMessage(response, 'bot');

        // Save chat to history
        saveChatHistory();
    }

    // Add a message to the chat
    function addMessage(message, sender) {
        if (!helpBotMessages) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;

        messageElement.appendChild(messageContent);
        helpBotMessages.appendChild(messageElement);

        // Scroll to bottom of chat
        scrollToBottom();
    }

    // Show typing indicator
    function showTypingIndicator() {
        if (!helpBotMessages) return;

        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot-message', 'typing-indicator');

        const typingContent = document.createElement('div');
        typingContent.classList.add('message-content');
        typingContent.innerHTML = '<span></span><span></span><span></span>';

        typingElement.appendChild(typingContent);
        helpBotMessages.appendChild(typingElement);

        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        if (helpBotMessages) {
            helpBotMessages.scrollTop = helpBotMessages.scrollHeight;
        }
    }

    // Save chat history to local storage
    function saveChatHistory() {
        if (!helpBotMessages) return;

        const messages = [];
        const messageElements = helpBotMessages.querySelectorAll('.message:not(.typing-indicator)');

        messageElements.forEach(element => {
            const content = element.querySelector('.message-content').textContent;
            const sender = element.classList.contains('user-message') ? 'user' : 'bot';

            messages.push({
                content,
                sender
            });
        });

        if (messages.length > 0) {
            localStorage.setItem('helpBotChatHistory', JSON.stringify(messages));
        }
    }

    // Load chat history from local storage
    function loadChatHistory() {
        if (!helpBotMessages) return;

        const chatHistory = localStorage.getItem('helpBotChatHistory');

        if (chatHistory) {
            const messages = JSON.parse(chatHistory);

            // Clear existing messages except the welcome message
            const welcomeMessage = helpBotMessages.querySelector('.message');
            helpBotMessages.innerHTML = '';
            if (welcomeMessage) {
                helpBotMessages.appendChild(welcomeMessage);
            }

            // Add messages from history
            messages.forEach(message => {
                addMessage(message.content, message.sender);
            });
        }
    }

    // Initialize the help bot
    initHelpBot();

    // Add CSS for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .message-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            min-width: 60px;
        }

        .typing-indicator span {
            height: 8px;
            width: 8px;
            background-color: #007bff;
            border-radius: 50%;
            display: inline-block;
            margin: 0 3px;
            opacity: 0.4;
            animation: typing 1s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
            animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(2) {
            animation-delay: 0.4s;
        }

        .typing-indicator span:nth-child(3) {
            animation-delay: 0.6s;
        }

        @keyframes typing {
            0% {
                transform: translateY(0);
                opacity: 0.4;
            }
            50% {
                transform: translateY(-5px);
                opacity: 1;
            }
            100% {
                transform: translateY(0);
                opacity: 0.4;
            }
        }
    `;
    document.head.appendChild(style);
});
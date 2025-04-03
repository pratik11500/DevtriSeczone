/**
 * Devtri Seczone - Help Bot JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const helpBotIcon = document.getElementById('helpBotIcon');
    const helpBotChat = document.getElementById('helpBotChat');
    const closeHelpBot = document.getElementById('closeHelpBot');
    const helpBotMessages = document.getElementById('helpBotMessages');
    const helpBotInput = document.getElementById('helpBotInput');
    const sendMessage = document.getElementById('sendMessage');
    const quickQuestionBtns = document.querySelectorAll('.quick-question-btn');

    // Knowledge base for common questions
    const knowledgeBase = {
        "services": "We offer Security Services, IT Security, Staffing, and Payroll Services. Our security offerings include Security Auditing, Penetration Testing, and Security Consulting.",
        "contact": "You can reach our support team via phone at +91 78270 50067 or email us at info.ds@devtriseczone.com.",
        "security audit": "Yes, we provide comprehensive security audits to evaluate your organization's security posture against industry standards.",
        "location": "Our office is located in Kalyan, Maharashtra, India. We serve clients globally.",
        "default": "I'm not sure about that. Please contact our support team at info.ds@devtriseczone.com or call +91 78270 50067 for specific information."
    };

    function toggleChat() {
        helpBotChat.classList.toggle('active');
        if (helpBotChat.classList.contains('active')) {
            helpBotInput.focus();
        }
    }

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        helpBotMessages.appendChild(messageDiv);
        helpBotMessages.scrollTop = helpBotMessages.scrollHeight;
    }

    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = knowledgeBase.default;

        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        setTimeout(() => {
            addMessage(response, 'bot');
        }, 500);
    }

    function handleUserMessage() {
        const message = helpBotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            helpBotInput.value = '';
            processMessage(message);
        }
    }

    // Event Listeners
    helpBotIcon.addEventListener('click', toggleChat);
    closeHelpBot.addEventListener('click', toggleChat);

    sendMessage.addEventListener('click', handleUserMessage);

    helpBotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    quickQuestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            helpBotInput.value = question;
            handleUserMessage();
        });
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (helpBotChat.classList.contains('active') && 
            !helpBotChat.contains(e.target) && 
            !helpBotIcon.contains(e.target)) {
            helpBotChat.classList.remove('active');
        }
    });

    // Add CSS for typing indicator (retained from original code)
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
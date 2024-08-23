let mengetik = false;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;

// Load audio
fetch('assets/keyboard-sound.mp3')
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        audioBuffer = buffer;
    });

// Fungsi untuk memulai sound
function playSound() {
    let source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Fungsi KeyDown
function handleKeyDown(event) {
    const text = document.getElementById('text');
    if (!mengetik) {
        text.textContent = "";
        mengetik = true;
    }

    if (event.key === "Backspace" && event.ctrlKey) {
        let kata = text.textContent.trim().split(" ");
        kata.pop();
        text.textContent = kata.join(" ") + " ";
    } else if (event.key === "Backspace") {
        text.textContent = text.textContent.slice(0, -1);
    } else if (event.key.length === 1) {
        text.textContent += event.key;
    }

    let keyElement = getKeyElement(event);
    if (keyElement) {
        keyElement.classList.add('key--active');
    }
    playSound();
}

// Fungsi KeyUp
function handleKeyUp(event) {
    let keyElement = getKeyElement(event);
    if (keyElement) {
        keyElement.classList.remove('key--active');
    }
}

// Fungsi untuk mengambil elemen
function getKeyElement(event) {
    let keyElement;
    const key = event.key.toUpperCase();

    switch (event.code) {
        case "Space":
            keyElement = document.getElementById('key-Space');
            event.preventDefault();
            break;
        case "Enter":
            keyElement = document.getElementById('key-Enter');
            break;
        case "Backslash":
            keyElement = document.getElementById("key-oneandhalf");
            break;
        case "Backspace":
            keyElement = document.getElementById('key-Backspace');
            break;
        case "CapsLock":
            keyElement = document.getElementById('key-CapsLock');
            break;
        case "Tab":
            keyElement = document.getElementById('key-Tab');
            event.preventDefault();
            break;
        case "ShiftLeft":
        case "ShiftRight":
            keyElement = document.getElementById('key-ShiftLeft');
            break;
        case "ControlLeft":
        case "ControlRight":
            keyElement = document.getElementById('key-ControlLeft');
            break;
        case "AltLeft":
        case "AltRight":
            keyElement = document.getElementById('key-MetaLeft');
            event.preventDefault();
            break;
        case "MetaLeft":
        case "MetaRight":
            keyElement = document.getElementById('key-AltLeft');
            event.preventDefault();
            break;
        default:
            if (event.code.startsWith("Arrow")) {
                keyElement = document.getElementById(`key-${event.code}`);
                event.preventDefault();
            } else {
                keyElement = document.getElementById(`key-${key}`);
            }
    }
    return keyElement;
}

// event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function simulateKeyPress(key) {
    let eventOptions = {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true
    };

    if (key === ' ') {
        eventOptions.key = ' ';
        eventOptions.code = 'Space';
        eventOptions.keyCode = 32;
        eventOptions.which = 32;
    } else if (key === 'Enter') {
        eventOptions.code = 'Enter';
        eventOptions.keyCode = 13;
        eventOptions.which = 13;
    } else if (key === 'Backspace') {
        eventOptions.code = 'Backspace';
        eventOptions.keyCode = 8;
        eventOptions.which = 8;
    } else if (key === 'Tab') {
        eventOptions.code = 'Tab';
        eventOptions.keyCode = 9;
        eventOptions.which = 9;
    } else if (key === 'Shift') {
        eventOptions.code = 'ShiftLeft';
        eventOptions.keyCode = 16;
        eventOptions.which = 16;
    } else if (key === 'Control') {
        eventOptions.code = 'ControlLeft';
        eventOptions.keyCode = 17;
        eventOptions.which = 17;
    } else if (key === 'Alt') {
        eventOptions.code = 'AltLeft';
        eventOptions.keyCode = 18;
        eventOptions.which = 18;
    } else if (key === 'Escape') {
        eventOptions.code = 'Escape';
        eventOptions.keyCode = 27;
        eventOptions.which = 27;
    } else if (key.startsWith('Arrow')) {
        eventOptions.code = key;
        eventOptions.keyCode = key === 'ArrowUp' ? 38 : key === 'ArrowDown' ? 40 : key === 'ArrowLeft' ? 37 : 39;
        eventOptions.which = eventOptions.keyCode;
    }

    let event = new KeyboardEvent('keydown', eventOptions);
    document.dispatchEvent(event);

    setTimeout(() => {
        let eventUp = new KeyboardEvent('keyup', eventOptions);
        document.dispatchEvent(eventUp);
    }, 100); // Adjust delay between keydown and keyup if needed
}

function typeMessage(message, index = 0) {
    if (index < message.length) {
        simulateKeyPress(message[index]);
        setTimeout(() => typeMessage(message, index + 1), 300); // Adjust typing speed here
    }
}

function startTypingMessage() {
    let message = "Hello everyone welcome to my TikTok @codenams";
    typeMessage(message);
}

startTypingMessage();

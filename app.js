let verses = [];
let currentIndex = 0;
let myScore = 0;
let satanScore = 0;

// 1. Load the data from your JSON file
fetch('verses.json')
    .then(response => response.json())
    .then(data => {
        verses = data;
        shuffleVerses(verses); // <--- SHUFFLE happens here right after loading
        displayVerse();
    })
    .catch(error => console.error("Error loading verses:", error));

// 2. The Shuffle Function (Fisher-Yates Algorithm)
function shuffleVerses(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 3. The First-Letter Logic
function getFirstLetters(text) {
    return text.replace(/\b([a-zA-Z])[a-zA-Z]*\b/g, '$1');
}

// 4. Put the verse on the card
function displayVerse() {
    const current = verses[currentIndex];
    
    document.getElementById('ref-front').textContent = current.reference;
    document.getElementById('first-letters').textContent = getFirstLetters(current.text);
    
    document.getElementById('ref-back').textContent = current.reference;
    document.getElementById('full-verse').textContent = current.text;

    document.getElementById('flashcard-inner').classList.remove('is-flipped');
}

// 5. Handle card flipping
document.getElementById('flashcard').addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') {
        document.getElementById('flashcard-inner').classList.toggle('is-flipped');
    }
});

// 6. Success Button (Confetti!)
document.getElementById('btn-success').addEventListener('click', function() {
    myScore++;
    document.getElementById('player-score').textContent = myScore;
    
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
    });

    setTimeout(nextVerse, 1500);
});

// 7. Fail Button (Shake!)
document.getElementById('btn-fail').addEventListener('click', function() {
    satanScore++;
    document.getElementById('enemy-score').textContent = satanScore;
    
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add('shake');
    
    setTimeout(() => {
        flashcard.classList.remove('shake');
        nextVerse();
    }, 800);
});

function nextVerse() {
    currentIndex++;
    
    // If we reach the end of the shuffled list, shuffle again and restart
    if (currentIndex >= verses.length) {
        currentIndex = 0;
        shuffleVerses(verses);
    }
    
    document.getElementById('flashcard-inner').classList.remove('is-flipped');
    setTimeout(displayVerse, 300);
}
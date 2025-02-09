let lastFetchTime = 0; 
const fetchCooldown = 300000; // 5 min cooldown

async function fetchAILoveLetter() {
    const now = Date.now();
    
    if (now - lastFetchTime < fetchCooldown) {
        console.log("⏳ Please wait before requesting another love letter.");
        return; // Prevents spamming OpenAI requests
    }
    
    lastFetchTime = now; // Update last request time

    try {
        const response = await fetch("/.netlify/functions/fetchLoveLetter");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("love-text").innerText = data.text;
    } catch (error) {
        console.error("Error fetching AI-generated love letter:", error);
        document.getElementById("love-text").innerText = "Oops! Couldn't fetch your love letter.";
    }
}



$(document).ready(function () {
    $('.container').click(async function () {
        $('.card').stop().animate({ top: '-90px' }, 'slow');
        await fetchAILoveLetter(); // Load the letter
        playRandomSong(); // Play music on click
    });
});


function playRandomSong() {
    let audioElement = document.getElementById("love-audio");

    let musicTracks = [
        "Ed Sheeran - Thinking Out Loud (Official Music Video).mp3", 
        "Fridayy - When It Comes To You.mp3",
        "Monica  - Why I Love You So Much ( Instrumental karaoke ).mp3"
    ];

    let randomTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    audioElement.src = randomTrack;

    // Play only after a user gesture (click or hover)
    document.body.addEventListener('click', function playMusic() {
        audioElement.play();
        document.body.removeEventListener('click', playMusic); // Ensure it plays only once
    });
}

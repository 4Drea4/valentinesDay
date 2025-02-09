let lastFetchTime = 0; // Track last fetch time
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
        let spotifyTracks = [
            "https://open.spotify.com/embed/track/2XVZCEVm0jwUpJR7nXdJKS?si=b7823a72d3584cb7",
            "https://open.spotify.com/embed/track/1QLU4ozvjUcxft4GdUgxin?si=001f6d2580094cf3",
            "https://open.spotify.com/embed/track/34gCuhDGsG4bRPIf9bb02f?si=7822e054e7ae454b"
        ];
    
        let randomSong = spotifyTracks[Math.floor(Math.random() * spotifyTracks.length)];
        let player = document.getElementById("spotify-player");
    
        // Set the song URL and make sure the player is visible
        player.src = randomSong;
        player.style.display = "block"; 
    }
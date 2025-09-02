const emailInput = document.getElementById("emailInput");
const getStartedBtn = document.getElementById("getStartedBtn");
const message = document.getElementById("message");
const signupForm = document.getElementById("signupForm");
const signin = document.querySelector(".signin-btn");

const API_KEY = "23adbd87f437c7d9cdc191119c857808";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500"; 

// Rows (fixed selectors)
const trendingRow = document.querySelector("#trending .row-posters");
const topRatedRow = document.querySelector("#toprated .row-posters");

async function fetchAndDisplay(url, container) {
    try {
        const res = await fetch(url);
        const data = await res.json();

        data.results.forEach(movie => {
            if (movie.poster_path) {
                // Wrapper
                const wrapper = document.createElement("div");
                wrapper.className = "poster-wrapper";

                // Poster image
                const img = document.createElement("img");
                img.src = IMAGE_URL + movie.poster_path;
                img.alt = movie.title || movie.name;
                img.className = "poster";

                wrapper.appendChild(img);
                container.appendChild(wrapper);

                let iframe = null;

                // Mouse enter: load trailer
                wrapper.addEventListener("mouseenter", async () => {
                    if (iframe) return; // already showing

                    try {
                        const videoRes = await fetch(
                            `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
                        );
                        const videoData = await videoRes.json();
                        const trailer = videoData.results.find(v => v.type === "Trailer");

                        if (trailer) {
                            iframe = document.createElement("iframe");
                            iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`;
                            iframe.width = "250";
                            iframe.height = "250";
                            iframe.allow = "autoplay; encrypted-media";
                            iframe.style.border = "none";

                          
                            wrapper.innerHTML = "";
                            wrapper.appendChild(iframe);
                        }
                    } catch (err) {
                        console.error("Trailer fetch failed:", err);
                    }
                });

                // Mouse leave: restore poster
                wrapper.addEventListener("mouseleave", () => {
                    if (iframe) {
                        wrapper.innerHTML = "";
                        wrapper.appendChild(img);
                        iframe = null;
                    }
                });
            }
        });
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

// Calls
fetchAndDisplay(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`, trendingRow);
fetchAndDisplay(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`, topRatedRow);

// Email validation
getStartedBtn.addEventListener("click", function(){
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email===""){
        message.textContent="Please enter your email.";
        message.style.color="red";
        emailInput.focus();
    }else if(!emailPattern.test(email)){
        message.textContent="Invalid email address. Please enter a valid email address.";
        message.style.color="red";
    }else{
        message.textContent="Thanks! Your email looks good!";
        message.style.color="white";
        emailInput.value=""; 
    }
});

// Scroll buttons
document.querySelectorAll(".scroll-btn").forEach(button => {
    button.addEventListener("click", () => {
        // Find the posters container in the same row as the clicked button
        const row = button.closest(".row");
        const movieCards = row.querySelector(".row-posters");
        const scrollAmount = 500;

        if (button.classList.contains("scroll-left")) {
            movieCards.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else if (button.classList.contains("scroll-right")) {
            movieCards.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    });
});



signupForm.addEventListener("submit", function(event){
    event.preventDefault(); 
    console.log("Email submitted."); 
});

signin.addEventListener("click", function(){
    console.log("Signin clicked!");
    emailInput.focus();
});

const apiKey = "IKOUGdWgm4CGqmSVuLMpVsDYcsO166Ax3n4o5sFl";
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const currentImageContainer = document.getElementById("image-content");
const searchHistoryList = document.getElementById("search-history");

// Runs when page loads
window.addEventListener("load", getCurrentImageOfTheDay);

// Fetches and displays current image of the day
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  await fetchImage(currentDate);
}

// Handles form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedDate = input.value;
  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});

// Fetches image for selected date
async function getImageOfTheDay(date) {
  await fetchImage(date);
  saveSearch(date);
  addSearchToHistory();
}

// Fetch NASA image by date
async function fetchImage(date) {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    displayImage(data);
  } catch (error) {
    currentImageContainer.innerHTML = `<p style="color:red;">Error fetching data: ${error.message}</p>`;
  }
}

// Display image and details
function displayImage(data) {
  currentImageContainer.innerHTML = `
    <h3>${data.title}</h3>
    ${
      data.media_type === "image"
        ? `<img src="${data.url}" alt="${data.title}">`
        : `<iframe src="${data.url}" frameborder="0" width="100%" height="400px"></iframe>`
    }
    <p><strong>Date:</strong> ${data.date}</p>
    <p>${data.explanation}</p>
  `;
}

// Save search date to localStorage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// Add search history to UI
function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searchHistoryList.innerHTML = "";

  searches.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => {
      fetchImage(date);
    });
    searchHistoryList.appendChild(li);
  });
}

// Populate history on load
addSearchToHistory();

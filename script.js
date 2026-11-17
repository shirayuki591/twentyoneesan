
const photos = [
  {
    name: "Violet Evergarden",
    title: "Violet Evergarden",
    category: "Anime",
    type: "Violet Evergarden",
    image: "images/Violet Evergarden-01.jpg"
  },
  {
    name: "2B",
    title: "Nier Automata",
    category: "Game",
    type: "Nier Automata",
    image: "images/2b-01.jpg"
  },
  {
    name: "Echidna",
    title: "Re:zero",
    category: "Anime",
    type: "Re: Zero",
    image: "images/Echidna-01.jpg"
  },
  {
    name: "Kuchiki Rukia",
    title: "Bleach",
    category: "Anime",
    type: "Bleach",
    image: "images/Kuchiki Rukia-01.jpg"
  },
  {
    name: "Cartethyia",
    title: "Wuthering Waves",
    category: "Game",
    type: "Wuthering Waves",
    image: "images/Cartethyia-01.jpg"
  },
  {
    name: "Liu shen",
    title: "Perfect World",
    category: "Donghua",
    type: "Perfect World",
    image: "images/Liu shen-01.jpg"
  },
  {
    name: "Nakano Miku",
    title: "Gotobun no hanayome",
    category: "Anime",
    type: "Gotobun no hanayome",
    image: "images/Nakano Miku-01.jpg"
  },
];

// ELEMENTS

const galleryGrid = document.getElementById("galleryGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const emptyMessage = document.getElementById("emptyMessage");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxArtist = document.getElementById("lightboxArtist");
const closeLightbox = document.getElementById("closeLightbox");

let activeCategory = "All";

let savedFavorites = JSON.parse(
  localStorage.getItem("favorites") || "[]"
);

// CREATE CATEGORY BUTTONS

const categories = [
  ...new Set(photos.map(photo => photo.category))
];

categories.forEach(category => {
  const button = document.createElement("button");

  button.className = "category";
  button.dataset.category = category;
  button.textContent = category;

  categoryButtons.insertBefore(
    button,
    categoryButtons.lastElementChild
  );
});

// CREATE PHOTOCARDS

photos.forEach(photo => {
  const card = document.createElement("article");

  card.className = "photo-card";
  card.dataset.name = photo.name;
  card.dataset.title = photo.title;
  card.dataset.category = photo.category;

  card.innerHTML = `
    <div class="photo-frame">
      <img src="${photo.image}" alt="${photo.name}">
      <span class="photo-fallback">${photo.name}</span>
      <button class="favorite" aria-label="Add to favorites">♡</button>
    </div>

    <div class="photo-info">
      <h3>${photo.name}</h3>
      <p>${photo.type} · ${photo.category}</p>
    </div>
  `;

  const button = card.querySelector(".favorite");
  const img = card.querySelector("img");
  const fallback = card.querySelector(".photo-fallback");

  if (savedFavorites.includes(photo.name)) {
    button.classList.add("liked");
    button.textContent = "♥";
  }

  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "block";
  });

  card.querySelector(".photo-frame").addEventListener("click", event => {
  if (event.target.closest(".favorite")) return;

  lightboxImage.src = img.src;
  lightboxTitle.textContent = photo.name;
  lightboxArtist.textContent =
    "Title: " + photo.title;

  lightbox.classList.add("show");
});

  button.addEventListener("click", () => {
    button.classList.toggle("liked");

    if (button.classList.contains("liked")) {
      if (!savedFavorites.includes(photo.name)) {
        savedFavorites.push(photo.name);
      }
      button.textContent = "♥";
    } else {
      savedFavorites = savedFavorites.filter(
        item => item !== photo.name
      );
      button.textContent = "♡";
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(savedFavorites)
    );

    filterGallery();
  });

  galleryGrid.appendChild(card);
});


// FILTER GALLERY

function filterGallery() {
  const search = searchInput.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".photo-card");

  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const title = card.dataset.title.toLowerCase();
    const category = card.dataset.category.toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      title.includes(search) ||
      category.includes(search);

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Favorites"
        ? card.querySelector(".favorite").classList.contains("liked")
        : category === activeCategory.toLowerCase());

    const show = matchesSearch && matchesCategory;

    card.style.display = show ? "" : "none";

    if (show) visibleCount++;
  });

  emptyMessage.hidden = visibleCount !== 0;
}


// SEARCH

searchInput.addEventListener("input", filterGallery);

// CATEGORY FILTER

categoryButtons.addEventListener("click", event => {
  const button = event.target.closest(".category");

  if (!button) return;

  categoryButtons.querySelectorAll(".category").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");
  activeCategory = button.dataset.category;

  filterGallery();
});

// LIGHTBOX

closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    lightbox.classList.remove("show");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    lightbox.classList.remove("show");
  }
});

filterGallery();


const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".photo-card");
const categoryButtons = document.querySelectorAll(".category");
const emptyMessage = document.getElementById("emptyMessage");

let activeCategory = "All";

function filterGallery() {
  const search = searchInput.value.toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const cosplayer = card.dataset.cosplayer.toLowerCase();
    const category = card.dataset.category;

    const matchesSearch =
  name.includes(search) ||
  cosplayer.includes(search) ||
  category.toLowerCase().includes(search);

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Favorites"
        ? card.querySelector(".favorite").classList.contains("liked")
        : category === activeCategory);

    const show = matchesSearch && matchesCategory;

    card.style.display = show ? "inline-block" : "none";

    if (show) visibleCount++;
  });

  emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterGallery);

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");
    activeCategory = button.dataset.category;

    filterGallery();
  });
});
// SAVE FAVORITES

let savedFavorites = JSON.parse(
  localStorage.getItem("favorites") || "[]"
);

document.querySelectorAll(".photo-card").forEach(card => {
  const button = card.querySelector(".favorite");

  if (savedFavorites.includes(card.dataset.name)) {
    button.classList.add("liked");
    button.textContent = "♥";
  }
});
// FAVORITE BUTTON

document.querySelectorAll(".favorite").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".photo-card");
    const name = card.dataset.name;

    button.classList.toggle("liked");

    if (button.classList.contains("liked")) {
      savedFavorites.push(name);
      button.textContent = "♥";
    } else {
      savedFavorites = savedFavorites.filter(
        item => item !== name
      );
      button.textContent = "♡";
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(savedFavorites)
    );

    filterGallery();
  });
});

filterGallery();
// LIGHTBOX SYSTEM

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxArtist = document.getElementById("lightboxArtist");
const closeLightbox = document.getElementById("closeLightbox");

cards.forEach(card => {
  const img = card.querySelector(".photo-frame img");

  img.addEventListener("click", () => {
    lightboxImage.src = img.src;
    lightboxTitle.textContent = card.dataset.name;
    lightboxArtist.textContent =
      "Cosplayer: " + card.dataset.cosplayer;
    lightbox.classList.add("show");
  });
});
// CLOSE BUTTON

closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

// CLICK OUTSIDE

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    lightbox.classList.remove("show");
  }
});
// ESCAPE KEY

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    lightbox.classList.remove("show");
  }
});
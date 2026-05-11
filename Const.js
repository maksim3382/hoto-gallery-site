const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const navLinks = nav.querySelectorAll("a");
const revealItems = document.querySelectorAll(".reveal");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");
const galleryGrid = document.getElementById("galleryGrid");
const uploadForm = document.getElementById("uploadForm");
const photoInput = document.getElementById("photoInput");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const bindPhotoButtons = () => {
  const photoButtons = document.querySelectorAll(".photo-btn");

  photoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.dataset.src || button.querySelector("img").src;
      const caption = button.dataset.caption || "Памятный кадр";
      lightboxImage.src = src;
      lightboxCaption.textContent = caption;
      lightbox.showModal();
    });
  });
};

bindPhotoButtons();

closeLightbox.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (event) => {
  const rect = lightbox.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    lightbox.close();
  }
});

uploadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const file = photoInput.files[0];

  if (!file) {
    return;
  }

  const imageURL = URL.createObjectURL(file);
  const card = document.createElement("article");
  card.className = "memory-card reveal";
  card.innerHTML = `
    <button class="photo-btn" type="button" data-src="${imageURL}" data-caption="Новое фото из вашей коллекции">
      <img src="${imageURL}" alt="Новая фотография" />
    </button>
    <h3>Новое воспоминание</h3>
    <p>Вы только что добавили этот снимок в памятную галерею.</p>
  `;

  galleryGrid.prepend(card);
  observer.observe(card);
  bindPhotoButtons();
  photoInput.value = "";
});

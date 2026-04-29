const OWNER = "bhuvanm25";
const REPO = "photo-gallery";
const BRANCH = "main";
const FOLDER_PATH = "images";

const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FOLDER_PATH}?ref=${BRANCH}`;
const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

const gallery = document.getElementById("gallery");
const emptyMsg = document.getElementById("empty");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

function isImage(name) {
  const lower = name.toLowerCase();
  return exts.some(ext => lower.endsWith(ext));
}

emptyMsg.style.display = "block";

fetch(apiUrl)
  .then(res => res.json())
  .then(files => {
    if (!Array.isArray(files)) {
      emptyMsg.textContent = "Error loading images.";
      return;
    }

    const images = files.filter(file => file.type === "file" && isImage(file.name));

    if (images.length === 0) {
      emptyMsg.textContent = "No images found yet.";
      return;
    }

    emptyMsg.style.display = "none";

    images.forEach(file => {
      const imgUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${FOLDER_PATH}/${encodeURIComponent(file.name)}`;

      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = file.name;
      img.loading = "lazy";

      card.addEventListener("click", () => {
        lightboxImg.src = imgUrl;
        lightbox.classList.add("active");
      });

      card.appendChild(img);
      gallery.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    emptyMsg.textContent = "Error loading images.";
  });

closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
  lightboxImg.src = "";
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  }
});

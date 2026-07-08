document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.querySelector(".gallery");

  // Build the gallery from the photo manifest (photos.json). To reorder, add,
  // remove, or caption photos, just edit photos.json — no HTML changes needed.
  // Each entry: { "full": "photo1.jpg", "caption": "optional caption" }
  // The thumbnail is derived automatically as images/thumbs/<name>.webp.
  try {
    const res = await fetch("photos.json", { cache: "no-cache" });
    const photos = await res.json();
    const frag = document.createDocumentFragment();
    for (const p of photos) {
      const id = p.full.replace(/\.[^.]+$/, "");
      const img = document.createElement("img");
      img.className = "gallery-img";
      img.src = `images/thumbs/${id}.webp`;
      img.dataset.full = `images/full/${p.full}`;
      if (p.caption) img.dataset.caption = p.caption;
      img.loading = "lazy";
      img.alt = p.alt || "";
      frag.appendChild(img);
    }
    gallery.appendChild(frag);
  } catch (err) {
    console.error("Could not load photos.json:", err);
  }

  const images = Array.from(gallery.querySelectorAll(".gallery-img"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const btnClose = document.querySelector(".lb-close");
  const btnPrev = document.querySelector(".lb-prev");
  const btnNext = document.querySelector(".lb-next");

  let currentIndex = 0;
  let loadToken = 0; // guards against out-of-order loads from rapid clicks

  // Resolve to the full image, falling back to the thumbnail if the full
  // can't be loaded (e.g. missing file). Resolves to the src that's ready.
  function preload(galleryImg) {
    const fullSrc = galleryImg.dataset.full || galleryImg.src;
    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(fullSrc);
      probe.onerror = () => resolve(galleryImg.src); // fall back to thumb
      probe.src = fullSrc;
      if (probe.complete && probe.naturalWidth) resolve(fullSrc); // cached
    });
  }

  // Fade/slide the new image in once it has decoded. `enterX` is the offset
  // it starts from (used for directional slide); pass "0" for a plain scale-in.
  function showImage(galleryImg, enterX) {
    const token = ++loadToken;
    lbCaption.textContent = galleryImg.dataset.caption || "";

    preload(galleryImg).then((src) => {
      if (token !== loadToken) return; // a newer navigation superseded this one

      // Establish the start state, then force a synchronous reflow so the
      // browser registers it before we flip to the end state — this triggers
      // the transition reliably without depending on requestAnimationFrame.
      lbImg.style.transition = "none";
      lbImg.style.opacity = "0";
      lbImg.style.transform = enterX === "0" ? "scale(0.96)" : `translateX(${enterX})`;
      lbImg.src = src;
      void lbImg.offsetWidth; // force reflow

      lbImg.style.transition = "opacity 320ms ease, transform 320ms ease";
      lbImg.style.opacity = "1";
      lbImg.style.transform = enterX === "0" ? "scale(1)" : "translateX(0)";
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    showImage(images[index], "0");
  }

  function closeLightbox() {
    loadToken++; // cancel any in-flight load
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { lbImg.src = ""; }, 400);
  }

  function navigate(dir) {
    const outX = dir > 0 ? "-40px" : "40px";
    const inX  = dir > 0 ?  "40px" : "-40px";

    currentIndex = (currentIndex + dir + images.length) % images.length;

    lbImg.style.transition = "opacity 180ms ease, transform 180ms ease";
    lbImg.style.opacity = "0";
    lbImg.style.transform = `translateX(${outX})`;

    setTimeout(() => showImage(images[currentIndex], inX), 180);
  }

  images.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
  });

  btnClose.addEventListener("click", closeLightbox);

  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(-1);
  });

  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });
});

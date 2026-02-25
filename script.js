document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const captionEl = document.getElementById("lightbox-caption");


  console.log("Gallery images found:", images.length); // debug

  //   let currentIndex = 0;

  // // OPEN
  // images.forEach((img, index) => {
  //   img.addEventListener("click", () => {
  //     currentIndex = index;
  //     lightboxImg.src = img.src;
  //     lightbox.classList.add("open");
  //   });
  // });

  // // CLOSE (click outside)
  // lightbox.addEventListener("click", () => {
  //   lightbox.classList.add("closing");

  //   setTimeout(() => {
  //     lightbox.classList.remove("open", "closing");
  //     lightboxImg.src = "";
  //   }, 450);
  // });

  // // PREVENT image click from closing
  // lightboxImg.addEventListener("click", e => e.stopPropagation());

  // // KEYBOARD NAVIGATION
  // document.addEventListener("keydown", (e) => {
  //   if (!lightbox.classList.contains("open")) return;

  //   if (e.key === "ArrowRight") {
  //     currentIndex = (currentIndex + 1) % images.length;
  //     lightboxImg.style.opacity = 0;
  //     setTimeout(() => {
  //       lightboxImg.src = images[currentIndex].src;
  //       lightboxImg.style.opacity = 1;
  //     }, 100);

  //   }

  //   if (e.key === "ArrowLeft") {
  //     currentIndex =
  //       (currentIndex - 1 + images.length) % images.length;
  //     lightboxImg.style.opacity = 0;
  //     setTimeout(() => {
  //       lightboxImg.src = images[currentIndex].src;
  //       lightboxImg.style.opacity = 1;
  //     }, 100);
  //   }

  //   if (e.key === "Escape") {
  //     lightbox.click();
  //   }
  // });


  images.forEach((img) => {
    img.addEventListener("click", () => {
     lightbox.classList.add("open");
     lightboxImg.src = img.src;
    });

  });

//   lightbox.addEventListener("click", () => {
//     lightbox.classList.remove("open");
//     lightboxImg.src = "";
//   });
    lightboxImg.addEventListener("click", e => e.stopPropagation());


  lightbox.addEventListener("click", () => {
    lightbox.classList.add("closing");

    setTimeout(() => {
     lightbox.classList.remove("open", "closing");
     lightboxImg.src = "";
    }, 500); // must match CSS duration
  });
  
});

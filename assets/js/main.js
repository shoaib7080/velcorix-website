// Main JS file

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Swiper for Hero Section
  const heroSwiper = new Swiper(".hero-slider", {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });

  // Navbar Scroll Effect
  // Navbar Scroll Effect removed as per user request to prevent sticking
  /*
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('fixed-top', 'bg-white', 'shadow');
        } else {
            // Logic if we want transparent navbar at top (optional)
        }
    });
    */
});

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

  // Fix for Dropdown Parent Links on Desktop
  // Allows clicking "Rental Equipments" or "Services" to navigate to their main pages
  // while keeping hover behavior for opening the menu.
  const dropdownToggles = document.querySelectorAll(
    ".nav-item.dropdown > .dropdown-toggle"
  );

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      if (window.innerWidth >= 992) {
        // On desktop, follow the link instead of toggling the dropdown
        // Bootstrap's JS prevents this by default, so we manually redirect
        window.location.href = this.getAttribute("href");
      }
    });
  });
});

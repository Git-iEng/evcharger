/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
   const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId)

   toggle.addEventListener('click', () =>{
       // Add show-menu class to nav menu
       nav.classList.toggle('show-menu')

       // Add show-icon to show and hide the menu icon
       toggle.classList.toggle('show-icon')
   })
}

document.addEventListener("DOMContentLoaded", () => {
    const solutionToggle = document.querySelector('.dropdown-toggle-solutions');
    const solutionItem = solutionToggle.closest('.dropdown__item');

    solutionToggle.addEventListener('click', (e) => {
        e.preventDefault();
        solutionItem.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!solutionItem.contains(event.target)) {
            solutionItem.classList.remove('active');
        }
    });
});

showMenu('nav-toggle','nav-menu')

// Toggle dropdown on arrow click (mobile + desktop)
document.querySelectorAll(".dropdown__item").forEach((item) => {
  const btn = item.querySelector(".dropdown__toggle");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = item.classList.toggle("active");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

// Close dropdown if user clicks outside
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown__item.active").forEach((item) => {
    item.classList.remove("active");
    const btn = item.querySelector(".dropdown__toggle");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
});
// Toggle dropdown on arrow click (open/close)
document.querySelectorAll(".dropdown__item").forEach((item) => {
  const btn = item.querySelector(".dropdown__toggle");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // toggle same dropdown (open -> close, close -> open)
    const isOpen = item.classList.toggle("active");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown__item.active").forEach((item) => {
    item.classList.remove("active");
    const btn = item.querySelector(".dropdown__toggle");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
});
document.querySelectorAll(".dropdown__toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // IMPORTANT: prevents outside-click handler issues

    const item = btn.closest(".dropdown__item");
    const isOpen = item.classList.toggle("active");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

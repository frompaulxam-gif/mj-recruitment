// MJ Recruitment — marketing page interactions (progressive enhancement)

// Chip toggles. data-single groups behave like radios.
document.querySelectorAll(".chips").forEach((group) => {
  const single = group.hasAttribute("data-single");
  group.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (single) {
        group.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
      } else {
        chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") !== "true");
      }
    });
  });
});

// Yes/No segmented toggles
document.querySelectorAll(".seg").forEach((seg) => {
  seg.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
    });
  });
});

// Demo form handling: validate required fields, then show success state.
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;
    form.querySelectorAll("input[required]").forEach((input) => {
      const bad = !input.value.trim();
      input.classList.toggle("error", bad);
      input.closest(".field").classList.toggle("has-error", bad);
      if (bad && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }
    form.classList.add("submitted");
    const success = form.nextElementSibling;
    if (success) success.scrollIntoView({ block: "center", behavior: "smooth" });
  });
  form.addEventListener("input", (e) => {
    if (e.target.matches("input") && e.target.value.trim()) {
      e.target.classList.remove("error");
      e.target.closest(".field")?.classList.remove("has-error");
    }
  });
});

// Scroll reveals — enhancement only; content is visible without JS.
if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("shown");
        entry.target.classList.remove("pending");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) { // only below the fold
      el.classList.add("pending");
      io.observe(el);
    }
  });
}

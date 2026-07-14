// MJ Recruit — marketing page interactions (progressive enhancement)

// MJ's listed WhatsApp number (from their Facebook page). Form submissions
// offer a one-tap WhatsApp handoff with the details pre-written.
// When MJ signs off, forms can ALSO post to an email service; drop the
// endpoint in here and add a fetch() in the submit handler:
// const FORM_ENDPOINT = "https://formspree.io/f/XXXXXX";
const WA_NUMBER = "447703459547";

// Turn a filled form into a readable WhatsApp message
function formToMessage(form) {
  const intro = form.id === "crew-form"
    ? "Hi MJ, I'd like to join the crew."
    : "Hi MJ, staff enquiry from the website.";
  const parts = [intro];
  form.querySelectorAll(".field").forEach((field) => {
    const label = (field.querySelector("label")?.textContent || "").replace(/\(.*?\)/g, "").replace(/\?$/, "").trim();
    const chips = field.querySelectorAll('.chip[aria-pressed="true"]');
    const seg = field.querySelector('.seg [aria-pressed="true"]');
    const input = field.querySelector("input, textarea");
    let value = "";
    if (chips.length) value = [...chips].map((c) => c.textContent.trim()).join(", ");
    else if (seg) value = seg.textContent.trim();
    else if (input) value = input.value.trim();
    if (label && value) parts.push(`${label}: ${value}`);
  });
  return parts.join("\n");
}

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
    if (success) {
      const wa = success.querySelector(".wa-send");
      if (wa) wa.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(formToMessage(form))}`;
      success.scrollIntoView({ block: "center", behavior: "smooth" });
    }
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

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
    const input = field.querySelector("input:not([type='file']), textarea");
    let value = "";
    if (chips.length) value = [...chips].map((c) => c.textContent.trim()).join(", ");
    else if (seg) value = seg.textContent.trim();
    else if (input) value = input.value.trim();
    if (label && value) parts.push(`${label}: ${value}`);
  });
  const cv = form.querySelector('input[type="file"]');
  if (cv?.files?.[0]) parts.push(`CV: ${cv.files[0].name} (attaching it in this chat)`);
  return parts.join("\n");
}

// CV picker: pretty button + filename, real upload comes with the email backend
const cvInput = document.querySelector("#wf-cv");
if (cvInput) {
  document.querySelector("#wf-cv-btn").addEventListener("click", () => cvInput.click());
  cvInput.addEventListener("change", () => {
    const f = cvInput.files[0];
    document.querySelector("#wf-cv-name").textContent = f ? f.name : "No file chosen";
    document.querySelector("#wf-cv-btn").textContent = f ? "Change file" : "Choose file";
  });
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

// Form handling: validate, then hand off to WhatsApp (the real submit).
const ukMobile = (v) => /^(?:\+?44|0)7\d{9}$/.test(v.replace(/[\s\-().]/g, ""));

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;
    form.querySelectorAll("input[required]").forEach((input) => {
      let bad = !input.value.trim();
      if (!bad && input.type === "tel" && !ukMobile(input.value)) {
        bad = true;
        const msg = input.closest(".field").querySelector(".err-msg");
        if (msg) msg.textContent = "That number doesn't look right. UK mobile, like 07700 900123";
      }
      input.classList.toggle("error", bad);
      input.closest(".field").classList.toggle("has-error", bad);
      if (bad && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }
    form.classList.add("submitted");
    const success = form.nextElementSibling;
    if (success) {
      const text = formToMessage(form);
      const wa = success.querySelector(".wa-send");
      if (wa) wa.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      const mail = success.querySelector(".mail-send");
      if (mail) {
        const subject = form.id === "crew-form" ? "Crew application" : "Staff enquiry";
        mail.href = `mailto:staff@mjevents.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      }
      const echo = success.querySelector(".echo");
      const phone = form.querySelector('input[type="tel"]')?.value.trim();
      if (echo && phone) echo.textContent = `Your number: ${phone}. Give it a quick check before sending.`;
      const cvNote = success.querySelector(".cv-note");
      const cvFile = form.querySelector('input[type="file"]')?.files?.[0];
      if (cvNote && cvFile) {
        cvNote.hidden = false;
        cvNote.textContent = `One more thing: after you tap send, attach ${cvFile.name} in the chat (paperclip, then Document).`;
      }
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
  // Observers never fire in hidden tabs; never leave content invisible
  setTimeout(() => document.querySelectorAll(".reveal.pending").forEach((el) => {
    el.classList.add("shown");
    el.classList.remove("pending");
  }), 5000);
}

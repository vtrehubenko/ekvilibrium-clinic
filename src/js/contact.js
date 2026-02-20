const DEFAULT_CHANNEL = "telegram";

function buildMessage({ name, phone, msg, clinicLabel, address }) {
  return (
    `Заявка з сайту EKvilibrium Clinic\n` +
    `Клініка: ${clinicLabel}\n` +
    `Адреса: ${address}\n` +
    `Імʼя: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Повідомлення: ${msg || "-"}\n`
  );
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function showToast(text) {
  const el = document.querySelector("[data-toast]");
  if (!el) return;
  el.textContent = text;
  el.classList.add("is-show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("is-show"), 2200);
}

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const hint = form.querySelector("[data-send-hint]");
  const chips = Array.from(form.querySelectorAll("[data-channel]"));

  const clinicLabelEl = document.querySelector("[data-clinic-current]");
  const addressEl = document.querySelector("[data-address]");
  const tgLink = document.querySelector("[data-tg]");
  const viberLink = document.querySelector("[data-viber]");

  let channel = DEFAULT_CHANNEL;

  function setChannel(next) {
    channel = next;
    chips.forEach((c) =>
      c.classList.toggle("is-active", c.dataset.channel === channel),
    );

    if (!hint) return;
    hint.textContent =
      channel === "viber"
        ? "Viber: ми відкриємо чат, а текст буде скопійовано — просто вставте його."
        : "Telegram: відкриємо чат з готовим повідомленням.";
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => setChannel(chip.dataset.channel));
  });

  setChannel(DEFAULT_CHANNEL);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const msg = (fd.get("msg") || "").toString().trim();

    if (!name || !phone) {
      showToast("Заповніть імʼя та телефон 🙏");
      return;
    }

    const clinicLabel = clinicLabelEl?.textContent?.trim() || "—";
    const address = addressEl?.textContent?.trim() || "—";
    const text = buildMessage({ name, phone, msg, clinicLabel, address });

    if (channel === "telegram") {
      const href = tgLink?.getAttribute("href");
      if (!href) return showToast("Немає Telegram посилання");

      const encoded = encodeURIComponent(text);
      const url = href.includes("?")
        ? `${href}&text=${encoded}`
        : `${href}?text=${encoded}`;
      window.open(url, "_blank", "noopener,noreferrer");
      showToast("Відкриваю Telegram…");
      return;
    }

    if (channel === "viber") {
      const ok = await copyToClipboard(text);
      showToast(
        ok
          ? "Текст скопійовано ✅ Вставте у Viber"
          : "Не вдалося скопіювати текст",
      );

      const href = viberLink?.getAttribute("href");
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
  });
}

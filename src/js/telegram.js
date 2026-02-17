export function initTelegramForm() {
  const form = document.querySelector("[data-tg-form]");
  if (!form) return;

  const TG_USERNAME = "tombri";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const msg = (fd.get("msg") || "").toString().trim();

    const text =
      `Заявка з сайту EKvilibrium Clinic\n` +
      `Імʼя: ${name}\n` +
      `Телефон: ${phone}\n` +
      `Повідомлення: ${msg || "-"}\n`;

    const url = `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

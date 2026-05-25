document.addEventListener("DOMContentLoaded", () => {
  const detailContent = document.querySelector(
    ".main-content--project-detail .content--sidebar"
  );

  if (!detailContent) {
    return;
  }

  const topGradient = document.createElement("div");
  topGradient.className = "scroll-gradient scroll-gradient--top";

  const bottomGradient = document.createElement("div");
  bottomGradient.className = "scroll-gradient scroll-gradient--bottom";

  document.body.appendChild(topGradient);
  document.body.appendChild(bottomGradient);

  const docEl = document.documentElement;

  function updateGradientPosition() {
    const rect = detailContent.getBoundingClientRect();
    const left = `${rect.left}px`;
    const width = `${rect.width}px`;

    topGradient.style.left = left;
    topGradient.style.width = width;

    bottomGradient.style.left = left;
    bottomGradient.style.width = width;
  }

  function updateGradientVisibility() {
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const maxScroll = docEl.scrollHeight - viewportHeight;

    const threshold = 32;
    const shouldShowBottom =
      maxScroll > threshold && window.scrollY < maxScroll - threshold;

    const shouldShowTop = window.scrollY > threshold;

    if (shouldShowBottom) {
      docEl.setAttribute("data-scroll-gradient-bottom", "true");
    } else {
      docEl.removeAttribute("data-scroll-gradient-bottom");
    }

    if (shouldShowTop) {
      docEl.setAttribute("data-scroll-gradient-top", "true");
    } else {
      docEl.removeAttribute("data-scroll-gradient-top");
    }
  }

  updateGradientPosition();
  updateGradientVisibility();

  window.addEventListener(
    "scroll",
    () => {
      updateGradientVisibility();
    },
    {
      passive: true,
    }
  );

  window.addEventListener("resize", () => {
    updateGradientPosition();
    updateGradientVisibility();
  });
});


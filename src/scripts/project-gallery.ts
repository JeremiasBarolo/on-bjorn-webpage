document
  .querySelectorAll<HTMLDialogElement>("[data-project-gallery]")
  .forEach((dialog) => {
    let trigger: HTMLElement | null = null;
    let selected = 0;
    let previousOverflow = "";
    const viewport = dialog.querySelector<HTMLElement>(".gallery-viewport")!;
    const selectors = [
      ...dialog.querySelectorAll<HTMLButtonElement>("[data-gallery-select]"),
    ];
    const views = [
      ...dialog.querySelectorAll<HTMLElement>("[data-gallery-view]"),
    ];
    const zoom = dialog.querySelector<HTMLButtonElement>(
      "[data-gallery-zoom]",
    )!;
    function select(index: number) {
      selected = (index + views.length) % views.length;
      views.forEach((view, i) => {
        view.hidden = i !== selected;
      });
      selectors.forEach((button, i) =>
        button.setAttribute("aria-pressed", String(i === selected)),
      );
      viewport.classList.remove("is-actual-size");
      zoom.setAttribute("aria-pressed", "false");
      viewport.scrollTo(0, 0);
    }
    document
      .querySelectorAll<HTMLAnchorElement>(`[data-gallery-open="${dialog.id}"]`)
      .forEach((link) => {
        link.addEventListener("click", (event) => {
          if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            !dialog.showModal
          )
            return;
          event.preventDefault();
          trigger = link;
          select(0);
          previousOverflow = document.documentElement.style.overflow;
          dialog.showModal();
          document.documentElement.style.overflow = "hidden";
          dialog
            .querySelector<HTMLButtonElement>("[data-gallery-close]")
            ?.focus({ preventScroll: true });
        });
      });
    dialog
      .querySelector("[data-gallery-close]")
      ?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      document.documentElement.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    });
    selectors.forEach((button, i) =>
      button.addEventListener("click", () => select(i)),
    );
    zoom.addEventListener("click", () => {
      const expanded = viewport.classList.toggle("is-actual-size");
      zoom.setAttribute("aria-pressed", String(expanded));
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        select(selected + (event.key === "ArrowRight" ? 1 : -1));
        selectors[selected].focus({ preventScroll: true });
      }
    });
  });

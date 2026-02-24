(() => {
  const TARGET_PATH = "/feed/subscriptions";
  const ROOT_CLASS = "oysl-subscriptions-list";
  const BROWSE_FLAG = "data-oysl-list-enabled";

  const isSubscriptionsPage = () =>
    location.pathname === TARGET_PATH || location.pathname.startsWith(`${TARGET_PATH}/`);

  const applyListLayout = () => {
    const root = document.documentElement;

    if (!isSubscriptionsPage()) {
      root.classList.remove(ROOT_CLASS);

      const oldBrowse = document.querySelector(`ytd-browse[${BROWSE_FLAG}='true']`);
      if (oldBrowse) {
        oldBrowse.removeAttribute(BROWSE_FLAG);
      }
      return;
    }

    root.classList.add(ROOT_CLASS);

    const browse =
      document.querySelector("ytd-page-manager ytd-browse[page-subtype='subscriptions']") ||
      document.querySelector("ytd-browse[page-subtype='subscriptions']");

    if (!browse) {
      return;
    }

    browse.setAttribute(BROWSE_FLAG, "true");

    const grid = browse.querySelector("ytd-rich-grid-renderer");
    if (grid) {
      grid.setAttribute("is-list-view", "true");
    }
  };

  let applyScheduled = false;
  const scheduleApply = () => {
    if (applyScheduled) {
      return;
    }

    applyScheduled = true;
    requestAnimationFrame(() => {
      applyScheduled = false;
      applyListLayout();
    });
  };

  const installHistoryHooks = () => {
    const { pushState, replaceState } = history;

    history.pushState = function patchedPushState(...args) {
      const result = pushState.apply(this, args);
      window.dispatchEvent(new Event("oysl:route-change"));
      return result;
    };

    history.replaceState = function patchedReplaceState(...args) {
      const result = replaceState.apply(this, args);
      window.dispatchEvent(new Event("oysl:route-change"));
      return result;
    };
  };

  const watchMutations = () => {
    const observer = new MutationObserver(() => {
      scheduleApply();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  };

  installHistoryHooks();
  watchMutations();

  window.addEventListener("popstate", scheduleApply, { passive: true });
  window.addEventListener("yt-navigate-finish", scheduleApply, { passive: true });
  window.addEventListener("spfdone", scheduleApply, { passive: true });
  window.addEventListener("oysl:route-change", scheduleApply, { passive: true });

  scheduleApply();
})();

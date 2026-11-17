"use client";

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Offsets mirror animate.css fadeIn* variants used by the reference design.
const reveal: Record<string, gsap.TweenVars> = {
  up: { y: 60 },
  "up-big": { y: 260 },
  "down-big": { y: -260 },
  left: { x: -60 },
  "left-big": { x: -320 },
  right: { x: 60 },
  "right-big": { x: 320 },
  zoom: { scale: 0.4 },
};

const HEADER = 96;

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        smoothTouch: 0.1,
        ignoreMobileResize: true,
      });

      gsap.utils.toArray<HTMLElement>("[data-anim]").forEach((el) => {
        gsap.from(el, {
          ...reveal[el.dataset.anim ?? "up"],
          autoAlpha: 0,
          duration: 1.1,
          delay: Number(el.dataset.delay ?? 0),
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".text-anim").forEach((el) => {
        const split = SplitText.create(el, { type: "words,chars" });
        gsap.from(split.chars, {
          x: 20,
          autoAlpha: 0,
          duration: 1,
          delay: Number(el.dataset.delay ?? 0.1),
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // Each heading line fills from muted grey to brand blue as it scrolls through the viewport.
      gsap.utils.toArray<HTMLElement>(".title-highlight").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.to(self.lines, {
              "--highlight-offset": "100%",
              stagger: 0.4,
              ease: "none",
              scrollTrigger: { trigger: el, scrub: 1, start: "top 80%", end: "bottom center" },
            }),
        });
      });

      const counters = gsap.utils.toArray<HTMLElement>("[data-count]");
      const fmt = new Intl.NumberFormat("en-IN");
      counters.forEach((el) => {
        const value = { n: 0 };
        el.textContent = "0";
        gsap.to(value, {
          n: Number(el.dataset.count),
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = fmt.format(Math.round(value.n));
          },
        });
      });

      const onClick = (e: MouseEvent) => {
        const a = (e.target as Element).closest<HTMLAnchorElement>("a[href*='#']");
        if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
        const target = a.hash === "#top" ? 0 : document.getElementById(a.hash.slice(1));
        if (target === null) return;
        e.preventDefault();
        smoother.scrollTo(target, true, `top ${HEADER}px`);
      };
      document.addEventListener("click", onClick);

      const initial = location.hash && document.getElementById(location.hash.slice(1));
      if (initial) smoother.scrollTo(initial, false, `top ${HEADER}px`);

      return () => {
        document.removeEventListener("click", onClick);
        counters.forEach((el) => {
          el.textContent = fmt.format(Number(el.dataset.count));
        });
      };
    });

    // CSS position:sticky cannot work inside the transformed smooth-content, so pin with ScrollTrigger instead.
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1100px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-pin]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          pin: true,
          pinSpacing: false,
          start: `top ${HEADER}px`,
          endTrigger: el.parentElement,
          end: () => `bottom ${el.offsetHeight + HEADER}px`,
        });
      });
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}

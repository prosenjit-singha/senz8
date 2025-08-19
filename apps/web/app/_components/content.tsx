import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const HomeHeroContent = () => {
  const heroSectionRef = React.useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const title = document.getElementById("hero-title");
      const subtitle = document.getElementById("hero-subtitle");
      gsap.set(title, {
        opacity: 0,
        y: 100,
      });
      gsap.set(subtitle, {
        opacity: 0,
        y: 100,
      });

      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
        },
      });
      tl.to(title, {
        opacity: 1,
        y: 0,
      }).to(
        subtitle,
        {
          opacity: 1,
          y: 0,
        },
        "<0.15"
      );
    },
    { scope: heroSectionRef }
  );
  return (
    <section
      ref={heroSectionRef}
      className="text-center py-8 flex flex-col items-center"
    >
      <h1
        id="hero-title"
        className="uppercase text-7xl font-semibold w-fit text-golden-linear-gradient"
      >
        SENZ8
      </h1>
      <p
        id="hero-subtitle"
        className="uppercase text-2xl text-golden-linear-gradient"
      >
        Dolce & Gabbana
      </p>
    </section>
  );
};

export default HomeHeroContent;

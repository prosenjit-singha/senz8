"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { ShoppingBagIcon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import gsap from "gsap";
import Image from "next/image";
import { Marquee } from "@workspace/ui/components/marquee";

gsap.registerPlugin(SplitText);

const data = [
  {
    heading: "Scent That Defines You",
    subheading: "SENZ8 creates timeless fragrances that leave a lasting impression.",
  },
  {
    heading: "Elegance in Every Note",
    subheading: "Discover perfumes crafted to capture your essence.",
  },
  {
    heading: "Fragrance Beyond Ordinary",
    subheading: "Step into a world where luxury meets individuality.",
  },
  {
    heading: "Unforgettable. Unmistakable.",
    subheading: "With SENZ8, your presence lingers long after you leave.",
  },
  {
    heading: "Crafted for the Modern Soul",
    subheading: "Each scent tells a story — make it yours with SENZ8.",
  },
  {
    heading: "The Art of Fine Fragrance",
    subheading: "Where passion, elegance, and identity blend into every bottle.",
  },
];

const HomePageHeroSection = () => {
  useGSAP(() => {
    const headings = gsap.utils.toArray<HTMLSpanElement>(".hero-heading");
    const subheadings = gsap.utils.toArray<HTMLSpanElement>(".hero-subheading");
    const splitHeadings: SplitText[] = [];
    const splitSubheadings: SplitText[] = [];

    subheadings.forEach((subheading, i) => {
      SplitText.create(subheading, {
        type: "chars,words",
        mask: "chars",
        charsClass: "opacity-0",
        onSplit: (self) => {
          splitSubheadings.push(self);
          gsap.set(self.chars, {
            autoAlpha: 0,
            y: 20,
          });

          return gsap.to(self.chars, {
            autoAlpha: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 20,
            duration: i === 0 ? 0.5 : 0,
            stagger:
              i === 0
                ? {
                    amount: 0.5,
                    from: "random",
                    ease: "power3.out",
                  }
                : undefined,
          });
        },
      });
    });

    document.querySelector(".subheading-container")?.classList.remove("opacity-0");

    headings.forEach((heading, i) => {
      SplitText.create(heading, {
        type: "chars,words",
        mask: "chars",
        onSplit: (self) => {
          splitHeadings.push(self);
          gsap.set(self.chars, {
            autoAlpha: 0,
            y: 20,
          });

          return gsap.to(self.chars, {
            autoAlpha: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 20,
            duration: i === 0 ? 0.5 : 0,
            stagger: i === 0 ? 0.05 : undefined,
          });
        },
      });
    });

    document.querySelector(".hero-heading-container")?.classList.remove("opacity-0");

    gsap.to(".product-image", {
      y: 0,
      duration: 2,
      ease: "elastic.out",
    });

    let index = 1;

    const intervalId = setInterval(() => {
      const prevIndex = index === 0 ? data.length - 1 : index - 1;
      const nextIndex = index + 1;

      // console.log({
      //   prevIndex,
      //   index,
      //   nextIndex,
      //   prevSplit: splitHeadings[prevIndex],
      //   currentSplit: splitHeadings[index],
      // });

      // animate previous item first
      if (splitHeadings[prevIndex]) {
        gsap.to(splitHeadings[prevIndex].chars, {
          y: -20,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.05,
        });
      }

      if (splitHeadings[index]) {
        gsap.fromTo(
          splitHeadings[index].chars,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.5,
            stagger: 0.05,
            onComplete: () => {
              if (nextIndex === data.length) {
                index = 0;
              } else {
                index = nextIndex;
              }
            },
          }
        );
      }

      if (splitSubheadings[prevIndex]) {
        gsap.to(splitSubheadings[prevIndex].chars, {
          y: -20,
          autoAlpha: 0,
          duration: 0.5,
          stagger: {
            amount: 0.5,
            from: "random",
            ease: "power3.out",
          },
        });
      }

      if (splitSubheadings[index]) {
        gsap.fromTo(
          splitSubheadings[index].chars,
          {
            y: 20,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            delay: 0.5,
            stagger: {
              amount: 0.5,
              from: "random",
              ease: "power3.out",
            },
            onComplete: () => {
              if (nextIndex === data.length) {
                index = 0;
              } else {
                index = nextIndex;
              }
            },
          }
        );
      }
    }, 1000 * 10);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <section className="flex flex-col items-center justify-center h-screen overflow-hidden">
      <div className="w-full mb-8 min-h-[350px]">
        <Image
          src="/assets/images/products/perfume-bottle-1.avif"
          alt="Perfume Bottle"
          width={500}
          height={500}
          className="product-image w-full h-full object-contain translate-y-[-200%]"
        />
      </div>
      <div className="w-full flex flex-col">
        <h1 className="hero-heading-container uppercase mb-4 flex relative font-bold text-4xl h-24 items-center text-center opacity-0">
          {data.map(({ heading }, i) => (
            <div key={i} className="hero-heading absolute top-0 left-0 w-full h-full">
              {heading}
            </div>
          ))}
        </h1>
        <div className="subheading-container h-25 w-full relative opacity-0">
          {data.map(({ subheading }, i) => (
            <p
              key={i}
              className="hero-subheading absolute top-0 left-0 w-full h-full text-xl text-center"
            >
              {subheading}
            </p>
          ))}
        </div>
        <Button size={"lg"} className="cta-button rounded-full mx-auto my-8">
          <ShoppingBagIcon /> Shop Now
        </Button>
      </div>

      <div className=" bg-black text-white uppercase text-4xl font-black py-4 mt-auto">
        <Marquee className=" [--duration:20s] [--gap:4rem] " pauseOnHover>
          <p>Unique</p>
          <p>Long Lasting</p>
          <p>Premium Scent</p>
          <p>Signature Blend</p>
        </Marquee>
      </div>
    </section>
  );
};

export default HomePageHeroSection;

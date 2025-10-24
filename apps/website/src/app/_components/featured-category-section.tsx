"use client";

import Image from "next/image";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    name: "Top Sales",
    image: "https://liveaevi.com/cdn/shop/files/Aevi-Web-FaceSerum-03.png?v=1741102733&width=500",
  },
  {
    name: "Latest Products",
    image:
      "https://liveaevi.com/cdn/shop/files/Aevi-Web-Homepage-05-M_ed044d6a-f8b2-4e23-88e0-96dd995e8801.png?v=1741101814&width=2000",
  },
  {
    name: "Recommended Products",
    image:
      "https://liveaevi.com/cdn/shop/files/Aevi-Web-Homepage-NFO-01.png?v=1741091172&width=500",
  },
];

const Category = ({
  name,
  image,
  width,
  height,
  className,
}: {
  name: string;
  image: string;
  width: number;
  height: number;
  className?: string;
}) => {
  return (
    <figure
      className={cn("category-container relative overflow-hidden max-h-[400px] group", className)}
    >
      <Image
        src={image}
        alt={name}
        width={width}
        height={height}
        className="category-image object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
      />
      <figcaption className="category-name absolute bottom-4 left-4 opacity-0">{name}</figcaption>
    </figure>
  );
};

const FeaturedCategorySection = () => {
  const scope = React.useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.set(".category-image", { opacity: 0 });
      gsap.set(".category-name", { opacity: 0, y: 20 });

      const tl = gsap.timeline({ paused: true });

      tl.to(".category-image", {
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.25,
      }).to(
        ".category-name",
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.25,
          ease: "power3.out",
        },
        "<0.25"
      );

      ScrollTrigger.create({
        animation: tl,
        trigger: ".category-container",
        start: "50% 80%",
        end: "50% 0%",
        toggleActions: "play reverse play reverse",
      });
    },
    { scope }
  );
  return (
    <section ref={scope} className="max-w-page mx-auto max-h-[min(100vh,800px)] mb-[100px]">
      <div className="grid grid-cols-12">
        <Category
          name={categories[0].name}
          image={categories[0].image}
          width={400}
          height={800}
          className="col-span-6 lg:col-span-3"
        />
        <Category
          name={categories[1].name}
          image={categories[1].image}
          width={400}
          height={800}
          className="col-span-6 lg:col-span-3"
        />
        <Category
          name={categories[2].name}
          image={categories[2].image}
          width={400}
          height={800}
          className="col-span-12 lg:col-span-6"
        />
      </div>
    </section>
  );
};

export default FeaturedCategorySection;

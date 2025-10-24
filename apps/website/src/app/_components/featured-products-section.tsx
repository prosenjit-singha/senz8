"use client";

import Image from "next/image";
import React from "react";
import { Rating, RatingButton } from "@workspace/ui/components/rating";
import { Button } from "@workspace/ui/components/button";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const FeaturedProductsSection = () => {
  const scope = React.useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const splitHeading = new SplitText(".section-heading", {
        type: "words",
        mask: "words",
        wordsClass: "opacity-0",
      });

      const splitSubHeading = new SplitText(".section-sub-heading", {
        type: "words",
        mask: "words",
        smartWrap: true,
        autoSplit: true,
      });

      gsap.set(splitHeading.words, { alpha: 0, y: 30 });
      gsap.set(splitSubHeading.words, { alpha: 0, y: 20 });

      const tl = gsap.timeline({
        defaults: {
          duration: 0.75,
          ease: "power3.out",
        },
        paused: true,
      });

      tl.to(splitHeading.words, {
        alpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
      }).to(
        splitSubHeading.words,
        {
          alpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
        },
        "<0.25"
      );

      ScrollTrigger.create({
        trigger: ".section-header",
        start: "80% bottom",
        end: "bottom 100px",
        animation: tl,
        toggleActions: "play none none reverse",
      });

      gsap.set(".product-container", { alpha: 0 });

      const products = gsap.utils.toArray<HTMLLinkElement>(".product-container");

      products.forEach((product) => {
        gsap.fromTo(
          product,
          { alpha: 0 },
          {
            alpha: 1,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: product,
              start: "50% bottom",
              end: "bottom 100px",
              // toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope }
  );
  return (
    <section
      ref={scope}
      className="px-page-margin-auto py-page-margin flex flex-col overflow-hidden"
    >
      <div className="section-header mx-auto max-w-2xl mb-8">
        <h2 className="section-heading text-center font-black mb-2">Featured products</h2>
        <p className="section-sub-heading text-center">
          Nam ac egestas est. Mauris et pulvinar risus, at tincidunt lorem. Maecenas tristique sit
          amet odio sit amet aliquet. Quisque a pharetra quam. Sed in ultrices diam, eget sodales
          ligula. Sed ut tincidunt lacus.
        </p>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] xl:grid-cols-4 xl:gap-8 gap-4">
        {PRODUCTS.map((product, i) => (
          <li key={i} className="product-container relative group border-golden rounded-lg">
            {/* <div className="absolute rounded-lg w-full h-full group-hover:h-[60%] bg-transparent group-hover:bg-black/50 bottom-0 left-0 z-[-1] transition-all" /> */}
            <div>
              <Image
                src={product.image}
                alt={product.name.join(" ")}
                width={250}
                height={250}
                className="w-full h-full object-cover group-hover:scale-125 group-hover:-translate-y-10 transition-transform"
              />
            </div>
            <span className="golden-x-line block mb-4" />
            <div>
              <p className="font-bold text-lg text-center">{product.name[0]}</p>
              <p className="text-center">{product.name[1]}</p>
              <div className="flex gap-4 items-center justify-between px-4 mt-4">
                <Rating defaultValue={3} readOnly>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                      // className="text-yellow-500"
                      key={index}
                      size={16}
                    />
                  ))}
                </Rating>

                <span className="text-primary font-black">₹ 4000</span>
              </div>
              <div className="grid grid-cols-2 p-4 gap-4">
                <button
                  className="cursor-pointer group"
                  aria-label="Add to wishlist"
                  title="Add to wishlist"
                  data-selected="false"
                >
                  <HeartIcon className="group-data-[selected=true]:fill-current text-yellow-400 group-hover:scale-110 transition-all duration-300 active:scale-90" />
                </button>
                <Button size="icon" className="ml-auto">
                  <ShoppingCartIcon />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const PRODUCTS = [
  {
    name: ["Velvet Amber Skin", "EAU De Perfume"],
    image: "/assets/images/products/perfume-bottle-1.avif",
    description: "Perfume Bottle 1",
    flavor: "Ambery Floral",
    price: 100,
    model: "",
  },
  {
    name: ["Velvet Amber Sun", "EAU De Perfume"],
    image: "/assets/images/products/perfume-bottle-2.avif",
    description: "Perfume Bottle 2",
    flavor: "Amber Vanilla",
    price: 100,
    model: "",
  },
  {
    name: ["Velvet Black", "Patchouli"],
    image: "/assets/images/products/perfume-bottle-3.avif",
    description: "Perfume Bottle 3",
    flavor: "Chypre Leather",
    price: 100,
    model: "",
  },
  {
    name: ["Velvet Blue Mask", "EAU De Perfume"],
    image: "/assets/images/products/perfume-bottle-4.avif",
    description: "Perfume Bottle 4",
    flavor: "Woody Musky",
    price: 100,
    model: "",
  },
  {
    name: ["Velvet Desert OUD", "EAU De Perfume"],
    image: "/assets/images/products/perfume-bottle-5.avif",
    description: "Perfume Bottle 5",
    flavor: "Leather OUD",
    price: 100,
    model: "",
  },
  {
    name: ["Velvet Desire", "EAU De Perfume"],
    image: "/assets/images/products/perfume-bottle-6.avif",
    description: "Perfume Bottle 6",
    flavor: "Floral White Flower",
    price: 100,
    model: "",
  },
  {
    name: ["Velvet Exotic Leather", "EAU De Perfume"],
    image: "/assets/images/products/perfume-bottle-7.avif",
    description: "Perfume Bottle 7",
    flavor: "Ambery Aromatic",
    price: 100,
    model: "",
  },
];

export default FeaturedProductsSection;

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
import { GetSingleCollectionQuery } from "@/graphql";
import { cn } from "@workspace/ui/lib/utils";
import { formatAmount } from "@/helpers/currency.helper";
import Link from "next/link";
import { Separator } from "@workspace/ui/components/separator";

type FeaturedProductsProps = Omit<
  React.ComponentProps<"section">,
  "children"
> & {
  data: GetSingleCollectionQuery | null;
};

const FeaturedProductsSection = ({
  data,
  className,
  ...props
}: FeaturedProductsProps) => {
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

      const products =
        gsap.utils.toArray<HTMLLinkElement>(".product-container");

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

  if (!data?.collection) {
    return null;
  }

  return (
    <section
      ref={scope}
      className={cn(
        "px-page-margin-auto py-page-margin flex flex-col overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="section-header mx-auto max-w-2xl mb-8">
        <h2 className="section-heading text-center font-black mb-2">
          {data.collection.title}
        </h2>
        <p className="section-sub-heading text-center">
          {data.collection.description}
        </p>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] xl:grid-cols-4 xl:gap-8 gap-4">
        {data.collection.products.nodes.map((product, i) => (
          <li
            key={i}
            className="product-container relative group border rounded-lg"
          >
            <div className="flex absolute top-2 right-2 z-10">
              <Button size="icon" className="ml-auto">
                <ShoppingCartIcon />
              </Button>
            </div>
            {/* <div className="absolute rounded-lg w-full h-full group-hover:h-[60%] bg-transparent group-hover:bg-black/50 bottom-0 left-0 z-[-1] transition-all" /> */}
            <div className="overflow-hidden">
              <Image
                src={product.images.nodes[0].url}
                alt={product.images.nodes[0].altText || product.title}
                width={250}
                height={250}
                className="w-full h-full object-cover group-hover:scale-110 duration-500 transition-transform"
              />
            </div>
            {/* <span className="golden-x-line block mb-4" /> */}
            <Separator />
            <div className="p-2">
              <Link
                href={`/products/${product.handle}`}
                className="flex font-bold text-lg !text-center w-full hover:text-primary transition-colors hover:underline"
              >
                {product.title}
              </Link>
              <p className="text-center mb-4">{product.productType}</p>
              <div className="flex gap-4 items-center justify-center px-4 mt-auto">
                {/* <Rating defaultValue={3} readOnly>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                      // className="text-yellow-500"
                      key={index}
                      size={16}
                    />
                  ))}
                </Rating> */}

                <span className="text-primary text-xl font-black">
                  {formatAmount(
                    product.variants.nodes[0].price.amount,
                    product.variants.nodes[0].price.currencyCode as any
                  )}
                </span>
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

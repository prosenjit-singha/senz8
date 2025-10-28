"use client";

import React from "react";
import Image from "next/image";
import { Swiper as SwiperWrapper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import Swiper from "swiper";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Rating, RatingButton } from "@workspace/ui/components/rating";
import { GetSingleCollectionQuery } from "@/graphql";
import { formatAmount } from "@/helpers/currency.helper";

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

const css = `
.swiper {
  width: 100%;
  padding-bottom: 50px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  /* height: 300px; */
  /* margin: 20px; */
}

.swiper-slide img {
  display: block;
  width: 100%;
}


.swiper-3d .swiper-slide-shadow-left {
  background-image: none;
}
.swiper-3d .swiper-slide-shadow-right{
  background: none;
}
`;
interface CarouselProps {}

type FeaturedProductsProps = Omit<
  React.ComponentProps<"section">,
  "children"
> & {
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  data: GetSingleCollectionQuery | null;
};

const TopProductsSection: React.FC<FeaturedProductsProps> = ({
  autoplayDelay = 5000,
  showPagination = true,
  showNavigation = true,
  data,
}) => {
  const { contextSafe } = useGSAP(() => {});

  const handleOnSlideChange = contextSafe((swiper: Swiper) => {
    PRODUCTS.forEach((p, i) => {
      const slide = document.querySelector(`[data-swiper-slide-index="${i}"]`);
      const content = slide?.querySelector(`[data-slot="content"]`);
      const imageContainer = slide?.querySelector(`.image-container`);

      const names = content?.querySelectorAll(":scope> *");

      if (swiper.realIndex === i) {
        if (content) {
          gsap.to(content, {
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          });
        }
        if (imageContainer) {
          gsap.to(imageContainer, {
            height: 290,
            duration: 0.5,
            ease: "power3.out",
          });
        }
        if (names) {
          gsap.to(names, {
            alpha: 1,
            y: 0,
            stagger: 0.2,
            delay: 0.25,
            duration: 0.75,
            ease: "power3.out",
          });
        }
      } else {
        if (content) {
          gsap.to(content, {
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
          });
        }
        if (imageContainer) {
          gsap.to(imageContainer, {
            height: "100%",
            duration: 0.5,
            ease: "power3.out",
          });
        }
        if (names) {
          gsap.to(names, {
            alpha: 0,
            y: 20,
            duration: 0.5,
            ease: "power3.out",
          });
        }
      }
    });
  });

  if (!data?.collection) {
    return null;
  }

  return (
    <section className="w-ace-y-4 mb-30">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          {/* <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
            Latest component
          </Badge> */}
          <div className="flex flex-col gap-2 items-center w-full py-10 px-10">
            <h3 className="text-4xl text-center opacity-85 font-bold tracking-tight">
              {data.collection.title}
            </h3>
            <p className="text-center">{data.collection.description}</p>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <SwiperWrapper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                onSlideChange={handleOnSlideChange}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {data.collection.products.nodes.map((product, index) => (
                  <SwiperSlide
                    key={index}
                    className="border rounded-2xl bg-background relative min-h-[450px] flex flex-col overflow-hidden"
                  >
                    <div className="absolute w-full top-0 left-0 p-2 flex gap-2 items-center justify-between z-10">
                      <Rating value={3}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <RatingButton key={i} className="text-primary" />
                        ))}
                      </Rating>
                      <span className="font-bold text-center bg-primary text-white rounded-full px-2 py-1 text-sm">
                        {formatAmount(
                          product.variants.nodes[0].price.amount,
                          product.variants.nodes[0].price.currencyCode as any
                        )}
                      </span>
                    </div>
                    <figure className="image-container absolute top-0 left-0 w-full h-full flex justify-center items-center">
                      <Image
                        src={product.images.nodes[0].url}
                        alt={product.images.nodes[0].altText ?? product.title}
                        width={400}
                        height={500}
                        className="object-cover"
                      />
                    </figure>
                    <div
                      data-slot="content"
                      className="overflow-hidden content w-full  absolute bottom-0 left-0 p-4 flex flex-col"
                    >
                      <p className="text-xl font-semibold text-center">
                        {product.title}
                      </p>
                      <p className="text-center text-muted-foreground mb-2">
                        {product.productType}
                      </p>

                      <button className="text-sm border rounded-full px-3 py-1 hover:bg-primary mt-auto hover:text-white transition-colors hover:border-primary hover:shadow mx-auto">
                        View Product
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </SwiperWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopProductsSection;

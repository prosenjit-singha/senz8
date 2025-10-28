"use client";
import React from "react";
import { GetProductByHandleQuery } from "@/graphql";
import { cn } from "@workspace/ui/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./swiper.styles.css";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { ThumbsOptions } from "swiper/types";

type ProductImagePreviewProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & { data: NonNullable<GetProductByHandleQuery["product"]>["images"] };

export default function ProductImagePreview({
  className,
  data,
  ...props
}: ProductImagePreviewProps) {
  const [thumbsSwiper, setThumbsSwiper] = React.useState<
    ThumbsOptions["swiper"] | null
  >(null);
  return (
    <div
      className={cn(
        "flex flex-col lg:max-w-xl overflow-x-auto max-h-vh",
        className
      )}
      data-slot="product-images"
      {...props}
    >
      <Swiper
        style={{
          // @ts-expect-error: swiper types are not compatible with react types
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 border"
      >
        {data.nodes.map((img) => (
          <SwiperSlide key={img.id}>
            <Image
              width={800}
              height={800}
              src={img.url}
              alt={img.altText ?? "Product Image"}
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="swiper-thumbs border border-t-0"
      >
        {data.nodes.map((img) => (
          <SwiperSlide key={img.id}>
            <Image
              width={100}
              height={100}
              src={img.url}
              alt={img.altText ?? "Product Image"}
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

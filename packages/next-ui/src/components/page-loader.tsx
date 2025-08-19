"use client";

import React from "react";
import Image from "next/image";
import Logo from "../../../../assets/logos/SENZ8Logo.png";
import "../styles/page-loader.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const PageLoader = ({
  isLoading = true,
}: {
  isLoading: boolean | "instant";
}) => {
  const timerRef = React.useRef<NodeJS.Timeout>(null);
  const container = React.useRef<HTMLDivElement>(null);
  const animationTimeline = React.useRef<gsap.core.Timeline>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".logo-wrapper", {
        opacity: 0,
        width: 0,
        height: 0,
      });
      gsap.set("[data-slot='background-color']", {
        width: "0%",
        height: "0%",
      });

      animationTimeline.current = gsap
        .timeline({ paused: true })
        .to("[data-slot='background-color']", {
          duration: 1,
          width: "150vmax",
          height: "150vmax",
          ease: "power2.out",
        })
        .to(
          ".logo-wrapper",
          {
            duration: 1,
            opacity: 1,
            width: 100,
            height: 100,
            ease: "power2.out",
          },
          "<0.25"
        )
        .addLabel("finish");
    },
    { scope: container }
  );

  const onHover = contextSafe(() => {
    animationTimeline.current?.reverse();
  });

  const onLeave = contextSafe(() => {
    animationTimeline.current?.play();
  });

  React.useEffect(() => {
    // if isLoading is "instant", play the animation immediately
    if (isLoading === "instant") {
      animationTimeline.current?.play("finish");
    }
    if (isLoading) {
      animationTimeline.current?.play();
    } else {
      timerRef.current = setTimeout(() => {
        animationTimeline.current?.reverse();
      }, 1000);
    }

    // return () => {
    //   if (timerRef.current) {
    //     clearTimeout(timerRef.current);
    //   }
    // };
  }, [isLoading]);

  return (
    <div
      className="loader-bg fixed top-0 left-0 h-svh w-svw z-[9999] pointer-events-none"
      ref={container}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        <div
          data-slot="background-color"
          className="absolute top-1/2 rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 h-0 w-0 aspect-square bg-background blur-2xl"
        />
        <div className="logo-wrapper flex justify-center items-center">
          <Image
            className="logo object-contain min-w-[100px]"
            src={Logo}
            width={100}
            height={100}
            alt="SENZ8 Logo"
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

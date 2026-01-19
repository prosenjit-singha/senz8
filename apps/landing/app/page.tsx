"use client";
// import Camera from "@/components/threejs/camera";
// import { GizmoHelper, GizmoViewport } from "@react-three/drei";
// import LightRays from "@workspace/next-ui/components/light-rays-bg";
// import Navbar from "@workspace/next-ui/components/navbar";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import HomeHeroContent from "./_components/content";
import BottlesScene from "./_components/bottles";
import PageLoader from "@workspace/next-ui/components/page-loader";
import { useGlobalState } from "@/stores/global.store";
import { PRODUCTS } from "@/constants/products";
import { ArrowLeftIcon, ArrowRightIcon, MinusIcon } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Counter from "@workspace/ui/components/counter";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SkyWithGUI from "@/components/threejs/sky";

import { useProgress } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const SLIDE_DURATION = 1.5;
const SLIDE_STAGGER = 0.05;
const SLIDE_EASE = "power3.out";

const gsapSlideConfig = {
  duration: SLIDE_DURATION,
  ease: SLIDE_EASE,
  stagger: SLIDE_STAGGER,
};

export default function Page() {
  const dreiProgress = useProgress();
  const [activeView, setActiveView] = React.useState<string>("hero-section");
  const { state, actions } = useGlobalState();
  const [activeProduct, setActiveProduct] = React.useState(0);
  const [disableChangeBtn, setDisableChangeBtn] = React.useState(false);
  const { contextSafe } = useGSAP(() => {
    const parent = document.querySelector(
      `[data-slot='product-details'][data-index='${activeProduct}']`
    );
    const children = gsap.utils.toArray<HTMLElement>(":scope > *", parent);
    gsap.to(children, {
      opacity: 1,
      x: "0%",
      ...gsapSlideConfig,
    });

    const snapSections = gsap.utils.toArray<HTMLElement>(".snap-section");
    snapSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveView(section.id),
        onEnterBack: () => setActiveView(section.id),
      });
    });

    const snapPoints = snapSections.map(
      (sec) =>
        sec.offsetTop /
        (document.documentElement.scrollHeight - window.innerHeight)
    );

    ScrollTrigger.create({
      snap: (progress) => gsap.utils.snap(snapPoints, progress),
    });

    ScrollTrigger.create({
      trigger: "#canvas-wrapper",
      start: "top top",
      end: "bottom bottom",
      endTrigger: "[data-slot='products-section']",
      pin: true,
    });
  });

  const handleNextProduct = contextSafe(() => {
    if (disableChangeBtn) return;
    const nextIndex = activeProduct + 1;
    if (nextIndex >= PRODUCTS.length) return;

    const parent = document.querySelector(
      `[data-slot='product-details'][data-index='${activeProduct}']`
    );

    const children = gsap.utils.toArray<HTMLElement>(":scope > *", parent);

    // Animate all children
    gsap.to(children, {
      opacity: 0,
      x: "-100%",
      ...gsapSlideConfig,
      onStart: () => setDisableChangeBtn(true),
    });

    const nextParent = document.querySelector(
      `[data-slot='product-details'][data-index='${nextIndex}']`
    );

    const nextChildren = gsap.utils.toArray<HTMLElement>(
      ":scope > *",
      nextParent
    );

    // Animate all children
    gsap.to(nextChildren, {
      opacity: 1,
      x: "0%",
      ...gsapSlideConfig,
      onComplete: () => setDisableChangeBtn(false),
    });
    setActiveProduct(nextIndex);
  });

  const handlePrevProduct = contextSafe(() => {
    if (disableChangeBtn) return;
    const prevIndex = activeProduct - 1;
    if (prevIndex < 0) return;

    const parent = document.querySelector(
      `[data-slot='product-details'][data-index='${activeProduct}']`
    );

    const children = gsap.utils.toArray<HTMLElement>(":scope > *", parent);

    // Animate all children
    gsap.to(children, {
      opacity: 0,
      x: "100%",
      ...gsapSlideConfig,
      onStart: () => setDisableChangeBtn(true),
    });

    const nextParent = document.querySelector(
      `[data-slot='product-details'][data-index='${prevIndex}']`
    );

    const nextChildren = gsap.utils.toArray<HTMLElement>(
      ":scope > *",
      nextParent
    );

    // Animate all children
    gsap.to(nextChildren, {
      opacity: 1,
      x: "0%",
      ...gsapSlideConfig,
      onComplete: () => setDisableChangeBtn(false),
    });

    setActiveProduct(prevIndex);
  });

  const handleShopNowClick = contextSafe(() => {
    setDisableChangeBtn(true);
    setActiveView("products");
    gsap.to(window, {
      duration: 1,
      scrollTo: "#products-section",
      ease: "power2.inOut",
    });
  });

  React.useEffect(() => {
    if (activeView === "products-section") {
      gsap.to("#shop-now-button", {
        opacity: 0,
        pointerEvents: "none",
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to("#product-details-wrapper", {
        opacity: 1,
        pointerEvents: "auto",
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5,
        onComplete: () => {
          setDisableChangeBtn(false);
        },
      });
    } else if (activeView === "hero-section") {
      gsap.to("#shop-now-button", {
        opacity: 1,
        pointerEvents: "auto",
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to("#product-details-wrapper", {
        opacity: 0,
        pointerEvents: "none",
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5,
        onComplete: () => {
          setDisableChangeBtn(false);
        },
      });
    }
  }, [activeView]);

  return (
    <>
      {/* <Navbar /> */}
      <PageLoader
        isLoading={state.isLoading || dreiProgress.progress !== 100}
      />

      {/* <PageLoader /> */}
      {/* <LightRays className="z-[-1] fixed top-0 left-0 w-full h-full" /> */}

      <main className="content-wrapper">
        <div className="snap-section w-full h-screen" id="hero-section">
          <div
            id="canvas-wrapper"
            className="h-full w-full relative pointer-events-none"
          >
            {/* <div
            data-slot="window-light"
            className="absolute top-[45%] left-1/2 w-20 h-30 grid grid-cols-2 gap-4 -translate-x-1/2 -translate-y-1/2 opacity-80 blur-md -skew-y-12"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="bg-white" />
            ))}
          </div> */}
            <Canvas shadows onCreated={() => actions.setIsLoading(false)}>
              {/* Ambient light for subtle fill */}

              {/* <Camera
              position={[0, 1, 6]}
              fov={50}
              lookAt={[0, 0.5, 0]}
              useOrbitControls
              /> */}
              <ambientLight intensity={80} />

              <SkyWithGUI
                distance={4000}
                turbidity={1.2}
                rayleigh={0}
                mieCoefficient={0.001}
                mieDirectionalG={0.85}
                inclination={0.55}
                azimuth={0.28}
                sunPosition={[0, 0.1, -1]}
                exposure={0.13}
                showGUI
              />

              <BottlesScene
                activeSection={activeView}
                activeProductIndex={activeProduct}
              />
              {/* 
              <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport />
              </GizmoHelper> */}
              {/* <mesh position={[0, 0, -1]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#000000" />
            </mesh> */}
              {/* <gridHelper args={[20, 20, "red"]} />
            <axesHelper scale={2} args={[10]} /> */}
            </Canvas>
            <section className="pointer-events-none absolute top-0 left-0 w-full h-full px-page-margin-auto flex flex-col min-h-[calc(100svh-100px)] pt-[150px]">
              <HomeHeroContent />

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 min-h-[120px] min-w-[300px]">
                <div
                  id="product-details-wrapper"
                  className="flex flex-col opacity-0 pointer-events-none"
                >
                  <div className="flex gap-2 items-center pointer-events-auto">
                    <button
                      onClick={handlePrevProduct}
                      disabled={disableChangeBtn || activeProduct === 0}
                      className="border-golden p-2 rounded-full hover:cursor-pointer shadow-xl shadow-transparent hover:shadow-amber-200/10 text-amber-200 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    >
                      <ArrowLeftIcon />
                    </button>
                    <div className="flex flex-col text-center">
                      <div className=" mb-2 mx-auto flex items-center gap-2">
                        <Counter
                          value={activeProduct + 1}
                          places={[10, 1]}
                          fontSize={12}
                          gap={1}
                          className="text-amber-400 saturate-30 text-xs"
                          fontWeight={400}
                        />

                        <MinusIcon size={12} />

                        <span className="text-golden-linear-gradient text-xs">
                          {String(PRODUCTS.length).padStart(2, "0")}
                        </span>
                      </div>
                      <div
                        className="relative w-[400px] h-[100px] text-center mask-x-from-90% mask-x-to-100%"
                        data-slot="product-details-wrapper"
                      >
                        {PRODUCTS.map((product, i) => (
                          <div
                            key={product.image}
                            data-index={i}
                            data-slot="product-details"
                            className="absolute top-0 left-0 w-full h-full *:opacity-0 text-3xl *:translate-x-[100%]"
                          >
                            <p className="text-golden-linear-gradient">
                              {product.name[0]}
                            </p>
                            <p className="text-golden-linear-gradient">
                              {product.name[1]}
                            </p>
                            <p className="text-xs mt-1 text-golden-linear-gradient">
                              {product.flavor}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleNextProduct}
                      disabled={
                        disableChangeBtn ||
                        activeProduct === PRODUCTS.length - 1
                      }
                      className="border-golden p-2 rounded-full hover:cursor-pointer shadow-xl shadow-transparent hover:shadow-amber-200/10 text-amber-200 hover:text-amber-100 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ArrowRightIcon />
                    </button>
                  </div>
                  <button className="relative pointer-events-auto px-10 py-4 text-center font-bold uppercase text-golden-linear-gradient cursor-pointer group">
                    <span className="golden-x-line w-full absolute top-0 left-1/2 -translate-x-1/2 shadow-lg shadow-transparent group-hover:w-[70%] group-hover:shadow-amber-400/20 transition-all" />
                    <span className="transition-colors text-shadow-lg text-shadow-transparent group-hover:text-shadow-amber-300/10">
                      Customize Now
                    </span>
                    <span className="golden-x-line w-full absolute bottom-0 left-1/2 -translate-x-1/2 shadow-lg shadow-transparent group-hover:w-[70%] group-hover:shadow-amber-400/20 transition-all" />
                  </button>
                </div>
                <button
                  onClick={handleShopNowClick}
                  id="shop-now-button"
                  className="pointer-events-auto px-3 py-2 rounded-3xl border-golden mx-auto text-golden-linear-gradient shadow-xl shadow-transparent hover:shadow-amber-500/10 text-shadow-lg hover:text-shadow-amber-400/10 cursor-pointer transition-all hover:scale-110 backdrop-blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  Shop Now
                </button>
              </div>
            </section>
          </div>
        </div>

        <section
          data-slot="products-section"
          id="products-section"
          className="snap-section min-h-screen"
        ></section>
      </main>
    </>
  );
}

/**
 *             <group position={bottlePosition}>
              <DirectionalLight
                position={[0, 1, 0]}
                intensity={50}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <DirectionalLight
                position={[1, 0, 0]}
                intensity={60}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <DirectionalLight
                position={[-1, 0, 0]}
                intensity={60}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <DirectionalLight
                position={[-0.5, 0.5, -1]}
                intensity={50}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <pointLight position={[0, 1, 2]} intensity={100} />
    
              <Spotlight
                // castShadow
                position={[2, 3, 1]}
                intensity={100}
                angle={Math.PI / 5}
                pointAt={[3, 2.5, 0]}
                penumbra={0.9} // softness at edge
                decay={1} // light falloff
                distance={100} // how far it reaches
                useHelper={showHelpers}
              />
            </group>
 */

{
  /* <PerfumeBottleModel position={[2, 0, 0]} scale={20} /> */
}

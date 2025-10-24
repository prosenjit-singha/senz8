"use client";

import React from "react";
import { MailIcon } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const offers: { icon: IconName; title: string }[] = [
  {
    icon: "truck",
    title: "Free Shipping",
  },
  {
    icon: "messages-square",
    title: "24/7 Support",
  },
  {
    icon: "rocket",
    title: "Promotions",
  },
  {
    icon: "crown",
    title: "Top Seller",
  },
];

const NewsletterSection = () => {
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
      gsap.set(".newsletter-form-icon", { opacity: 0, scale: 0 });
      gsap.set(".newsletter-form", {
        opacity: 0,
        scale: 0,
        maxWidth: 62,
        height: 62,
        rotate: 180,
      });

      const tl = gsap.timeline({
        defaults: {
          duration: 1,
          ease: "power3.out",
        },
        paused: true,
      });

      tl.to(splitHeading.words, {
        alpha: 1,
        y: 0,
        stagger: 0.1,
      }).to(
        splitSubHeading.words,
        {
          alpha: 1,
          y: 0,
          stagger: 0.05,
        },
        "<0.35"
      );

      ScrollTrigger.create({
        trigger: ".section-header",
        start: "80% bottom",
        end: "bottom 100px",
        animation: tl,
        toggleActions: "play none none reverse",
      });

      const formTl = gsap.timeline({ paused: true });

      formTl
        .fromTo(
          ".newsletter-form",
          {
            opacity: 0,
            scale: 0,
            rotate: 360,
          },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1,
            ease: "power3.out",
          }
        )
        .to(
          ".newsletter-form",
          {
            maxWidth: 576,
            ease: "power3.out",
          },
          ">-0.15"
        )
        .to(
          ".newsletter-form-icon",
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "elastic.out",
          },
          "<-0.15"
        );

      ScrollTrigger.create({
        trigger: ".newsletter-form",
        start: "bottom 100%-=100px",
        end: "top top",
        animation: formTl,
        toggleActions: "play none none reverse",
      });

      // offer container section

      gsap.from(".offer-container > .golden-x-line", {
        width: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".offer-container",
          start: "top 80%",
          end: "bottom 100%",
        },
      });

      gsap.from(".offer-container .icon-container", {
        opacity: 0,
        width: 0,
        height: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: ".offer-container",
          start: "top 80%",
          end: "bottom 100%",
        },
      });

      gsap.from(".offer-container .title", {
        opacity: 0,
        x: 20,
        duration: 1,
        delay: 0.75,
        ease: "power3.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: ".offer-container",
          start: "top 80%",
          end: "bottom 100%",
        },
      });
    },
    { scope }
  );
  return (
    <section
      ref={scope}
      className="min-h-[max(90vh,600px)] flex flex-col justify-center px-page-margin-auto"
    >
      <div className="section-header mx-auto max-w-2xl mb-8">
        <h2 className="text-center section-heading mb-4">Sign up for our Newsletter</h2>
        <p className="section-sub-heading text-center">
          Get the latest updates on new arrivals, special offers, and more.
        </p>
      </div>
      <form className="newsletter-form mx-auto max-w-xl w-full flex items-center border-primary border group rounded-2xl overflow-hidden outline-4 outline-transparent  has-[&:invalid:focus-within]:outline-red-400/20 has-focus-within:outline-primary/20 transition-colors">
        <MailIcon
          size={40}
          className="newsletter-form-icon mx-4 text-muted-foreground group-has-focus-within:text-primary"
        />
        <input
          className="min-h-15 text-lg focus-visible:border-none focus-visible:outline-none w-full"
          placeholder="your_email@address"
          type="email"
          required
        />
        <button
          type="submit"
          className="ml-4 mr-2 bg-primary h-full block px-4 py-3 rounded-xl group-has-invalid:translate-x-[120%] transition-transform duration-300 cursor-pointer active:scale-90 "
        >
          Submit
        </button>
      </form>

      <div className="offer-container flex flex-col w-full">
        <span className="golden-x-line mt-20 mx-auto w-full" />
        <ul className="max-w-4xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 sm:place-items-center gap-8 md:gap-12 my-4 md:my-8">
          {offers.map((offer, i) => (
            <li key={i} className="flex gap-2 items-center md:text-xl md:gap-4">
              <span className="icon-container text-muted-foreground size-6 md:size-8">
                <DynamicIcon name={offer.icon} className="size-full" />
              </span>
              <span className="title">{offer.title}</span>
            </li>
          ))}
        </ul>
        <span className="golden-x-line mx-auto w-full" />
      </div>
    </section>
  );
};

export default NewsletterSection;

"use client";

import React from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { useGlobalStore } from "@/stores/global.store";
import BrandLogo from "@workspace/next-ui/components/brand-logo";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  LogInIcon,
  MoveRightIcon,
  PlusIcon,
  SearchIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import gsap from "gsap";
import { useCartStore } from "@/stores/cart.store";
import { usePathname } from "next/navigation";
import UserMenuButton from "./user-menu-button";
import { useSession } from "@/components/providers/session.provider";
gsap.registerPlugin(SplitText);

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About US" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { data: session } = useSession();
  const navItemSplitRef = React.useRef<globalThis.SplitText>(null);
  const { state, actions } = useGlobalStore();
  const { state: cartState, actions: cartActions } = useCartStore();
  const pathname = usePathname();

  const { contextSafe } = useGSAP(() => {
    const split = SplitText.create(".nav-link-item", {
      type: "chars,words",
      mask: "chars",
    });
    navItemSplitRef.current = split;
    gsap.set(split.chars, { y: 20, autoAlpha: 0 });
  });

  const handleMenuState = contextSafe((open: boolean) => {
    actions.setIsNavMenuOpen(open);
    const height = open ? "calc(100svh - 45px)" : "0px";

    if (!navItemSplitRef.current) return;

    if (open) {
      // tl.play();
      gsap.fromTo(
        ".nav-footer-buttons > *",
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.25,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.25,
        }
      );
      gsap.to(".nav-container", {
        height,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(navItemSplitRef.current.chars, {
        autoAlpha: 1,
        y: 0,
        duration: 0.15,
        ease: "power3.out",
        stagger: {
          amount: 0.25,
          from: "start",
        },
        delay: 0.15,
      });
    } else {
      gsap.fromTo(
        ".nav-footer-buttons > *",
        {
          autoAlpha: 1,
        },
        {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power3.out",
          stagger: 0.15,
        }
      );
      gsap.to(navItemSplitRef.current.chars, {
        y: 20,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power3.out",
        delay: 0.15,
        stagger: {
          amount: 0.25,
          from: "end",
        },
      });
      gsap.to(".nav-container", {
        height,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.5,
      });
    }
  });

  return (
    <header className="px-page-margin-auto flex gap-4 items-center border-b bg-black fixed top-0 left-0 w-full z-20">
      <div className="sm:hidden">
        <Hamburger
          toggled={state.isNavMenuOpen}
          toggle={(value) => handleMenuState(value as boolean)}
          size={26}
          direction="right"
          duration={0.5}
          color="white"
        />
      </div>

      <BrandLogo className="w-10" imageClassName="h-12" />

      <ul className="hidden sm:flex gap-6 items-center flex-1 justify-end pr-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              data-active={
                link.href.length > 1
                  ? pathname.startsWith(link.href)
                  : pathname === link.href
              }
              className="text-white hover:text-primary transition-colors data-[active=true]:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={() => cartActions.setOpenState(true)}
          className="p-2 rounded-md hover:bg-white/10 text-white cursor-pointer relative active:scale-95 transition-[transform,background-color]"
        >
          {!!cartState.data?.lines && cartState.data?.lines?.length > 0 && (
            <span className="size-5 rounded-full bg-primary absolute top-0 right-0 flex items-center justify-center text-xs font-bold leading-none">
              {cartState.data.lines?.length}
            </span>
          )}
          <ShoppingBagIcon />
        </button>

        {session ? (
          <UserMenuButton />
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
      <nav className="nav-container overflow-hidden h-0 absolute top-[100%] left-0 w-full bg-black text-white ">
        <div className="px-page-margin-auto py-4 flex flex-col h-full">
          <ul className="flex flex-col gap-4 uppercase text-2xl justify-center">
            <li className="relative mb-4">
              <Input
                placeholder="Search Product"
                className="pl-8 peer border-white/20"
              />
              <SearchIcon
                size={16}
                className="absolute top-1/2 left-2 -translate-y-1/2 peer-focus-visible:text-primary text-muted"
              />
            </li>
            {links.map((link) => (
              <li
                key={link.href}
                className="group flex gap-4 items-center justify-center"
              >
                <Link
                  href={link.href}
                  className="nav-link-item group-hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
                <MoveRightIcon className="translate-x-[40px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </li>
            ))}
          </ul>

          <div className="nav-footer-buttons grid grid-cols-2 gap-4 mt-auto">
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

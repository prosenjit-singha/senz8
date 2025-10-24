"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

type NavigationSectionProps = React.ComponentProps<"div"> & {
  title: string;
  subtitle: string;
  links: { href: string; newTab?: boolean; text: string }[];
  listWrapperClassName?: string;
};

const FooterNavigationSection = ({
  className,
  links,
  title,
  subtitle,
  listWrapperClassName,
  ...props
}: NavigationSectionProps) => {
  return (
    <div data-slot={title} className={cn("flex flex-col", className)} {...props}>
      <motion.h6
        viewport={{ amount: 1, margin: "-40px 0px -40px 0px" }}
        whileInView={{
          opacity: 1,
        }}
        transition={{
          duration: 0.75,
          ease: "easeOut",
        }}
        className="font-semibold text-xl mb-1 uppercase opacity-0"
      >
        {title}
      </motion.h6>
      <motion.p
        viewport={{ amount: 1, margin: "-40px 0px -40px 0px" }}
        whileInView={{
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
          delay: 0.25,
        }}
        className="text-muted-foreground mb-4 opacity-0"
      >
        {subtitle}
      </motion.p>
      <ul className={cn("flex flex-col gap-2", listWrapperClassName)}>
        {links.map((link, i) => (
          <motion.li
            key={i}
            viewport={{ amount: 1, margin: "-40px 0px -40px 0px" }}
            whileInView={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: i * 0.05,
            }}
            className="opacity-0"
          >
            <Link
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              className="uppercase hover:text-primary "
            >
              {link.text}
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavigationSection;

"use client";
import React from "react";
import BrandLogo from "@workspace/next-ui/components/brand-logo";
import NavigationSection from "./navigation-section";
import { motion } from "motion/react";

const PublicPageFooter = () => {
  return (
    <footer className="px-page-margin-auto py-page-margin grid grid-cols-12 gap-4 gap-y-8 bg-black text-white/90">
      <div className="col-span-12 flex flex-col">
        <motion.div
          viewport={{ amount: 1, margin: "-40px 0px -40px 0px" }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
          className="opacity-0"
        >
          <BrandLogo className="mb-4" imageClassName="size-30" />
        </motion.div>
        <motion.p
          viewport={{ amount: 1, margin: "-40px 0px -40px 0px" }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
          className="opacity-0"
        >
          Subscribe to our newsletter and get 10% off your first order.
        </motion.p>
        <motion.span
          className="golden-x-line mt-8 mx-auto"
          style={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      </div>

      <NavigationSection
        title="Links"
        subtitle="Useful links"
        className="col-span-12 sm:col-span-6 lg:col-span-4"
        links={[
          {
            text: "Home",
            href: "/",
          },
          {
            text: "Shop",
            href: "/shop",
          },
          {
            text: "About Us",
            href: "/about-us",
          },
          {
            text: "Contact Us",
            href: "/contact-us",
          },
        ]}
      />

      <NavigationSection
        title="Account"
        subtitle="Informative details"
        className="col-span-12 sm:col-span-6 lg:col-span-4"
        links={[
          { text: "My order history", href: "/account/order-history" },
          { text: "My favorites", href: "/account/my-favorites" },
          { text: "Returns", href: "/account/my-returns" },
        ]}
      />
      <NavigationSection
        title="Our Shops"
        subtitle="Store locations"
        className="col-span-12 lg:col-span-4 sm:items-center md:items-start"
        listWrapperClassName="sm:flex-row sm:justify-center md:justify-start md:flex-row"
        links={[
          { text: "Mumbai", href: "/shops/mumbai" },
          { text: "Delhi", href: "/shops/delhi" },
          { text: "Bangalore", href: "/shops/bangalore" },
          { text: "Hyderabad", href: "/shops/hyderabad" },
          { text: "Chennai", href: "/shops/chennai" },
          { text: "Pune", href: "/shops/pune" },
        ]}
      />
      <div className="col-span-12 flex flex-col border-white/30">
        <motion.span
          className="golden-x-line mb-2 mx-auto"
          style={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
        <p className="text-center text-white/60">
          Copyright ©{new Date().getFullYear()} SENZ8. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default PublicPageFooter;

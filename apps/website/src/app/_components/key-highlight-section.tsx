import React from "react";

const highlights = [
  {
    title: "Special Offer’s and Discount",
    subtitle: "Up to 50% off",
  },
  {
    title: "70,000+ Collection",
    subtitle: "Unique and trendy",
  },
  {
    title: "Free 30 Days Returns",
    subtitle: "Shop with confidence",
  },
];

const KeyHighlightSection = () => {
  return (
    <section className="px-page-margin-auto py-page-margin flex flex-col min-h-[300px] justify-center">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
        {highlights.map((highlight, i) => (
          <li key={i} className="flex flex-col items-center gap-1">
            <strong className="text-lg font-semibold">{highlight.title}</strong>
            <span>{highlight.subtitle}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KeyHighlightSection;

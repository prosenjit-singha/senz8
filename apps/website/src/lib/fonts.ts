import localFont from "next/font/local";

export const FuturaLTPro = localFont({
  src: [
    { path: "../../../../assets/fonts/FuturaLTProLight.otf", weight: "300" },
    { path: "../../../../assets/fonts/FuturaLTProBook.otf", weight: "400" },
    { path: "../../../../assets/fonts/FuturaLTProMedium.otf", weight: "500" },
    { path: "../../../../assets/fonts/FuturaLTProHeavy.otf", weight: "600" },
    { path: "../../../../assets/fonts/FuturaLTProBold.otf", weight: "700" },
  ],
  variable: "--font-futura-lt-pro",
});

export const WalbaumPro = localFont({
  src: "../../../../assets/fonts/Walbaum10Pro.woff2",
  variable: "--font-walbaum-pro",
  weight: "400",
});

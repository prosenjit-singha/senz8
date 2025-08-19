import BrandLogo from "./brand-logo";

const Navbar = () => {
  return (
    <header className="px-page-margin-auto relative z-10">
      <nav className="border border-highlight p-4 rounded-lg mt-4 backdrop-blur-2xl">
        <BrandLogo imageClassName="max-h-[50px] w-fit" />
      </nav>
    </header>
  );
};

export default Navbar;

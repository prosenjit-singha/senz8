export default function AboutUsPage() {
  return (
    <div className="mx-page-margin-auto py-page-margin">
      <section className="relative container max-w-5xl py-10 md:py-12 lg:py-15">
        <div className="">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            A different
            <br />
            kind of fragrance house.
          </h1>
          <p className="mt-4 max-w-2xl text-2xl text-muted-foreground md:text-3xl">
            We’re on a mission to redefine how people experience perfume — by
            crafting long-lasting, high-quality fragrances that feel personal,
            memorable, and unapologetically bold.
          </p>
        </div>
        <div className="absolute -inset-40 z-[-1] [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_80%)]">
          <svg
            width="32"
            height="32"
            className="h-full w-full text-foreground/[0.05]"
          >
            <defs>
              <pattern
                id="plus-pattern-_r2r_0_"
                x="0"
                y="0"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="8"
                  y1="5"
                  x2="8"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="1"
                ></line>
                <line
                  x1="5"
                  y1="8"
                  x2="11"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="1"
                ></line>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#plus-pattern-_r2r_0_)"
            ></rect>
          </svg>
        </div>
      </section>
      <section className="container max-w-5xl border-y py-5">
        <h2 className="font-mono text-sm font-semibold tracking-widest text-accent-foreground">
          By the numbers
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              50K+
            </h3>
            <p className="mt-1 font-medium text-muted-foreground">
              Happy customers
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              120+
            </h3>
            <p className="mt-1 font-medium text-muted-foreground">
              Signature fragrances
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              20K+
            </h3>
            <p className="mt-1 font-medium text-muted-foreground">
              Bottles delivered
            </p>
          </div>
          <div>
            <h3 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              24/7
            </h3>
            <p className="mt-1 font-medium text-muted-foreground">
              Orders shipped worldwides
            </p>
          </div>
        </div>
      </section>
      <section className="container max-w-5xl py-10 md:py-12 lg:py-15">
        <div className="max-w-2xl space-y-5 md:space-y-8 lg:space-y-10">
          <p className="text-lg">
            Fragrance has evolved — and continues to evolve. What was once
            reserved for luxury boutiques and overpriced labels is now being
            reimagined for modern consumers who value quality, transparency, and
            individuality.
          </p>
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
            Today’s customers don’t just want a scent. They want a story, a
            mood, a memory.
          </h2>
          <p className="text-lg">
            We were always told that great perfumes had to be expensive. That
            craftsmanship required inflated markups, unnecessary complexity, and
            outdated distribution models. So we challenged that belief.
          </p>
          <p className="text-lg">
            Instead of copying legacy fragrance houses, we went back to the
            source — premium ingredients, expert perfumers, and obsessive
            attention to detail. We stripped away the noise, focused on what
            truly matters, and built a fragrance brand from the ground up.
          </p>
        </div>
      </section>
      <section className="my-5 pb-10 md:my-8 md:pb-12 lg:my-12 lg:pb-15">
        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          data-slot="carousel"
        >
          <div className="overflow-hidden" data-slot="carousel-content">
            <div
              className="flex -ml-4"
              style={{ transform: "translate3d(0px, 0px, 0px)" }}
            >
              <div
                role="group"
                aria-roledescription="slide"
                data-slot="carousel-item"
                className="min-w-0 shrink-0 grow-0 pl-4 basis-[80%] lg:basis-1/3 xl:basis-[40%]"
              >
                <div className="relative h-[330px] lg:h-[440px] xl:h-[600px]">
                  <img
                    alt="Perfume bottles on display"
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1200&auto=format&fit=crop"
                  />
                </div>
              </div>
              <div
                role="group"
                aria-roledescription="slide"
                data-slot="carousel-item"
                className="min-w-0 shrink-0 grow-0 pl-4 basis-[80%] lg:basis-1/3 xl:basis-[40%]"
              >
                <div className="relative h-[330px] lg:h-[440px] xl:h-[600px]">
                  <img
                    alt="Luxury fragrance bottle with gold accents"
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop"
                  />
                </div>
              </div>
              <div
                role="group"
                aria-roledescription="slide"
                data-slot="carousel-item"
                className="min-w-0 shrink-0 grow-0 pl-4 basis-[80%] lg:basis-1/3 xl:basis-[40%]"
              >
                <div className="relative h-[330px] lg:h-[440px] xl:h-[600px]">
                  <img
                    alt="Perfume being sprayed into the air"
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-10 md:py-12 lg:py-15">
        <div className="grid gap-5 md:grid-cols-2 md:gap-10 lg:gap-16">
          <img
            alt="Perfume oil being blended by a perfumer"
            width="480"
            height="400"
            className="order-2 aspect-[6/5] w-full max-h-[350px] object-cover md:order-1"
            src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1200&auto=format&fit=crop"
          />
          <div className="order-1 space-y-5 md:order-2 md:space-y-8 lg:space-y-10">
            <p className="text-lg">
              We began crafting our fragrances in 2019 and officially launched
              in 2022. Every scent is developed from the ground up — no
              mass-produced formulas, no shortcuts, no recycled blends. We’re
              purpose-built to create fragrances that stand the test of time,
              not trends.
            </p>
            <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
              We’re a bit different — not your typical perfume brand.
            </h2>
            <p className="text-lg">
              We’re 100% founder- and team-owned, sustainably profitable, and
              intentionally lean. That means every decision is driven by
              quality, not pressure from investors or inflated margins. Over
              time, this page will evolve, but right now our focus is simple:
              creating exceptional fragrances and delivering them reliably to
              our customers.
            </p>
          </div>
        </div>
      </section>
      <section className="container py-10 md:py-12 lg:py-15">
        <div className="grid gap-5 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-semibold tracking-tight md:text-4xl">
              The founding team
            </h2>
            <p className="mt-5 text-lg md:mt-6">
              Our founding team started this journey in 2019, united by a shared
              belief: great perfume shouldn’t be inaccessible or forgettable.
              After years of research, testing, and refinement, we launched in
              2022 with a clear vision — build a fragrance house rooted in
              craftsmanship, transparency, and consistency.
            </p>
            <p>
              We remain fully founder- and team-owned, profitable, and hands-on.
              From formulation to packaging to customer experience, we stay
              close to every detail. If you&apos;re passionate about scent,
              creativity, and building something meaningful from the ground up,
              we&apos;re always open to collaborating with people who share that
              mindset.s
            </p>
          </div>
          <img
            alt="Elegant perfume bottle beside ingredients"
            width="480"
            height="400"
            className="order-1 aspect-[6/5] w-full max-h-[350px] object-cover md:order-2"
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200&auto=format&fit=crop"
          />
        </div>
      </section>
    </div>
  );
}

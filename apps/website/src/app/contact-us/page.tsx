export default function ContactUsPage() {
  return (
    <section className="mx-page-margin-auto py-page-margin">
      <div className="max-w-6xl mx-auto xl:my-20 2xl:my-30">
        <div className="mt-20 flex max-h-120 flex-col justify-between gap-15 md:gap-10 lg:flex-row">
          <div className="flex w-full max-w-lg flex-col justify-between gap-15">
            <div className="relative w-fit">
              <h1 className="text-6xl font-semibold tracking-tight lg:text-7xl">
                Get in Touch
              </h1>
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -top-2 -right-5 size-5 text-red-500 md:size-6"
              >
                <path
                  d="M-0.0078125 0.867188H21.1133V4.89062H2.00391C0.892865 4.89062 -0.0078125 3.98995 -0.0078125 2.87891V0.867188Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M16.9316 0.867188H21.1133V19.9404H19.0225C17.8677 19.9404 16.9316 19.0043 16.9316 17.8496V0.867188Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2 -left-5 size-5 rotate-180 text-red-500 md:size-6"
              >
                <path
                  d="M-0.0078125 0.867188H21.1133V4.89062H2.00391C0.892865 4.89062 -0.0078125 3.98995 -0.0078125 2.87891V0.867188Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M16.9316 0.867188H21.1133V19.9404H19.0225C17.8677 19.9404 16.9316 19.0043 16.9316 17.8496V0.867188Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <ul className="space-y-6">
              <li className="flex items-center gap-8 text-base text-foreground/50">
                <div className="flex size-6 items-center justify-center bg-red-100 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-up size-5"
                    aria-hidden="true"
                  >
                    <path d="m17 11-5-5-5 5"></path>
                    <path d="m17 18-5-5-5 5"></path>
                  </svg>
                </div>
                24/7 Full time support
              </li>
              <li className="flex items-center gap-8 text-base text-foreground/50">
                <div className="flex size-6 items-center justify-center bg-red-100 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-up size-5"
                    aria-hidden="true"
                  >
                    <path d="m17 11-5-5-5 5"></path>
                    <path d="m17 18-5-5-5 5"></path>
                  </svg>
                </div>
                Quick response within 2 hours
              </li>
              <li className="flex items-center gap-8 text-base text-foreground/50">
                <div className="flex size-6 items-center justify-center bg-red-100 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-up size-5"
                    aria-hidden="true"
                  >
                    <path d="m17 11-5-5-5 5"></path>
                    <path d="m17 18-5-5-5 5"></path>
                  </svg>
                </div>
                Expert consultation available
              </li>
              <li className="flex items-center gap-8 text-base text-foreground/50">
                <div className="flex size-6 items-center justify-center bg-red-100 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-up size-5"
                    aria-hidden="true"
                  >
                    <path d="m17 11-5-5-5 5"></path>
                    <path d="m17 18-5-5-5 5"></path>
                  </svg>
                </div>
                Free project assessment
              </li>
            </ul>
            <a
              href=""
              className="flex items-center gap-4 text-4xl font-medium tracking-tighter"
            >
              support@senz8.com
            </a>
          </div>
          <div className="col-span-4 flex w-full flex-col gap-2 lg:pl-10">
            <form className="space-y-2">
              <input
                data-slot="input"
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-15 rounded-xl border-0 border-b-foreground/25 bg-muted shadow-none placeholder:text-foreground/20 placeholder:uppercase focus-visible:ring-0"
                placeholder="Name"
                type="text"
              />
              <input
                data-slot="input"
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-15 rounded-xl border-0 border-b-foreground/25 bg-muted shadow-none placeholder:text-foreground/20 placeholder:uppercase focus-visible:ring-0"
                placeholder="phone (optional)"
                type="text"
              />
              <input
                data-slot="input"
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-15 rounded-xl border-0 border-b-foreground/25 bg-muted shadow-none placeholder:text-foreground/20 placeholder:uppercase focus-visible:ring-0"
                placeholder="Email "
                type="text"
              />
              <textarea
                data-slot="textarea"
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-52 rounded-xl border-0 border-b-foreground/25 bg-muted shadow-none placeholder:text-foreground/20 placeholder:uppercase focus-visible:ring-0"
                placeholder="Message (Tell us about your project)"
              ></textarea>
              <button
                data-slot="button"
                data-variant="default"
                data-size="default"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 has-[&gt;svg]:px-3 h-15 w-full rounded-xl uppercase"
              >
                Submit now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

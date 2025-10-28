import { cn } from "@workspace/ui/lib/utils";
// import { htmlConverterReact } from "html-converter-react";

type ProductDescriptionProps = Omit<
  React.ComponentProps<"section">,
  "children"
> & {
  children: string;
};

export function ProductDescription({
  children,
  className,
  ...props
}: ProductDescriptionProps) {
  // let desc = htmlConverterReact(children);
  // if (typeof desc === "string") {
  //   desc = htmlConverterReact(desc);
  // }

  return (
    <section
      className={cn("", className)}
      data-slot="product-description"
      {...props}
    >
      <div
        dangerouslySetInnerHTML={{ __html: children }}
        className="flex-col flex gap-2"
      ></div>
    </section>
  );
}

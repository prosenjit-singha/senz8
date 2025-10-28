import { cn } from "@workspace/ui/lib/utils";

type TermsOfServiceProps = Omit<React.ComponentProps<"section">, "children"> & {
  children?: string;
};

export default function StoreTermsOfService({
  children,
  className,
  ...props
}: TermsOfServiceProps) {
  if (!children) return null;
  return (
    <section
      className={cn("", className)}
      data-slot="terms-of-service"
      {...props}
    >
      <h2 className="text-lg font-semibold mb-2">Terms of Service</h2>
      <div
        dangerouslySetInnerHTML={{ __html: children }}
        className="flex-col flex gap-2"
      ></div>
    </section>
  );
}

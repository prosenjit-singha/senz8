import { cn } from "@workspace/ui/lib/utils";

type PrivacyPolicyProps = Omit<React.ComponentProps<"section">, "children"> & {
  children?: string;
};

export default function StorePrivacyPolicy({
  children,
  className,
  ...props
}: PrivacyPolicyProps) {
  if (!children) return null;
  return (
    <section
      className={cn("", className)}
      data-slot="privacy-policy"
      {...props}
    >
      <h2 className="text-lg font-semibold mb-2">Privacy Policy</h2>
      <div
        dangerouslySetInnerHTML={{ __html: children }}
        className="flex-col flex gap-2"
      ></div>
    </section>
  );
}

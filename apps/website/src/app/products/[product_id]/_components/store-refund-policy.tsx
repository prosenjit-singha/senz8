import { cn } from "@workspace/ui/lib/utils";
type RefundPolicyProps = Omit<React.ComponentProps<"section">, "children"> & {
  children?: string;
};

export default function StoreRefundPolicy({
  children,
  className,
  ...props
}: RefundPolicyProps) {
  if (!children) return null;
  return (
    <section className={cn("", className)} data-slot="refund-policy" {...props}>
      <h2 className="text-lg font-semibold mb-2">Refund Policy</h2>
      <div
        dangerouslySetInnerHTML={{ __html: children }}
        className="flex-col flex gap-2"
      ></div>
    </section>
  );
}

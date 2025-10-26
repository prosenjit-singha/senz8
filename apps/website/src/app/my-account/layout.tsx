import MyAccountNavigation from "./_components/navigation";

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] mx-page-margin-auto flex flex-col gap-8 py-page-margin">
      <MyAccountNavigation />
      {children}
    </div>
  );
}

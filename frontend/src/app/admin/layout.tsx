import AdminToastContainer from "@/components/AdminToastContainer";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminToastContainer />
      {children}
    </>
  );
}

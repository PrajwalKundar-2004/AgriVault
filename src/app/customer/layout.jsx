import { Toaster } from "sonner";

export const metadata = {
  title: "Customer Portal | AgriVault",
};

export default function CustomerLayout({ children }) {
  return (
    <>
      <Toaster position="top-right" richColors />
      {children}
    </>
  );
}

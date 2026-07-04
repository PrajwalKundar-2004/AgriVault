import { Toaster } from 'sonner';

export default function VaultAdminLayout({ children }) {
  return (
    <>
      <Toaster richColors position="top-right" />
      {children}
    </>
  );
}

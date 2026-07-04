import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export default function AdminDashboardLayout({ children }) {
  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  );
}

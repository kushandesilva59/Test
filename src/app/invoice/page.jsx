import InvoiceTable from "./InvoiceTable";
import InvoiceTableWithModal from "./InvoiceTableWithModal";

export default async function InvoicePage() {
  const res = await fetch("http://localhost:8080/api/invoices", {
    cache: "no-store",
  });
  const invoices = await res.json();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Invoices</h1>
        <InvoiceTableWithModal invoices={invoices} />
      </div>
    </div>
  );
}

export default function InvoiceTable({ invoices }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border border-gray-300">
              Invoice No
            </th>
            <th className="text-left px-4 py-2 border border-gray-300">
              Customer Code
            </th>
            <th className="text-left px-4 py-2 border border-gray-300">
              Invoice Date
            </th>
            <th className="text-left px-4 py-2 border border-gray-300">
              Set Off Date
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceNo} className="cursor-pointer hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300">
                {invoice.invNumber}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {invoice.customerCode}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {invoice.invoiceDate}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {invoice.invoiceSetoffDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

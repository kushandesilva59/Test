"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InvoiceTableWithModal = ({ invoices: initialInvoices }) => {
  const [invoices, setInvoices] = useState(initialInvoices); // Invoices state
  const [updatedInvoices, setUpdatedInvoices] = useState([]); // Track updated invoices
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [setOffDate, setSetOffDate] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [selectedCustomerCode, setSelectedCustomerCode] = useState("");
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountDetails, setDiscountDetails] = useState([]);

  const openSetOffDateModal = (invoice) => {
    setSelectedInvoice(invoice);
    setSetOffDate(
      invoice.invoiceSetoffDate ? new Date(invoice.invoiceSetoffDate) : null
    );
    setIsModalOpen(true);
  };

  const openDetailsModal = async (invoice) => {
    setSelectedInvoice(invoice);
    const response = await fetch(
      `http://localhost:8080/api/invoiceDetail/invoice/${invoice.invNumber}`
    );
    const data = await response.json();
    setInvoiceDetails(data);
    setIsDetailsModalOpen(true);
  };

  const closeSetOffDateModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
    setSetOffDate(null);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedInvoice(null);
    setInvoiceDetails([]);
  };

  const closeDiscountModal = () => {
    setDiscountModalOpen(false);
    setDiscountDetails(null);
  };

  const saveSetOffDate = () => {
    if (selectedInvoice) {
      const updatedInvoice = {
        ...selectedInvoice,
        invoiceSetoffDate: setOffDate.toISOString().split("T")[0],
      };

      // Add to updatedInvoices state
      setUpdatedInvoices((prev) => {
        const filteredInvoices = prev.filter(
          (inv) => inv.invNumber !== selectedInvoice.invNumber
        );
        return [...filteredInvoices, updatedInvoice]; // Add updated invoice
      });

      // Update invoices state (both updated and unchanged)
      const updatedInvoicesList = invoices.map((invoice) => {
        if (invoice.invNumber === selectedInvoice.invNumber) {
          return updatedInvoice; // Update the selected invoice
        }
        return invoice; // Return unchanged invoices
      });

      setInvoices(updatedInvoicesList); // Update main invoices state
      console.log("Updated Invoices with Set-Off Dates:", updatedInvoicesList);
    }

    closeSetOffDateModal();
  };

  const handleCustomerCodeChange = async (event) => {
    const selectedCode = event.target.value;
    setSelectedCustomerCode(selectedCode);

    if (selectedCode) {
      const response = await fetch(
        `http://localhost:8080/api/invoices/customer/${selectedCode}`
      );
      const data = await response.json();
      setInvoices(data);
    } else {
      setInvoices(initialInvoices); // Reset to initial invoices if no customer is selected
    }
  };

  const calculateDiscount = async () => {
    // Add discount calculation logic if needed

    console.log(invoices);
    setDiscountModalOpen(true)

    const simplifiedInvoices = invoices.map(
      ({ invNumber, invoiceDate, invoiceSetoffDate }) => ({
        invNumber,
        invoiceDate,
        invoiceSetoffDate,
      })
    );

    console.log("Request Body:", simplifiedInvoices);

    try {
      const res = await fetch("http://localhost:8080/api/discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoices),
      });

      console.log(res);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Parse the JSON response body
      const data = await res.json(); // Extract the response data

      console.log("Response Data:", data); // Now you can work with the actual data

      setDiscountDetails([])
      setDiscountDetails(data);

      // Use the data (e.g., update UI or handle further logic)
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }

    //console.log(res)
  };

  return (
    <div className="overflow-x-auto">
      <div className="">
        {/* Dropdown for customer code */}
        <div className="mb-4 flex justify-between items-center">
          <label
            htmlFor="customerCode"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Filter by Customer Code:
          </label>
          <select
            id="customerCode"
            value={selectedCustomerCode}
            onChange={handleCustomerCodeChange}
            className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring focus:ring-indigo-300 focus:outline-none"
          >
            <option value="">All Customers</option>
            {[
              ...new Set(
                initialInvoices.map((invoice) => invoice.customerCode)
              ),
            ].map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <div className="mx-4 my-2">
            <button
              className="border-2 border-slate-600 p-2 rounded-3xl text-slate-600 hover:border-slate-800 hover:text-slate-800"
              onClick={calculateDiscount}
            >
              Calculate Discount
            </button>
          </div>
        </div>
      </div>

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
            <th className="text-left px-4 py-2 border border-gray-300">
              Options
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invNumber} className="hover:bg-gray-50">
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
                {invoice.invoiceSetoffDate || "Not Set"}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  onClick={() => openSetOffDateModal(invoice)}
                  className="bg-blue-500 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600"
                >
                  Set Set Off Date
                </button>
                <button
                  onClick={() => openDetailsModal(invoice)}
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Set Off Date Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Set Off Date</h2>
            {selectedInvoice && (
              <div className="space-y-2">
                <p>
                  <strong>Invoice No:</strong> {selectedInvoice.invNumber}
                </p>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Set Off Date:
                  </label>
                  <DatePicker
                    selected={setOffDate}
                    onChange={(date) => setSetOffDate(date)}
                    className="border rounded px-4 py-2 w-full cursor-pointer"
                    dateFormat="yyyy-MM-dd"
                    isClearable
                  />
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeSetOffDateModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveSetOffDate}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
            {selectedInvoice && invoiceDetails.length > 0 && (
              <table className="min-w-full border-collapse border border-gray-200 bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Material Group
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Quantity
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceDetails.map((detail, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {detail.materialGroup}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {detail.quantity}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {detail.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeDetailsModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDiscountModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
            {discountDetails && discountDetails.length > 0 && (
              <table className="min-w-full border-collapse border border-gray-200 bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Invoice Number
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Customer Code
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Customer Name
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300">
                      Discount
                    </th>
                  </tr>
                </thead>
                <tbody className="h-9">
                  {discountDetails.map((detail, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {detail.invNumber}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {detail.customerCode}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {detail.customerName}
                      </td>

                      <td className="px-4 py-2 border border-gray-300">
                        {detail.discount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeDiscountModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTableWithModal;

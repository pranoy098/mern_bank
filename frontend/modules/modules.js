import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

// http request
export const http = (accessToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
  return axios;
};

// trim data
export const trimData = (obj) => {
  let finalObj = {};
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      finalObj[key] = value.trim().toLowerCase();
    } else if (typeof value === "number" || typeof value === "boolean") {
      finalObj[key] = value.toString();
    } else {
      finalObj[key] = value;
    }
  }
  return finalObj;
};

// fetcher
export const fetchData = async (api) => {
  try {
    const httpReq = http();
    const { data } = await httpReq.get(api);
    return data;
  } catch (err) {
    return null;
  }
};

export const uploadFile = async (file, folderName) => {
  console.log("Uploading file to folder:", folderName);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const httpReq = http();
    const response = await httpReq.post(
      `/api/upload?folderName=${folderName}`,
      formData
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const formatDate = (d) => {
  const date = new Date(d);
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // January is 0!
  let yy = date.getFullYear();
  let tt = date.toLocaleTimeString();
  dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? "0" + mm : mm;
  return `${dd}-${mm}-${yy} ${tt}`;
};

export const printBankTransactions = (data) => {
  let html = `
    <html>
    <head>
      <title>Bank Transactions Details</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h2>Bank Transactions Details</h2>
      <table>
        <thead>
          <tr>
            <th>Account No</th>
            <th>Branch</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>`;

  data.forEach((txn) => {
    html += `
              <tr>
                <td>${txn.accountNo}</td>
                <td>${txn.branch}</td>
                <td>${txn.transactionType}</td>
                <td>${txn.transactionAmount}</td>
                <td>${formatDate(txn.createdAt)}</td>
              </tr>`;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>`;

  // Write content and print
  const newWin = window.open("", "_blank");
  newWin.document.write(html);
  newWin.print();
  newWin.document.close();
};

export const downloadTransaction = (data = []) => {
  if (!data.length) return alert("No transaction data found!");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  //Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const title = "Bank Transactions Details";
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, 15);

  // Prepare table data

  const tableData = data.map((item) => [
    item.accountNo,
    item.branch,
    item.transactionType.toUpperCase(),
    item.transactionAmount,
    formatDate(item.createdAt),
  ]);

  // Add transactions table
  doc.autoTable({
    head: [["Account No", "Branch", "Type", "Amount", "Date"]],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: { halign: "center" },
    headStyles: { fillColor: [0, 102, 204], halign: "center" },
    columnStyles: { 3: { halign: "right" } },
  });

  // Calculate totals
  const totalCredit = data
    .filter((t) => t.transactionType === "cr")
    .reduce((sum, t) => sum + Number(t.transactionAmount), 0);

  const totalDebit = data
    .filter((t) => t.transactionType === "dr")
    .reduce((sum, t) => sum + Number(t.transactionAmount), 0);

  const balance = totalCredit - totalDebit;

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals table
  doc.autoTable({
    startY: finalY,
    theme: "grid",
    head: [["Summary", "Amount"]],
    body: [
      ["Total Credit", totalCredit.toLocaleString("en-IN")],
      ["Total Debit", totalDebit.toLocaleString("en-IN")],
      ["Balance", balance.toLocaleString("en-IN")],
    ],
    headStyles: { fillColor: [60, 179, 113], halign: "center" }, // green header
    styles: { halign: "right", fontStyle: "bold" },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
    },
  });

  // Save PDF
  doc.save("Bank_Transactions.pdf");
};

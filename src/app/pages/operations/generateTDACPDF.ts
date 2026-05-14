import { jsPDF } from "jspdf";
import QRCode from "qrcode";

type TDACRecord = {
  email: string;
  name: string;
  arrivalCardNo: string;
  nationality: string;
  arrivalDate: string;
  departureDate: string;
  submittedAt: string;
  updatedAt: string;
  status: string;
  passportNo: string;
  arrivalFlightNo: string;
  departureFlightNo: string;
};

function fmtDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

async function makeQR(text: string): Promise<string> {
  return QRCode.toDataURL(text, { margin: 1, width: 200 });
}

export async function generateTDACPDF(record: TDACRecord) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;
  const transactionDate = new Date(record.submittedAt);
  const txDateStr = `${transactionDate.getFullYear()}/${String(transactionDate.getMonth() + 1).padStart(2, "0")}/${String(transactionDate.getDate()).padStart(2, "0")} ${String(transactionDate.getHours()).padStart(2, "0")}:${String(transactionDate.getMinutes()).padStart(2, "0")}:00`;

  const qrUrl = `https://tdac.immigration.go.th/arrival-card?id=${record.arrivalCardNo}`;
  const qrDataUrl1 = await makeQR(qrUrl);
  const qrDataUrl2 = await makeQR(record.arrivalCardNo);

  // ── PAGE 1 ──────────────────────────────────────────────────────────────
  let y = 18;

  // Header: Immigration Bureau emblem placeholder circle
  doc.setDrawColor(20, 40, 100);
  doc.setFillColor(20, 40, 100);
  doc.circle(W / 2, y + 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5);
  doc.text("ROYAL THAI", W / 2, y + 7, { align: "center" });
  doc.text("POLICE", W / 2, y + 9.5, { align: "center" });
  y += 20;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("IMMIGRATION BUREAU", W / 2, y, { align: "center" });
  y += 6;
  doc.setFontSize(11);
  doc.text("ROYAL THAI POLICE", W / 2, y, { align: "center" });
  y += 10;

  // Intro paragraphs
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const introLines = doc.splitTextToSize(
    "Thank you for using the Thailand Digital Arrival Card. This Thailand Digital Arrival Card is only valid for one time use for travel on the expected date of arrival indicated below. You may choose to download or print a copy of this and retain it for the duration of your stay. Please note that the Thailand Digital Arrival Card is not a visa. The use of the Thailand Digital Arrival Card e-Service is free of charge.",
    contentW
  );
  doc.text(introLines, margin, y);
  y += introLines.length * 4.5 + 3;

  const intro2Lines = doc.splitTextToSize(
    "Kindly ensure that the information provided is accurate and aligns with your travel documents to avoid any issues upon your arrival in Thailand.",
    contentW
  );
  doc.text(intro2Lines, margin, y);
  y += intro2Lines.length * 4.5 + 3;

  const intro3Lines = doc.splitTextToSize(
    `You can update your Thailand Digital Arrival Card information through the official website at https://tdac.immigration.go.th/arrival-card or by scanning the QR code provided below, before entering Thailand. For more information on Thailand's entry requirements, please visit the official website.`,
    contentW
  );
  doc.text(intro3Lines, margin, y);
  y += intro3Lines.length * 4.5 + 5;

  // QR code row
  doc.addImage(qrDataUrl1, "PNG", margin, y, 20, 20);
  doc.setFontSize(8.5);
  doc.text("To update your information or for further assistance, please scan the QR code.", margin + 24, y + 10);
  y += 26;

  // Transaction Date
  doc.setFontSize(8.5);
  doc.text(`Transaction Date :  ${txDateStr}`, margin, y);
  y += 10;

  // Summary card box
  const boxH = 42;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentW, boxH);

  // Divider line between header row and QR area
  doc.line(margin, y + 8, margin + contentW, y + 8);
  // Vertical divider between QR section and right-side info
  doc.line(margin + 44, y + 8, margin + 44, y + boxH);

  // Row 1: Name | Date of Arrival
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Name :", margin + 2, y + 5.5);
  doc.setFont("helvetica", "bold");
  doc.text(record.name.toUpperCase(), margin + 18, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.text("Date of Arrival :", margin + 48, y + 5.5);
  doc.setFont("helvetica", "bold");
  doc.text(fmtDate(record.arrivalDate), margin + 70, y + 5.5);

  // QR code in lower-left of box
  doc.addImage(qrDataUrl2, "PNG", margin + 2, y + 10, 28, 28);

  // Fields right of QR
  const fieldX = margin + 46;
  let fieldY = y + 16;
  const fields = [
    ["TH Digital Arrival Card No. :", record.arrivalCardNo],
    ["Passport No. :", record.passportNo],
    ["Flight No./Vehicle No. :", record.arrivalFlightNo],
  ];
  for (const [label, value] of fields) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(label, fieldX, fieldY);
    doc.setFont("helvetica", "bold");
    doc.text(value, fieldX + 44, fieldY);
    fieldY += 7;
  }

  // ── PAGE 2 ──────────────────────────────────────────────────────────────
  doc.addPage();
  y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`TH Digital Arrival Card No.  ${record.arrivalCardNo}`, margin, y);
  y += 10;

  function sectionHeader(title: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(title, margin, y);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.5, margin + contentW, y + 1.5);
    doc.setTextColor(0, 0, 0);
    y += 7;
  }

  function infoRow(label: string, value: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(label, margin + 60, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(value, margin + 64, y);
    y += 6.5;
  }

  // Personal Information
  sectionHeader("Personal Information");
  infoRow("Full Name :", record.name.toUpperCase());
  infoRow("Gender :", "-");
  infoRow("Nationality/Citizenship :", record.nationality.toUpperCase());
  infoRow("Passport No. :", record.passportNo);
  infoRow("Date of Birth :", "-");
  infoRow("Occupation :", "-");
  infoRow("Country/Territory of Residence :", "-");
  infoRow("City/State of Residence :", "-");
  infoRow("Visa No. :", "-");
  infoRow("Phone No. :", "-");
  y += 4;

  // Trip Information
  sectionHeader("Trip Information");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Arrival Information", margin, y);
  y += 6;

  infoRow("Date of Arrival :", fmtDate(record.arrivalDate));
  infoRow("Country/Territory where you Boarded :", "-");
  infoRow("Purpose of Travel :", "-");
  infoRow("Mode of Travel :", "-");
  infoRow("Mode of Transport :", "-");
  infoRow("Flight No./Vehicle No. :", record.arrivalFlightNo);
  y += 3;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Departure Information", margin, y);
  y += 6;

  infoRow("Date of Departure :", fmtDate(record.departureDate));
  infoRow("Mode of Travel :", "-");
  infoRow("Mode of Transport :", "-");
  infoRow("Flight No./Vehicle No. :", record.departureFlightNo);
  y += 4;

  // Accommodation Information
  sectionHeader("Accommodation Information");
  infoRow("Type of Accommodation in Thailand :", "-");
  infoRow("Post Code :", "-");
  infoRow("Address :", "-");

  doc.save(`TDAC_${record.arrivalCardNo}.pdf`);
}

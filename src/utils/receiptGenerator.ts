import { jsPDF } from 'jspdf';
import { Booking, UserProfile } from '../types';

export interface ReceiptDetails {
  receiptNumber: string;
  bookingId: string;
  pnr: string;
  transactionId: string;
  paymentDate: string;
  receiptGenerationDate: string;
  company: {
    name: string;
    supportEmail: string;
    supportPhone: string;
    website: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  bookingDetails: {
    type: string;
    title: string;
    travelDate: string;
    passengerCount: number | string;
  };
  payment: {
    paymentMethod: string;
    baseAmount: number;
    taxAmount: number;
    discountAmount: number;
    finalPaidAmount: number;
    status: 'Paid' | 'Pending' | 'Refunded' | string;
  };
}

/**
 * Fetches the verified receipt data from backend API with authentication & ownership security.
 */
export async function fetchBookingReceipt(bookingIdOrPnr: string): Promise<ReceiptDetails> {
  const token = localStorage.getItem('voyagego_auth_token') || localStorage.getItem('voyagego_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api/bookings/${encodeURIComponent(bookingIdOrPnr)}/receipt`, { headers });

  if (res.status === 403) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Access Denied: You are not authorized to view or print the receipt for this booking.');
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Receipt is not available.');
  }

  const data = await res.json();
  if (!data || !data.receipt) {
    throw new Error('Receipt is not available.');
  }

  return data.receipt;
}

/**
 * Generates and triggers automatic download of a professional branded PDF payment receipt.
 */
export function downloadReceiptPDF(receipt: ReceiptDetails): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  
  // Header Banner Background (Deep Navy)
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Orange Accent Line
  doc.setFillColor(249, 115, 22); // #f97316
  doc.rect(0, 40, pageWidth, 3, 'F');

  // Header Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('VoyageGo', 15, 18);

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ELEVATE YOUR JOURNEY • OFFICIAL PAYMENT RECEIPT', 15, 25);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('VoyageGo Travel Technologies Inc.', 15, 31);

  // Right Aligned Company Support Info
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`Support: ${receipt.company.supportEmail}`, pageWidth - 15, 16, { align: 'right' });
  doc.text(`Phone: ${receipt.company.supportPhone}`, pageWidth - 15, 22, { align: 'right' });
  doc.text(`Website: ${receipt.company.website}`, pageWidth - 15, 28, { align: 'right' });

  // Receipt Title Bar
  let y = 52;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL PAYMENT RECEIPT & TAX INVOICE', 15, y);

  const genDateStr = new Date(receipt.receiptGenerationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued: ${genDateStr}`, pageWidth - 15, y, { align: 'right' });

  y += 8;

  // 2-Column Details Box
  const boxWidth = 87;
  const boxHeight = 42;

  // Box 1: Receipt Metadata
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, boxWidth, boxHeight, 3, 3, 'FD');

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT & TRANSACTION DETAILS', 19, y + 7);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Receipt No:', 19, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.receiptNumber, 55, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.text('Booking ID:', 19, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.bookingId, 55, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.text('PNR Reference:', 19, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(249, 115, 22);
  doc.text(receipt.pnr || 'N/A', 55, y + 26);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.text('Transaction ID:', 19, y + 32);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.transactionId, 55, y + 32);

  doc.setFont('helvetica', 'normal');
  doc.text('Payment Date:', 19, y + 38);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.paymentDate, 55, y + 38);

  // Box 2: Customer Details
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(108, y, boxWidth, boxHeight, 3, 3, 'FD');

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO / CUSTOMER DETAILS', 112, y + 7);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);

  doc.setFont('helvetica', 'normal');
  doc.text('Customer Name:', 112, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.customer.name, 145, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.text('Email Address:', 112, y + 23);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.customer.email || 'N/A', 145, y + 23);

  doc.setFont('helvetica', 'normal');
  doc.text('Phone Number:', 112, y + 31);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.customer.phone || 'N/A', 145, y + 31);

  y += boxHeight + 10;

  // Booking Items Table Header
  doc.setFillColor(30, 41, 59); // #1e293b
  doc.rect(15, y, 180, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION / RESERVATION', 19, y + 5.5);
  doc.text('TYPE', 95, y + 5.5);
  doc.text('TRAVEL DATE', 125, y + 5.5);
  doc.text('PAX', 160, y + 5.5);
  doc.text('AMOUNT', 178, y + 5.5);

  y += 8;

  // Table Item Row
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 14, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.bookingDetails.title, 19, y + 6);
  
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`PNR: ${receipt.pnr}`, 19, y + 10.5);

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  doc.text(receipt.bookingDetails.type, 95, y + 8);
  doc.text(receipt.bookingDetails.travelDate, 125, y + 8);
  doc.text(String(receipt.bookingDetails.passengerCount), 162, y + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`$${receipt.payment.finalPaidAmount.toFixed(2)}`, 178, y + 8);

  y += 22;

  // Financial Breakdown Box
  const summaryY = y;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(100, summaryY, 95, 48, 3, 3, 'FD');

  let sy = summaryY + 8;
  doc.setFontSize(8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Payment Method:', 105, sy);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(receipt.payment.paymentMethod, 150, sy);

  sy += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Payment Status:', 105, sy);
  
  // Status badge
  const pStatus = (receipt.payment.status || 'Paid').toUpperCase();
  if (pStatus === 'PAID') {
    doc.setTextColor(16, 185, 129); // Green
  } else if (pStatus === 'REFUNDED') {
    doc.setTextColor(225, 29, 72); // Red
  } else {
    doc.setTextColor(217, 119, 6); // Orange
  }
  doc.setFont('helvetica', 'bold');
  doc.text(pStatus, 150, sy);

  sy += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(105, sy - 2, 190, sy - 2);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Base Reservation Fare:', 105, sy + 3);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${receipt.payment.baseAmount.toFixed(2)}`, 190, sy + 3, { align: 'right' });

  sy += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('GST & Aviation Taxes (12%):', 105, sy + 3);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${receipt.payment.taxAmount.toFixed(2)}`, 190, sy + 3, { align: 'right' });

  if (receipt.payment.discountAmount > 0) {
    sy += 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text('Promo Discount:', 105, sy + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(`-$${receipt.payment.discountAmount.toFixed(2)}`, 190, sy + 3, { align: 'right' });
  }

  sy += 9;
  doc.setDrawColor(203, 213, 225);
  doc.line(105, sy - 2, 190, sy - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('FINAL PAID AMOUNT:', 105, sy + 3);

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(11);
  doc.text(`$${receipt.payment.finalPaidAmount.toFixed(2)}`, 190, sy + 3, { align: 'right' });

  // Footer Section
  const footerY = 250;

  doc.setDrawColor(226, 232, 240);
  doc.line(15, footerY, 195, footerY);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for choosing VoyageGo.', pageWidth / 2, footerY + 8, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'This is an official system-generated payment receipt and tax invoice. It does not require a physical signature.',
    pageWidth / 2,
    footerY + 14,
    { align: 'center' }
  );

  // Bottom Orange Accent Strip
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 290, pageWidth, 7, 'F');

  // Trigger Save PDF
  const filename = `Receipt_${receipt.pnr || receipt.bookingId}.pdf`;
  doc.save(filename);
}

/**
 * Triggers a clean print-friendly browser print dialog optimized for A4 paper.
 */
export function triggerPrintReceipt(receipt: ReceiptDetails): void {
  // Remove any existing print container
  const existing = document.getElementById('voyagego-printable-receipt-element');
  if (existing) {
    existing.remove();
  }

  const printDiv = document.createElement('div');
  printDiv.id = 'voyagego-printable-receipt-element';
  printDiv.className = 'voyagego-print-only-container';

  const pStatus = (receipt.payment.status || 'Paid').toUpperCase();
  let badgeBg = 'bg-emerald-100 text-emerald-700';
  if (pStatus === 'REFUNDED') badgeBg = 'bg-rose-100 text-rose-700';
  if (pStatus === 'PENDING') badgeBg = 'bg-amber-100 text-amber-700';

  printDiv.innerHTML = `
    <style>
      @media print {
        body * {
          visibility: hidden !important;
        }
        #voyagego-printable-receipt-element, #voyagego-printable-receipt-element * {
          visibility: visible !important;
        }
        #voyagego-printable-receipt-element {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: #ffffff !important;
          color: #0f172a !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          padding: 24px !important;
          box-sizing: border-box !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @page {
          size: A4 portrait;
          margin: 12mm;
        }
      }
    </style>

    <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
      <!-- Header Banner -->
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #f97316;">
        <div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">VoyageGo</h1>
          <p style="margin: 4px 0 0 0; font-size: 10px; font-weight: 700; color: #f97316; letter-spacing: 1px; text-transform: uppercase;">Elevate Your Journey • Payment Receipt</p>
        </div>
        <div style="text-align: right; font-size: 11px; color: #cbd5e1; line-height: 1.5;">
          <p style="margin: 0; font-weight: 700; color: #ffffff;">VoyageGo Travel Technologies</p>
          <p style="margin: 0;">Support: ${receipt.company.supportEmail}</p>
          <p style="margin: 0;">Hotline: ${receipt.company.supportPhone}</p>
          <p style="margin: 0;">Web: ${receipt.company.website}</p>
        </div>
      </div>

      <div style="padding: 24px; space-y: 20px;">
        <!-- Title & Date -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;">
          <div>
            <span style="font-size: 10px; font-weight: 800; color: #f97316; text-transform: uppercase; letter-spacing: 1px;">Official Transaction Record</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 800; color: #0f172a;">Payment Receipt & Tax Invoice</h2>
          </div>
          <div style="text-align: right;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; background: #dcfce7; color: #15803d;">
              STATUS: ${pStatus}
            </span>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-family: monospace;">Date: ${new Date(receipt.receiptGenerationDate).toLocaleString()}</p>
          </div>
        </div>

        <!-- 2 Column Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.8;">
            <h4 style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #f97316; text-transform: uppercase;">Receipt & Transaction</h4>
            <div style="display: flex; justify-content: space-between;"><span>Receipt No:</span><strong style="color: #0f172a;">${receipt.receiptNumber}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Booking ID:</span><strong style="color: #0f172a;">${receipt.bookingId}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>PNR Reference:</span><strong style="color: #ea580c; font-family: monospace;">${receipt.pnr || 'N/A'}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Transaction ID:</span><strong style="color: #0f172a;">${receipt.transactionId}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Payment Date:</span><strong style="color: #0f172a;">${receipt.paymentDate}</strong></div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.8;">
            <h4 style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #f97316; text-transform: uppercase;">Billed To Customer</h4>
            <div style="display: flex; justify-content: space-between;"><span>Name:</span><strong style="color: #0f172a;">${receipt.customer.name}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Email:</span><strong style="color: #0f172a;">${receipt.customer.email || 'N/A'}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Phone:</span><strong style="color: #0f172a;">${receipt.customer.phone || 'N/A'}</strong></div>
          </div>
        </div>

        <!-- Booking Item Table -->
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background-color: #1e293b; color: #ffffff; text-align: left;">
              <th style="padding: 10px 14px; font-size: 11px;">Description / Reservation</th>
              <th style="padding: 10px 14px; font-size: 11px;">Type</th>
              <th style="padding: 10px 14px; font-size: 11px;">Travel Date</th>
              <th style="padding: 10px 14px; font-size: 11px;">Pax</th>
              <th style="padding: 10px 14px; font-size: 11px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 14px;">
                <strong style="color: #0f172a; font-size: 13px; display: block;">${receipt.bookingDetails.title}</strong>
                <span style="font-size: 10px; color: #64748b; font-family: monospace;">PNR: ${receipt.pnr}</span>
              </td>
              <td style="padding: 12px 14px; color: #334155;">${receipt.bookingDetails.type}</td>
              <td style="padding: 12px 14px; color: #334155;">${receipt.bookingDetails.travelDate}</td>
              <td style="padding: 12px 14px; color: #334155;">${receipt.bookingDetails.passengerCount}</td>
              <td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #0f172a;">$${receipt.payment.finalPaidAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Payment Breakdown -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
          <div style="width: 320px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
              <span>Payment Method:</span><strong style="color: #0f172a;">${receipt.payment.paymentMethod}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Base Fare:</span><strong>$${receipt.payment.baseAmount.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Taxes & Fees (12%):</span><strong>$${receipt.payment.taxAmount.toFixed(2)}</strong>
            </div>
            ${receipt.payment.discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #16a34a;">
                <span>Discount:</span><strong>-$${receipt.payment.discountAmount.toFixed(2)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 8px; font-size: 14px; font-weight: 800; color: #0f172a;">
              <span>Total Paid:</span><span style="color: #ea580c;">$${receipt.payment.finalPaidAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b;">
          <p style="margin: 0; font-weight: 800; color: #0f172a; font-size: 13px;">Thank you for choosing VoyageGo.</p>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #94a3b8;">This is a system-generated payment receipt and tax invoice. No signature required.</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(printDiv);

  setTimeout(() => {
    window.print();
  }, 150);
}

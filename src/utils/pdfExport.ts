import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SipocStep } from "../types";

export interface ExportPdfOptions {
  title: string;
  type?: "processo" | "projeto" | string;
  trigger?: string;
  startPoint?: string;
  endPoint?: string;
  notes?: string;
  steps: SipocStep[];
}

export function exportSipocToPdf({
  title,
  type = "processo",
  trigger,
  startPoint,
  endPoint,
  notes,
  steps,
}: ExportPdfOptions) {
  // Use landscape orientation (A4) for best view of 5 SIPOC columns
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Accent Banner
  doc.setFillColor(15, 23, 42); // #0F172A slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  // Emerald bar accent
  doc.setFillColor(16, 185, 129); // #10B981 emerald-500
  doc.rect(0, 27, pageWidth, 1.5, "F");

  // Title Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const cleanTitle = title.trim() || "Mapa de Processo SIPOC";
  doc.text(cleanTitle, 14, 12);

  // Subtitle / Type badge
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(16, 185, 129);
  const typeText = `LEAN SIX SIGMA • ${type.toUpperCase()} • MAPA S-I-P-O-C`;
  doc.text(typeText, 14, 19);

  // Generation Date
  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Gerado em: ${dateStr}`, pageWidth - 14, 19, { align: "right" });

  let currentY = 34;

  // Boundary Pillars Box (Trigger, Start Point, End Point)
  if (trigger || startPoint || endPoint) {
    const boxWidth = (pageWidth - 28 - 8) / 3;
    const boxHeight = 22;

    // Pillar 1: Trigger
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, currentY, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text("GATILHO (TRIGGER - 1º INPUT)", 17, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const triggerLines = doc.splitTextToSize(trigger || "Não informado", boxWidth - 6);
    doc.text(triggerLines.slice(0, 2), 17, currentY + 11);

    // Pillar 2: Start Point
    const p2X = 14 + boxWidth + 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(p2X, currentY, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199); // sky-600
    doc.text("START POINT (MARCO INICIAL - P1)", p2X + 3, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const startLines = doc.splitTextToSize(startPoint || "Não informado", boxWidth - 6);
    doc.text(startLines.slice(0, 2), p2X + 3, currentY + 11);

    // Pillar 3: End Point
    const p3X = p2X + boxWidth + 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(p3X, currentY, boxWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text("END POINT (MARCO FINAL - ENTREGA)", p3X + 3, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const endLines = doc.splitTextToSize(endPoint || "Não informado", boxWidth - 6);
    doc.text(endLines.slice(0, 2), p3X + 3, currentY + 11);

    currentY += boxHeight + 4;
  }

  // Notes if available
  if (notes && notes.trim()) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const noteText = `Notas de Contexto: ${notes.trim()}`;
    const noteLines = doc.splitTextToSize(noteText, pageWidth - 28);
    doc.text(noteLines, 14, currentY);
    currentY += noteLines.length * 3.5 + 2;
  }

  // Prepare table data
  const tableHeaders = [
    [
      { content: "S\nSuppliers (Fornecedores)", styles: { halign: "center" as const } },
      { content: "I\nInputs (Entradas)", styles: { halign: "center" as const } },
      { content: "P\nProcess (Processo)", styles: { halign: "center" as const } },
      { content: "O\nOutputs (Saídas)", styles: { halign: "center" as const } },
      { content: "C\nCustomers (Clientes)", styles: { halign: "center" as const } },
    ],
  ];

  const tableBody = steps.map((s, idx) => {
    const stepLabel = s.stepNumber || `P${idx + 1}`;
    const supText = s.suppliers.map((item) => `• ${item}`).join("\n");
    const inpText = s.inputs.map((item) => `• ${item}`).join("\n");
    const procText = `[${stepLabel}]\n${s.process}`;
    const outText = s.outputs.map((item) => `• ${item}`).join("\n");
    const custText = s.customers.map((item) => `• ${item}`).join("\n");

    return [supText, inpText, procText, outText, custText];
  });

  autoTable(doc, {
    startY: currentY + 1,
    head: tableHeaders,
    body: tableBody,
    theme: "grid",
    margin: { left: 14, right: 14, bottom: 16 },
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 3.5,
      lineColor: [51, 65, 85],
      lineWidth: 0.2,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 3.5,
      valign: "top",
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 52 },
      2: { cellWidth: 65, fontStyle: "bold", fillColor: [241, 245, 249] },
      3: { cellWidth: 52 },
      4: { cellWidth: 50 },
    },
    didDrawPage: (data) => {
      // Footer on every page
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Lean Six Sigma Framework • SIPOC Matrix Guide • Regra de Ouro: O cliente de cada etapa interna (C) é a etapa seguinte (P)",
        14,
        pageHeight - 6
      );
      const pageNumberStr = `Página ${data.pageNumber}`;
      doc.text(pageNumberStr, pageWidth - 14, pageHeight - 6, { align: "right" });
    },
  });

  const sanitizedFilename = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 30);

  doc.save(`SIPOC_${sanitizedFilename || "processo"}.pdf`);
}

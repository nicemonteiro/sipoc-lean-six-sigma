import React from "react";
import { SipocStep } from "../types";
import { CheckCircle2, Download, Copy, Printer, FileDown } from "lucide-react";
import { exportSipocToPdf } from "../utils/pdfExport";

interface SipocTableViewProps {
  title: string;
  trigger?: string;
  startPoint?: string;
  endPoint?: string;
  steps: SipocStep[];
  type?: "processo" | "projeto";
  notes?: string;
  showExportControls?: boolean;
}

export const SipocTableView: React.FC<SipocTableViewProps> = ({
  title,
  trigger,
  startPoint,
  endPoint,
  steps,
  type = "processo",
  notes,
  showExportControls = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [downloadingPdf, setDownloadingPdf] = React.useState(false);

  const handleDownloadPdf = () => {
    try {
      setDownloadingPdf(true);
      exportSipocToPdf({
        title,
        type,
        trigger,
        startPoint,
        endPoint,
        notes,
        steps,
      });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  const handleCopy = () => {
    const text = `MAPA SIPOC: ${title}
Tipo: ${type.toUpperCase()}
Gatilho: ${trigger || "N/A"}
Start Point: ${startPoint || "N/A"}
End Point: ${endPoint || "N/A"}

TABELA S-I-P-O-C:
${steps
  .map(
    (s) =>
      `[${s.stepNumber}] ${s.process}\n` +
      `  - S (Suppliers): ${s.suppliers.join(", ")}\n` +
      `  - I (Inputs): ${s.inputs.join(", ")}\n` +
      `  - P (Process): ${s.process}\n` +
      `  - O (Outputs): ${s.outputs.join(", ")}\n` +
      `  - C (Customers): ${s.customers.join(", ")}\n`
  )
  .join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const headers = ["Etapa", "Suppliers (S)", "Inputs (I)", "Process (P)", "Outputs (O)", "Customers (C)"];
    const rows = steps.map((s) => [
      s.stepNumber,
      `"${s.suppliers.join(" | ")}"`,
      `"${s.inputs.join(" | ")}"`,
      `"${s.process}"`,
      `"${s.outputs.join(" | ")}"`,
      `"${s.customers.join(" | ")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SIPOC_${title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="sipoc-table-container" className="bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header Info Panel */}
      <div className="bg-[#0F172A] text-slate-100 p-6 md:p-8 border-b border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                {type}
              </span>
              <span className="text-xs text-slate-400 font-mono">Lean Six Sigma SIPOC Matrix</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h3>
            {notes && <p className="text-sm text-slate-300 mt-1 max-w-2xl">{notes}</p>}
          </div>

          {showExportControls && (
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <button
                id="btn-pdf-sipoc-direct"
                onClick={handleDownloadPdf}
                disabled={downloadingPdf || steps.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                title="Baixar Mapa SIPOC em PDF formatado"
              >
                <FileDown className="w-4 h-4" />
                <span>{downloadingPdf ? "Gerando PDF..." : "Baixar PDF"}</span>
              </button>
              <button
                id="btn-copy-sipoc"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                title="Copiar texto estruturado"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copiado!" : "Copiar"}</span>
              </button>
              <button
                id="btn-csv-sipoc"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                title="Exportar como CSV / Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                id="btn-print-sipoc"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                title="Imprimir / Visualização de Impressão"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>
          )}
        </div>

        {/* Boundary Pillars */}
        {(trigger || startPoint || endPoint) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-700/80 text-xs">
            {trigger && (
              <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  Gatilho (Trigger)
                </span>
                <p className="text-slate-200 leading-relaxed">{trigger}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Primeiro input externo</span>
              </div>
            )}
            {startPoint && (
              <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700">
                <span className="text-sky-400 font-bold uppercase tracking-wider block mb-1">
                  Start Point (P1)
                </span>
                <p className="text-slate-200 leading-relaxed">{startPoint}</p>
                <span className="text-[10px] text-slate-400 block mt-1">1ª ação sob controle do processo</span>
              </div>
            )}
            {endPoint && (
              <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  End Point (Final)
                </span>
                <p className="text-slate-200 leading-relaxed">{endPoint}</p>
                <span className="text-[10px] text-slate-400 block mt-1">Entrega de valor ao cliente</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main S-I-P-O-C Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#0F172A] text-slate-200 text-sm font-semibold border-b border-slate-700">
              <th className="py-3.5 px-4 w-[20%] border-r border-slate-700 text-center uppercase tracking-wider">
                <div className="text-lg font-black tracking-widest text-emerald-400">S</div>
                <div className="text-xs font-normal text-slate-400">Suppliers (Fornecedores)</div>
              </th>
              <th className="py-3.5 px-4 w-[22%] border-r border-slate-700 text-center uppercase tracking-wider">
                <div className="text-lg font-black tracking-widest text-slate-200">I</div>
                <div className="text-xs font-normal text-slate-400">Inputs (Entradas)</div>
              </th>
              <th className="py-3.5 px-4 w-[22%] border-r border-slate-700 text-center uppercase tracking-wider bg-emerald-950/30">
                <div className="text-lg font-black tracking-widest text-emerald-300">P</div>
                <div className="text-xs font-normal text-emerald-400/90">Process (Processo)</div>
              </th>
              <th className="py-3.5 px-4 w-[20%] border-r border-slate-700 text-center uppercase tracking-wider">
                <div className="text-lg font-black tracking-widest text-emerald-400">O</div>
                <div className="text-xs font-normal text-slate-400">Outputs (Saídas)</div>
              </th>
              <th className="py-3.5 px-4 w-[16%] text-center uppercase tracking-wider">
                <div className="text-lg font-black tracking-widest text-sky-400">C</div>
                <div className="text-xs font-normal text-slate-400">Customers (Clientes)</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/80 text-xs md:text-sm text-slate-300">
            {steps.map((step, idx) => (
              <tr
                key={step.id || idx}
                className={idx % 2 === 0 ? "bg-[#1E293B] hover:bg-slate-700/40 transition-colors" : "bg-[#0F172A]/70 hover:bg-slate-700/40 transition-colors"}
              >
                {/* S - Suppliers */}
                <td className="py-4 px-4 align-top border-r border-slate-700 leading-relaxed">
                  <ul className="space-y-1">
                    {step.suppliers.map((sup, sIdx) => (
                      <li key={sIdx} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-1 text-[10px]">•</span>
                        <span>{sup}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                {/* I - Inputs */}
                <td className="py-4 px-4 align-top border-r border-slate-700 leading-relaxed">
                  <ul className="space-y-1">
                    {step.inputs.map((inp, iIdx) => (
                      <li key={iIdx} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-slate-400 mt-1 text-[10px]">•</span>
                        <span className="font-medium text-white">{inp}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                {/* P - Process */}
                <td className="py-4 px-4 align-top border-r border-slate-700 bg-emerald-950/20 leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-[#0F172A] font-black text-[11px]">
                      {step.stepNumber}
                    </span>
                  </div>
                  <p className="font-semibold text-white leading-snug">{step.process}</p>
                </td>

                {/* O - Outputs */}
                <td className="py-4 px-4 align-top border-r border-slate-700 leading-relaxed">
                  <ul className="space-y-1">
                    {step.outputs.map((out, oIdx) => (
                      <li key={oIdx} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-1 text-[10px]">•</span>
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                {/* C - Customers */}
                <td className="py-4 px-4 align-top leading-relaxed">
                  <ul className="space-y-1">
                    {step.customers.map((cust, cIdx) => (
                      <li key={cIdx} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-sky-400 mt-1 text-[10px]">•</span>
                        <span className="text-slate-200">{cust}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Rule Note */}
      <div className="bg-[#0F172A] border-t border-slate-700 p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            <strong className="text-slate-200">Regra de Ouro:</strong> O cliente de cada etapa interna (C) é a etapa seguinte (P), alimentando a cadeia até o cliente final.
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">Total de Etapas: {steps.length}</span>
      </div>
    </div>
  );
};

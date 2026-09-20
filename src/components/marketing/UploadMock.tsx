import {
  ArrowDown,
  FileCode,
  FileSpreadsheet,
  FileText,
  Layers,
  LayoutDashboard,
  ShoppingCart,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Styles } from "./DashboardMock";

/**
 * Visuals for the Data Upload page. There is no in-app screen for the first load
 * (we do it during onboarding), so these show the real record shapes and the
 * process — and the self-serve card is labelled as a concept that isn't built.
 */

const MONO = "ui-monospace,Menlo,monospace";

function Chip({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: "3px 8px",
        borderRadius: 6,
        border: "1px solid #e3ece7",
        background: "#f6faf8",
        fontFamily: MONO,
        fontSize: 10.5,
      }}
    >
      {text}
    </span>
  );
}

/** Exports in → we map and load → dashboards fill. */
export function UploadFlow() {
  const files: [LucideIcon, string, string][] = [
    [FileSpreadsheet, "sales_export.csv", "POS sales · CSV"],
    [FileCode, "tally_vouchers.xml", "Tally books · XML voucher export"],
  ];
  const screens: [LucideIcon, string][] = [
    [LayoutDashboard, "Overview"],
    [ShoppingCart, "POS Sales"],
    [Layers, "Inventory"],
    [FileText, "Reconciliation"],
  ];
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "#66736b" }}>
          YOU SEND
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {files.map(([Icon, name, sub]) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e3ece7",
              }}
            >
              <span
                className="dm-tile"
                style={{ width: 32, height: 32, background: "#e8f7ed", color: "#16a34a" }}
              >
                <Icon size={16} />
              </span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 10.5, color: "#66736b" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", justifyItems: "center", gap: 6, margin: "14px 0" }}>
          <ArrowDown size={16} color="#16a34a" />
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 99,
              background: "rgba(22,163,74,.12)",
              color: "#15803d",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            We map and load them
          </span>
          <ArrowDown size={16} color="#16a34a" />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "#66736b" }}>
          YOUR SCREENS FILL IN
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {screens.map(([Icon, label]) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 10,
                background: "#071a14",
                color: "#dde7e1",
                fontSize: 11.5,
                fontWeight: 500,
              }}
            >
              <Icon size={13} /> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The two record shapes every screen is computed from. */
export function UploadSchema() {
  return (
    <div className="dm">
      <Styles />
      <div style={{ display: "grid", gap: 12 }}>
        <div className="dm-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingCart size={15} color="#16a34a" />
            <span style={{ fontSize: 13, fontWeight: 700 }}>POS sales</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#66736b" }}>
              one row per line
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {[
              "invoice_no",
              "sale_datetime",
              "branch_name",
              "order_channel",
              "item_name",
              "quantity",
              "unit_price_aed",
              "discount_aed",
              "tax_aed",
              "total_amount_aed",
              "order_status",
            ].map((f) => (
              <Chip key={f} text={f} />
            ))}
          </div>
        </div>
        <div className="dm-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={15} color="#16a34a" />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Tally vouchers</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#66736b" }}>
              one row per entry
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {[
              "vouchernumber",
              "vouchertype",
              "date",
              "branch",
              "ledger",
              "stockitem",
              "quantity",
              "rate",
              "amount",
            ].map((f) => (
              <Chip key={f} text={f} />
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".1em",
              color: "#66736b",
            }}
          >
            VOUCHER TYPES THAT DRIVE FOOD COST AND MARGIN
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {["Purchase", "Purchase Return", "Sales Return"].map((t) => (
              <span
                key={t}
                className="dm-badge"
                style={{
                  background: "rgba(22,163,74,.12)",
                  color: "#16a34a",
                  borderColor: "rgba(22,163,74,.3)",
                  textTransform: "none",
                  fontSize: 10.5,
                  padding: "2px 8px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Illustration of the planned self-serve upload — not built, and labelled as such. */
export function UploadConcept() {
  return (
    <div className="dm">
      <Styles />
      <div
        className="dm-card"
        style={{ padding: 20, borderStyle: "dashed", background: "#fbfdfc" }}
      >
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
        >
          <span style={{ fontSize: 13, fontWeight: 700 }}>Import a file</span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 99,
              border: "1px solid #dde7e1",
              background: "#fff",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: ".12em",
              color: "#66736b",
            }}
          >
            CONCEPT · NOT BUILT YET
          </span>
        </div>
        <div
          style={{
            marginTop: 14,
            display: "grid",
            justifyItems: "center",
            gap: 6,
            padding: "22px 12px",
            borderRadius: 12,
            border: "1.5px dashed #b9d3c4",
            color: "#66736b",
          }}
        >
          <Upload size={22} color="#16a34a" />
          <div style={{ fontSize: 12, fontWeight: 600, color: "#152019" }}>
            Drop a CSV or Excel file here
          </div>
          <div style={{ fontSize: 10.5 }}>or browse from your computer</div>
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".1em",
            color: "#66736b",
          }}
        >
          COLUMN MAPPING PREVIEW
        </div>
        <table className="dm-table plain tight" style={{ marginTop: 6 }}>
          <tbody>
            {[
              ["Bill No", "invoice_no"],
              ["Date/Time", "sale_datetime"],
              ["Outlet", "branch_name"],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ fontSize: 11.5 }}>{a}</td>
                <td style={{ color: "#16a34a" }}>→</td>
                <td style={{ fontFamily: MONO, fontSize: 11 }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 10, fontSize: 10.5, color: "#66736b" }}>
          Nothing is written until you confirm — and re-uploading a period won&apos;t duplicate
          rows.
        </div>
      </div>
    </div>
  );
}

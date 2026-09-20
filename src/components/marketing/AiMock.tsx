import type { ReactNode } from "react";
import { Bot, Send, User } from "lucide-react";
import { Styles } from "@/components/marketing/DashboardMock";

/**
 * Static replicas of the Pilot AI screen and how it answers (backend/agent/*),
 * for the /product/ai page. Light-theme literals like DashboardMock. All figures
 * are sample data; the header chip says so.
 */

export const GREEN = "#16a34a";
export const MUTED = "#66736b";
export const SAMPLE_CHIP = (
  <span
    style={{
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".08em",
      background: "#f1f6f3",
      color: MUTED,
    }}
  >
    SAMPLE DATA
  </span>
);

function Avatar({ user }: { user?: boolean }) {
  const Icon = user ? User : Bot;
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        flexShrink: 0,
        background: "rgba(22,163,74,.1)",
        color: GREEN,
      }}
    >
      <Icon size={14} />
    </span>
  );
}

function Msg({ user, children }: { user?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: user ? "flex-end" : "flex-start" }}>
      {user ? null : <Avatar />}
      <div
        style={{
          maxWidth: "88%",
          padding: "10px 14px",
          borderRadius: 16,
          fontSize: 12,
          lineHeight: 1.55,
          ...(user
            ? { background: GREEN, color: "#fff" }
            : { background: "#f1f6f3", borderLeft: `4px solid ${GREEN}` }),
        }}
      >
        {children}
      </div>
      {user ? <Avatar user /> : null}
    </div>
  );
}

const TOP_ITEMS = [
  ["Butter Chicken Rice", "226", "7,910"],
  ["Paneer Tikka", "164", "4,920"],
  ["Chicken Shawarma Wrap", "198", "3,960"],
  ["Falafel Bowl", "141", "3,384"],
  ["Hummus Platter", "112", "2,240"],
];

/** The real chat, incl. the one-question follow-up when branch or period is missing. */
export function MockAiChat() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ overflow: "hidden" }}>
        <div className="dm-card-h" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar />
          <div style={{ flex: 1 }}>
            <div className="dm-card-t">Pilot AI</div>
            <div className="dm-card-s">POS sales · Tally vouchers · Recipe costs</div>
          </div>
          {SAMPLE_CHIP}
        </div>
        <div style={{ display: "grid", gap: 12, padding: 16 }}>
          <Msg user>What were our top selling items this month?</Msg>
          <Msg>Which branch — or all branches?</Msg>
          <Msg user>Marina Branch</Msg>
          <Msg>
            Top sellers at <strong>Marina Branch</strong>, 1–20 Sep 2026, completed orders only:
            <table className="dm-table plain" style={{ marginTop: 8, background: "#fff" }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Revenue (AED)</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ITEMS.map(([item, qty, rev]) => (
                  <tr key={item}>
                    <td>{item}</td>
                    <td style={{ textAlign: "right" }}>{qty}</td>
                    <td style={{ textAlign: "right" }}>{rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Msg>
        </div>
        <div
          style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #eaf1ed" }}
        >
          <span className="dm-field" style={{ flex: 1, color: MUTED }}>
            Type your message...
          </span>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              background: GREEN,
              color: "#fff",
            }}
          >
            <Send size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

const SPEC = `table:      pos_sales
filters:    order_status = Completed
            branch_name  = Marina Branch
            sale_datetime ≥ 2026-09-01
group_by:   item_name
aggregate:  sum(total_amount_aed) → revenue
order_by:   revenue desc · limit 5`;

const STEPS: { title: string; body: string; extra?: ReactNode }[] = [
  {
    title: "You ask",
    body: "A plain-language question, typed on the Pilot AI page of your dashboard.",
  },
  {
    title: "Pilot AI plans a query",
    body: "It fills in a structured spec — table, filters, grouping. It never writes raw SQL.",
    extra: (
      <pre
        style={{
          margin: "8px 0 0",
          padding: "10px 12px",
          borderRadius: 8,
          background: "#f1f6f3",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 10.5,
          lineHeight: 1.6,
          overflowX: "auto",
        }}
      >
        {SPEC}
      </pre>
    ),
  },
  {
    title: "The spec is checked, then run",
    body: "Only whitelisted tables and columns pass. Queries are read-only, time out after 5 seconds, and return at most 500 rows.",
  },
  {
    title: "You get the answer and the rows",
    body: "A short answer that names the branch and period it used, with the result table underneath so you can check it.",
  },
];

/** The four checked steps between a question and an answer (Tenzo-style "how it works"). */
export function MockAiFlow() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            style={{
              display: "flex",
              gap: 14,
              padding: "16px 20px",
              borderTop: i ? "1px solid #eaf1ed" : undefined,
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
                background: GREEN,
                color: "#fff",
              }}
            >
              {i + 1}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</div>
              <div style={{ marginTop: 2, fontSize: 11.5, lineHeight: 1.6, color: MUTED }}>
                {s.body}
              </div>
              {s.extra}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const QUESTIONS: { source: string; scope: string; asks: string[] }[] = [
  {
    source: "POS sales",
    scope: "Every bill line, channel, and payment",
    asks: [
      "What were our top selling items this month?",
      "How many delivery orders did Marina take last week?",
      "Compare revenue by channel across all branches for August.",
    ],
  },
  {
    source: "Tally vouchers",
    scope: "Purchases, returns, and stock movements",
    asks: [
      "How much did we spend with each supplier in May?",
      "Which branch had the most purchase returns this quarter?",
      "What stock went out most last month?",
    ],
  },
  {
    source: "Recipes",
    scope: "Menu price and ingredient cost per dish",
    asks: [
      "Which dishes have the worst profit margin?",
      "Which desserts cost the most to make?",
      "What does Paneer Tikka cost against its menu price?",
    ],
  },
];

/** Example questions grouped by the three tables Pilot AI can read. */
export function MockAiQuestions() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div className="dm-card-h" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="dm-card-t">Questions Pilot AI can answer today</div>
            <div className="dm-card-s">Examples, grouped by the data behind them</div>
          </div>
          {SAMPLE_CHIP}
        </div>
        {QUESTIONS.map((g, i) => (
          <div
            key={g.source}
            style={{ padding: "14px 20px", borderTop: i ? "1px solid #eaf1ed" : undefined }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{g.source}</span>
              <span style={{ fontSize: 10.5, color: MUTED }}>{g.scope}</span>
            </div>
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {g.asks.map((q) => (
                <div
                  key={q}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 10,
                    border: "1px solid #e8efeb",
                    background: "rgba(241,246,243,.5)",
                    fontSize: 11.5,
                  }}
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

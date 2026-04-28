import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { PostCallOutput, PostCallInput } from "./types";

const C = {
  bg: "#080d17",
  accent: "#3B82F6",
  accent2: "#1D4ED8",
  badge: "#DBEAFE",
  badgeText: "#1E40AF",
  body: "#FFFFFF",
  text: "#1E293B",
  muted: "#64748B",
  light: "#F8FAFC",
  border: "#E2E8F0",
  green: "#059669",
  greenBg: "#ECFDF5",
  greenBorder: "#6EE7B7",
};

const S = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: C.body, paddingBottom: 48 },
  cover: { backgroundColor: C.bg, padding: 48, paddingTop: 52 },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  dot: { width: 10, height: 10, backgroundColor: C.accent, borderRadius: 5, marginRight: 8 },
  brand: { fontSize: 13, color: "#94A3B8", fontFamily: "Helvetica-Bold", letterSpacing: 2 },
  badge: { backgroundColor: C.accent, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 18 },
  badgeText: { fontSize: 8, color: "#fff", fontFamily: "Helvetica-Bold", letterSpacing: 1 },
  coverTitle: { fontSize: 28, color: "#fff", fontFamily: "Helvetica-Bold", lineHeight: 1.3, marginBottom: 6 },
  coverSub: { fontSize: 12, color: "#94A3B8", marginBottom: 36 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 28 },
  metaRow: { flexDirection: "row", gap: 24, flexWrap: "wrap" },
  metaBlock: { marginBottom: 6 },
  metaLabel: { fontSize: 7.5, color: "#64748B", fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 3 },
  metaValue: { fontSize: 12, color: "#E2E8F0" },
  scoreRow: { flexDirection: "row", gap: 0, marginTop: 24 },
  scoreBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 14, alignItems: "center" },
  scoreLabel: { fontSize: 8, color: "#64748B", fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 4 },
  scoreValue: { fontSize: 26, color: "#fff", fontFamily: "Helvetica-Bold" },
  scoreArrow: { width: 32, alignItems: "center", justifyContent: "center" },
  arrowText: { fontSize: 20, color: C.accent, fontFamily: "Helvetica-Bold" },
  gapBox: { flex: 1, backgroundColor: C.accent, borderRadius: 8, padding: 14, alignItems: "center" },
  gapLabel: { fontSize: 8, color: "rgba(255,255,255,0.6)", fontFamily: "Helvetica-Bold", letterSpacing: 1, marginBottom: 4 },
  gapValue: { fontSize: 26, color: "#fff", fontFamily: "Helvetica-Bold" },
  body: { paddingHorizontal: 40, paddingTop: 24 },
  sh: { flexDirection: "row", alignItems: "center", marginBottom: 14, marginTop: 16 },
  bar: { width: 3, height: 18, backgroundColor: C.accent, borderRadius: 2, marginRight: 8 },
  stitle: { fontSize: 14, fontFamily: "Helvetica-Bold", color: C.text },
  infoBox: { backgroundColor: C.light, borderLeftWidth: 3, borderLeftColor: C.accent, padding: 12, borderRadius: 4, marginBottom: 16 },
  infoText: { fontSize: 10.5, color: C.text, lineHeight: 1.6 },
  blockerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  blockerDot: { width: 6, height: 6, backgroundColor: "#EF4444", borderRadius: 3, marginRight: 8, marginTop: 3, flexShrink: 0 },
  blockerText: { fontSize: 10.5, color: C.text, lineHeight: 1.5, flex: 1 },
  trackRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  trackDot: { width: 6, height: 6, backgroundColor: C.accent, borderRadius: 3, marginRight: 8, marginTop: 3, flexShrink: 0 },
  trackText: { fontSize: 10.5, color: C.text, lineHeight: 1.5, flex: 1 },
  planRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  planLeft: { width: 72, flexShrink: 0 },
  planMonth: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.accent, letterSpacing: 0.5 },
  planMilestone: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.text },
  planConnector: { width: 2, backgroundColor: C.border, marginHorizontal: 10, flexShrink: 0, alignSelf: "stretch" },
  planFocus: { fontSize: 10.5, color: C.text, lineHeight: 1.5, flex: 1, paddingTop: 2 },
  guaranteeBox: { backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 8, padding: 14, marginBottom: 14 },
  guaranteeTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#166534", letterSpacing: 0.5, marginBottom: 5 },
  guaranteeText: { fontSize: 10.5, color: "#166534", lineHeight: 1.6 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: C.bg, paddingHorizontal: 40, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerL: { fontSize: 8, color: "#475569" },
  footerR: { fontSize: 8, color: C.accent, fontFamily: "Helvetica-Bold" },
  disclaimer: { paddingHorizontal: 40, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, marginTop: 8 },
  disclaimerText: { fontSize: 7.5, color: "#94A3B8", lineHeight: 1.5 },
});

export function WryzePDF({ output, input }: { output: PostCallOutput; input: PostCallInput }) {
  const r = output.pdf_roadmap;
  const today = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document title={`Wryze Score Roadmap — ${input.studentName}`} author="Wryze Sales AI">

      {/* PAGE 1: Cover */}
      <Page size="A4" style={S.page}>
        <View style={S.cover}>
          <View style={S.brandRow}>
            <View style={S.dot} />
            <Text style={S.brand}>WRYZE</Text>
          </View>
          <View style={S.badge}>
            <Text style={S.badgeText}>PERSONALIZED SCORE ROADMAP</Text>
          </View>
          <Text style={S.coverTitle}>{input.studentName}&apos;s{"\n"}Path to {r.target_score}</Text>
          <Text style={S.coverSub}>Prepared after your consultation · {today}</Text>
          <View style={S.divider} />
          <View style={S.metaRow}>
            {input.examDate && (
              <View style={S.metaBlock}>
                <Text style={S.metaLabel}>EXAM DATE</Text>
                <Text style={S.metaValue}>{input.examDate}</Text>
              </View>
            )}
            {input.dreamColleges && (
              <View style={S.metaBlock}>
                <Text style={S.metaLabel}>DREAM COLLEGES</Text>
                <Text style={S.metaValue}>{input.dreamColleges}</Text>
              </View>
            )}
          </View>
          <View style={[S.scoreRow, { gap: 0 }]}>
            <View style={S.scoreBox}>
              <Text style={S.scoreLabel}>CURRENT SCORE</Text>
              <Text style={S.scoreValue}>{r.current_score}</Text>
            </View>
            <View style={S.scoreArrow}>
              <Text style={S.arrowText}>→</Text>
            </View>
            <View style={S.gapBox}>
              <Text style={S.gapLabel}>GAP TO CLOSE</Text>
              <Text style={S.gapValue}>{r.score_gap}</Text>
            </View>
            <View style={S.scoreArrow}>
              <Text style={S.arrowText}>→</Text>
            </View>
            <View style={[S.scoreBox, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
              <Text style={S.scoreLabel}>TARGET SCORE</Text>
              <Text style={[S.scoreValue, { color: "#34D399" }]}>{r.target_score}</Text>
            </View>
          </View>
        </View>

        <View style={S.body}>
          <View style={S.sh}><View style={S.bar} /><Text style={S.stitle}>What This Roadmap Is Based On</Text></View>
          <View style={S.infoBox}>
            <Text style={S.infoText}>{output.real_problem}</Text>
          </View>

          <View style={S.sh}><View style={S.bar} /><Text style={S.stitle}>Score Gap Analysis</Text></View>
          <View style={[S.infoBox, { borderLeftColor: "#CBD5E1", backgroundColor: "#F1F5F9" }]}>
            <Text style={S.infoText}>{output.score_gap_analysis}</Text>
          </View>
        </View>

        <View style={S.footer}>
          <Text style={S.footerL}>Confidential · For {input.studentName} only</Text>
          <Text style={S.footerR}>wryze.ai</Text>
        </View>
      </Page>

      {/* PAGE 2: Blockers + Study Plan */}
      <Page size="A4" style={S.page}>
        <View style={S.body}>
          <View style={S.sh}><View style={S.bar} /><Text style={S.stitle}>What&apos;s Blocking the Score</Text></View>
          {r.blockers.map((b, i) => (
            <View key={i} style={S.blockerRow}>
              <View style={S.blockerDot} />
              <Text style={S.blockerText}>{b}</Text>
            </View>
          ))}

          <View style={[S.sh, { marginTop: 20 }]}><View style={S.bar} /><Text style={S.stitle}>Month-by-Month Study Plan</Text></View>
          {r.monthly_plan.map((m, i) => (
            <View key={i} style={S.planRow}>
              <View style={S.planLeft}>
                <Text style={S.planMonth}>{m.month.toUpperCase()}</Text>
                <Text style={S.planMilestone}>{m.milestone}</Text>
              </View>
              <View style={S.planConnector} />
              <Text style={S.planFocus}>{m.focus}</Text>
            </View>
          ))}

          <View style={[S.sh, { marginTop: 20 }]}><View style={S.bar} /><Text style={S.stitle}>What Wryze Will Track for {input.studentName}</Text></View>
          {r.what_wryze_tracks.map((t, i) => (
            <View key={i} style={S.trackRow}>
              <View style={S.trackDot} />
              <Text style={S.trackText}>{t}</Text>
            </View>
          ))}

          <View style={[S.sh, { marginTop: 20 }]}><View style={S.bar} /><Text style={S.stitle}>Why This Plan Is Realistic</Text></View>
          <View style={S.infoBox}>
            <Text style={S.infoText}>{r.why_realistic}</Text>
          </View>

          <View style={S.guaranteeBox}>
            <Text style={S.guaranteeTitle}>✅ WRYZE GUARANTEE</Text>
            <Text style={S.guaranteeText}>{r.guarantee_note}</Text>
          </View>
        </View>

        <View style={S.disclaimer}>
          <Text style={S.disclaimerText}>
            This roadmap was prepared based on {input.studentName}&apos;s consultation and score data.
            Monthly milestones are estimates based on typical improvement patterns.
            Actual progress depends on consistent engagement with the Wryze platform.
            This document is confidential and prepared exclusively for {input.studentName}.
          </Text>
        </View>

        <View style={S.footer}>
          <Text style={S.footerL}>Confidential · For {input.studentName} only</Text>
          <Text style={S.footerR}>wryze.ai</Text>
        </View>
      </Page>
    </Document>
  );
}

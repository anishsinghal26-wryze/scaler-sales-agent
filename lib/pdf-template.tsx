import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { PDFContent } from "./types";

// ── Theme palettes per lead segment ────────────────────────────────────────
const THEMES = {
  senior: {
    primary: "#0F172A",   // dark navy
    accent: "#3B82F6",    // bright blue
    accent2: "#1E40AF",
    badge: "#DBEAFE",
    badgeText: "#1E40AF",
    coverBg: "#0F172A",
    coverText: "#FFFFFF",
    tag: "Senior Track",
  },
  mid: {
    primary: "#1E1B4B",   // indigo
    accent: "#7C3AED",    // purple
    accent2: "#6D28D9",
    badge: "#EDE9FE",
    badgeText: "#6D28D9",
    coverBg: "#1E1B4B",
    coverText: "#FFFFFF",
    tag: "Career Accelerator",
  },
  junior: {
    primary: "#7C2D12",   // warm brown
    accent: "#F97316",    // orange
    accent2: "#EA580C",
    badge: "#FFEDD5",
    badgeText: "#C2410C",
    coverBg: "#0C1A2E",
    coverText: "#FFFFFF",
    tag: "Launch Track",
  },
};

const createStyles = (t: (typeof THEMES)[keyof typeof THEMES]) =>
  StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      backgroundColor: "#FFFFFF",
      paddingBottom: 40,
    },
    // ── Cover Page ──────────────────────────────────────────────────────────
    coverBg: {
      backgroundColor: t.coverBg,
      padding: 48,
      paddingTop: 56,
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 48,
    },
    brandDot: {
      width: 12,
      height: 12,
      backgroundColor: t.accent,
      borderRadius: 6,
      marginRight: 8,
    },
    brandName: {
      fontSize: 14,
      color: "#94A3B8",
      fontFamily: "Helvetica-Bold",
      letterSpacing: 2,
    },
    coverTag: {
      backgroundColor: t.accent,
      borderRadius: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: "flex-start",
      marginBottom: 20,
    },
    coverTagText: {
      fontSize: 9,
      color: "#FFFFFF",
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1,
    },
    coverTitle: {
      fontSize: 32,
      color: "#FFFFFF",
      fontFamily: "Helvetica-Bold",
      lineHeight: 1.25,
      marginBottom: 8,
    },
    coverSubtitle: {
      fontSize: 14,
      color: "#94A3B8",
      marginBottom: 48,
    },
    coverDivider: {
      height: 1,
      backgroundColor: "rgba(255,255,255,0.1)",
      marginBottom: 32,
    },
    coverMetaRow: {
      flexDirection: "row",
      gap: 32,
    },
    coverMetaBlock: {},
    coverMetaLabel: {
      fontSize: 8,
      color: "#64748B",
      fontFamily: "Helvetica-Bold",
      letterSpacing: 1,
      marginBottom: 4,
    },
    coverMetaValue: {
      fontSize: 12,
      color: "#E2E8F0",
    },
    // ── Body ────────────────────────────────────────────────────────────────
    body: {
      paddingHorizontal: 40,
      paddingTop: 32,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      marginTop: 8,
    },
    sectionAccentBar: {
      width: 4,
      height: 20,
      backgroundColor: t.accent,
      borderRadius: 2,
      marginRight: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Helvetica-Bold",
      color: t.primary,
    },
    openingBox: {
      backgroundColor: "#F8FAFC",
      borderLeftWidth: 3,
      borderLeftColor: t.accent,
      padding: 16,
      borderRadius: 4,
      marginBottom: 28,
    },
    openingText: {
      fontSize: 11,
      color: "#334155",
      lineHeight: 1.6,
    },
    // ── Q&A cards ───────────────────────────────────────────────────────────
    qaCard: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 8,
      marginBottom: 16,
      overflow: "hidden",
    },
    qaCardTop: {
      backgroundColor: "#F8FAFC",
      padding: 14,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    qaQuestionMark: {
      fontSize: 13,
      fontFamily: "Helvetica-Bold",
      color: t.accent,
      marginRight: 8,
      marginTop: 1,
    },
    qaQuestion: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: t.primary,
      flex: 1,
      lineHeight: 1.5,
    },
    qaCardBody: {
      padding: 14,
      paddingTop: 12,
    },
    qaAnswer: {
      fontSize: 10.5,
      color: "#334155",
      lineHeight: 1.65,
      marginBottom: 8,
    },
    sourceBadge: {
      flexDirection: "row",
      alignItems: "center",
    },
    sourceDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginRight: 5,
    },
    sourceText: {
      fontSize: 8,
      color: "#64748B",
      fontFamily: "Helvetica-Oblique",
    },
    // ── Next Steps ──────────────────────────────────────────────────────────
    nextStepsBox: {
      backgroundColor: t.badge,
      borderRadius: 8,
      padding: 20,
      marginTop: 8,
      marginBottom: 16,
    },
    nextStepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    nextStepNum: {
      width: 20,
      height: 20,
      backgroundColor: t.accent,
      borderRadius: 10,
      fontSize: 9,
      color: "#FFFFFF",
      fontFamily: "Helvetica-Bold",
      textAlign: "center",
      paddingTop: 5,
      marginRight: 10,
      flexShrink: 0,
    },
    nextStepText: {
      fontSize: 10.5,
      color: t.primary,
      lineHeight: 1.55,
      flex: 1,
      paddingTop: 3,
    },
    // ── Footer ──────────────────────────────────────────────────────────────
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: t.primary,
      paddingHorizontal: 40,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerLeft: {
      fontSize: 8,
      color: "#94A3B8",
    },
    footerRight: {
      fontSize: 8,
      color: t.accent,
      fontFamily: "Helvetica-Bold",
    },
    footerDisclaimer: {
      paddingHorizontal: 40,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: "#E2E8F0",
      marginTop: 8,
    },
    disclaimerText: {
      fontSize: 7.5,
      color: "#94A3B8",
      lineHeight: 1.5,
    },
  });

interface Props {
  content: PDFContent;
  date?: string;
}

export function ScalerPDF({ content, date }: Props) {
  const theme = content.theme ?? "mid";
  const t = THEMES[theme];
  const styles = createStyles(t);

  const today = date ?? new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sourceColor = (s: "curriculum" | "call") =>
    s === "curriculum" ? "#10B981" : "#F59E0B";

  const sourceLabel = (s: "curriculum" | "call", name: string) =>
    s === "curriculum"
      ? "Based on Scaler's published curriculum"
      : `Based on what ${name} shared during the call`;

  // Split sections for pagination — first page shows opening + first 2 Q&As
  const page2Sections = content.sections.slice(0, 2);
  const page3Sections = content.sections.slice(2);

  return (
    <Document
      title={`Scaler — Prepared for ${content.leadName}`}
      author="Scaler Sales AI"
      subject={content.program}
    >
      {/* ── PAGE 1: Cover ───────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        {/* Cover band */}
        <View style={styles.coverBg}>
          {/* Brand row */}
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>SCALER</Text>
          </View>
          {/* Track badge */}
          <View style={styles.coverTag}>
            <Text style={styles.coverTagText}>{t.tag.toUpperCase()}</Text>
          </View>
          {/* Name + title */}
          <Text style={styles.coverTitle}>
            Prepared exclusively{"\n"}for {content.leadName}
          </Text>
          <Text style={styles.coverSubtitle}>{content.program}</Text>
          {/* Divider */}
          <View style={styles.coverDivider} />
          {/* Meta row */}
          <View style={styles.coverMetaRow}>
            <View style={styles.coverMetaBlock}>
              <Text style={styles.coverMetaLabel}>CURRENT ROLE</Text>
              <Text style={styles.coverMetaValue}>
                {content.leadRole} · {content.leadCompany}
              </Text>
            </View>
            <View style={styles.coverMetaBlock}>
              <Text style={styles.coverMetaLabel}>PREPARED ON</Text>
              <Text style={styles.coverMetaValue}>{today}</Text>
            </View>
          </View>
        </View>

        {/* Opening note */}
        <View style={styles.body}>
          <View style={styles.openingBox}>
            <Text style={styles.openingText}>{content.opening}</Text>
          </View>

          {/* Program reason */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionTitle}>Why {content.program}?</Text>
          </View>
          <View style={[styles.openingBox, { borderLeftColor: "#CBD5E1", backgroundColor: "#F1F5F9" }]}>
            <Text style={styles.openingText}>{content.programReason}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            Confidential · For {content.leadName} only
          </Text>
          <Text style={styles.footerRight}>scaler.com</Text>
        </View>
      </Page>

      {/* ── PAGE 2: Your Questions Answered ─────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccentBar} />
            <Text style={styles.sectionTitle}>Your Questions, Answered</Text>
          </View>

          {page2Sections.map((section, i) => (
            <View key={i} style={styles.qaCard}>
              <View style={styles.qaCardTop}>
                <Text style={styles.qaQuestionMark}>Q</Text>
                <Text style={styles.qaQuestion}>{section.question}</Text>
              </View>
              <View style={styles.qaCardBody}>
                <Text style={styles.qaAnswer}>{section.answer}</Text>
                <View style={styles.sourceBadge}>
                  <View
                    style={[
                      styles.sourceDot,
                      { backgroundColor: sourceColor(section.source) },
                    ]}
                  />
                  <Text style={styles.sourceText}>
                    {sourceLabel(section.source, content.leadName)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Overflow Q&As if more than 2 */}
          {page3Sections.length === 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionAccentBar} />
                <Text style={styles.sectionTitle}>Your Next Steps</Text>
              </View>
              <View style={styles.nextStepsBox}>
                {content.nextSteps.map((step, i) => (
                  <View key={i} style={styles.nextStepRow}>
                    <Text style={styles.nextStepNum}>{i + 1}</Text>
                    <Text style={styles.nextStepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            Confidential · For {content.leadName} only
          </Text>
          <Text style={styles.footerRight}>scaler.com</Text>
        </View>
      </Page>

      {/* ── PAGE 3: Overflow Q&As + Next Steps ──────────────────────────── */}
      {(page3Sections.length > 0) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.body}>
            {page3Sections.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionAccentBar} />
                  <Text style={styles.sectionTitle}>More Questions Answered</Text>
                </View>
                {page3Sections.map((section, i) => (
                  <View key={i} style={styles.qaCard}>
                    <View style={styles.qaCardTop}>
                      <Text style={styles.qaQuestionMark}>Q</Text>
                      <Text style={styles.qaQuestion}>{section.question}</Text>
                    </View>
                    <View style={styles.qaCardBody}>
                      <Text style={styles.qaAnswer}>{section.answer}</Text>
                      <View style={styles.sourceBadge}>
                        <View
                          style={[
                            styles.sourceDot,
                            { backgroundColor: sourceColor(section.source) },
                          ]}
                        />
                        <Text style={styles.sourceText}>
                          {sourceLabel(section.source, content.leadName)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>Your Next Steps</Text>
            </View>
            <View style={styles.nextStepsBox}>
              {content.nextSteps.map((step, i) => (
                <View key={i} style={styles.nextStepRow}>
                  <Text style={styles.nextStepNum}>{i + 1}</Text>
                  <Text style={styles.nextStepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.footerDisclaimer}>
            <Text style={styles.disclaimerText}>
              🟢 Curriculum claims are based on Scaler&apos;s published program
              details (scaler.com). 🟡 Personalised insights are based on
              information shared by {content.leadName} during the call. This
              document is prepared exclusively for {content.leadName} and should
              not be shared.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerLeft}>
              Confidential · For {content.leadName} only
            </Text>
            <Text style={styles.footerRight}>scaler.com</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

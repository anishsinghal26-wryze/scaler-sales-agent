/**
 * In-memory PDF store.
 * PDFs are stored by UUID and expire after TTL_MS.
 * Works for demo / dev / single-instance Vercel deployments.
 */

interface PDFEntry {
  buffer: Buffer;
  filename: string;
  createdAt: number;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes

// Module-level store — survives HMR reloads in dev mode when referenced via
// globalThis to prevent duplicate maps across hot-reloads.
const globalStore = globalThis as typeof globalThis & {
  __pdfStore?: Map<string, PDFEntry>;
};

if (!globalStore.__pdfStore) {
  globalStore.__pdfStore = new Map<string, PDFEntry>();
}

const store = globalStore.__pdfStore;

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.createdAt > TTL_MS) {
      store.delete(key);
    }
  }
}

export function storePDF(id: string, buffer: Buffer, filename: string): void {
  cleanup();
  store.set(id, { buffer, filename, createdAt: Date.now() });
}

export function getPDF(id: string): { buffer: Buffer; filename: string } | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    store.delete(id);
    return null;
  }
  return { buffer: entry.buffer, filename: entry.filename };
}

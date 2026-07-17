import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { DashboardData, Donation, DonationInput } from "./types";
import type { AdminIdentity } from "./auth";

type DonationRow = {
  id: string; batch_number: string; batch_name: string; amount: number; note: string;
  received_at: string; created_at: string; updated_at: string;
};

const toDonation = (row: DonationRow): Donation => ({
  id: row.id, batchNumber: row.batch_number, batchName: row.batch_name, amount: Number(row.amount),
  note: row.note, receivedAt: row.received_at, createdAt: row.created_at, updatedAt: row.updated_at,
});

function db(): D1Database {
  return getCloudflareContext().env.DB;
}

export async function listDashboard(): Promise<DashboardData> {
  const database = db();
  const [rows, totals] = await Promise.all([
    database.prepare("SELECT * FROM donations WHERE campaign_id = ? ORDER BY datetime(received_at) DESC, rowid DESC").bind("main").all<DonationRow>(),
    database.prepare("SELECT COALESCE(SUM(amount), 0) AS totalAmount, COUNT(*) AS totalRecords, COUNT(DISTINCT batch_number) AS totalBatches, COALESCE(MAX(updated_at), '') AS lastUpdated FROM donations WHERE campaign_id = ?").bind("main").first<{ totalAmount: number; totalRecords: number; totalBatches: number; lastUpdated: string }>(),
  ]);
  return { donations: (rows.results ?? []).map(toDonation), totalAmount: Number(totals?.totalAmount ?? 0), totalRecords: Number(totals?.totalRecords ?? 0), totalBatches: Number(totals?.totalBatches ?? 0), revision: `${totals?.totalRecords ?? 0}:${totals?.lastUpdated ?? ""}` };
}

export async function getDashboardRevision() {
  const result = await db().prepare("SELECT COUNT(*) AS totalRecords, COALESCE(MAX(updated_at), '') AS lastUpdated FROM donations WHERE campaign_id = ?").bind("main").first<{ totalRecords: number; lastUpdated: string }>();
  return `${result?.totalRecords ?? 0}:${result?.lastUpdated ?? ""}`;
}

function auditStatement(database: D1Database, donationId: string, action: "create" | "update" | "delete", snapshot: unknown, actor: AdminIdentity) {
  return database.prepare("INSERT INTO audit_logs (id, donation_id, action, snapshot, actor_username, actor_name) VALUES (?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), donationId, action, JSON.stringify(snapshot), actor.username, actor.displayName);
}

export async function createDonation(input: DonationInput, actor: AdminIdentity) {
  const database = db();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await database.batch([
    database.prepare("INSERT INTO donations (id, campaign_id, batch_number, batch_name, amount, note, received_at, created_at, updated_at) VALUES (?, 'main', ?, ?, ?, ?, ?, ?, ?)").bind(id, input.batchNumber, input.batchName, input.amount, input.note, now, now, now),
    auditStatement(database, id, "create", { after: input }, actor),
  ]);
  return id;
}

export async function updateDonation(id: string, input: DonationInput, actor: AdminIdentity) {
  const database = db();
  const before = await database.prepare("SELECT * FROM donations WHERE id = ? AND campaign_id = 'main'").bind(id).first<DonationRow>();
  if (!before) return false;
  const now = new Date().toISOString();
  await database.batch([
    database.prepare("UPDATE donations SET batch_number = ?, batch_name = ?, amount = ?, note = ?, updated_at = ? WHERE id = ? AND campaign_id = 'main'").bind(input.batchNumber, input.batchName, input.amount, input.note, now, id),
    auditStatement(database, id, "update", { before: toDonation(before), after: input }, actor),
  ]);
  return true;
}

export async function removeDonation(id: string, actor: AdminIdentity) {
  const database = db();
  const before = await database.prepare("SELECT * FROM donations WHERE id = ? AND campaign_id = 'main'").bind(id).first<DonationRow>();
  if (!before) return false;
  await database.batch([
    auditStatement(database, id, "delete", { before: toDonation(before) }, actor),
    database.prepare("DELETE FROM donations WHERE id = ? AND campaign_id = 'main'").bind(id),
  ]);
  return true;
}

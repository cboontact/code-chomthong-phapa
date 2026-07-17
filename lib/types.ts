export type Donation = {
  id: string;
  batchNumber: string;
  batchName: string;
  amount: number;
  note: string;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardData = {
  donations: Donation[];
  totalAmount: number;
  totalBatches: number;
  totalRecords: number;
  revision: string;
};

export type DonationInput = Pick<Donation, "batchNumber" | "batchName" | "amount" | "note">;

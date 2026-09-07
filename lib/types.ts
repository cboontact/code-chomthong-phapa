export type Donation = {
  id: string;
  batchNumber: string;
  batchName: string;
  cashAmount: number;
  transferAmount: number;
  amount: number;
  note: string;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardData = {
  donations: Donation[];
  totalAmount: number;
  totalCashAmount: number;
  totalTransferAmount: number;
  totalBatches: number;
  totalRecords: number;
  revision: string;
};

export type DonationInput = Pick<Donation, "batchNumber" | "batchName" | "cashAmount" | "transferAmount" | "note">;

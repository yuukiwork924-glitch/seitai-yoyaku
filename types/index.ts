import type { User, Staff, Menu, Reservation, MedicalRecord, IntakeForm, PointTransaction, BusinessSettings, ClosedDay, StaffSchedule } from "@prisma/client";

export type { User, Staff, Menu, Reservation, MedicalRecord, IntakeForm, PointTransaction, BusinessSettings, ClosedDay, StaffSchedule };

export type ReservationWithRelations = Reservation & {
  user: User;
  staff: Staff | null;
  menu: Menu;
  medicalRecord?: MedicalRecord | null;
  pointTransaction?: PointTransaction | null;
};

export type UserSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type ReservationStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

// 予約フロー用（Zustandストア）
export interface ReservationDraft {
  menuId: string;
  menuName: string;
  menuDuration: number;
  menuPrice: number;
  date: string;
  startTime: string;
  endTime: string;
  staffId?: string;
  staffName?: string;
  isFirstVisit: boolean;
  usePoints: boolean;
  pointsToUse: number;
}

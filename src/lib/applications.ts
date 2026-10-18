import { supabase } from "@/integrations/supabase/client";

export type ApplicationStatus = "new" | "contacted" | "approved" | "rejected";

export type Application = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  service: string;
  amount: string | null;
  message: string | null;
  status: ApplicationStatus;
  admin_note: string | null;
  created_at: string;
};

export const statuses: { value: ApplicationStatus; en: string; bn: string; tone: string }[] = [
  { value: "new", en: "New", bn: "নতুন", tone: "bg-red/10 text-red-dark border-red/30" },
  {
    value: "contacted",
    en: "Contacted",
    bn: "যোগাযোগ হয়েছে",
    tone: "bg-amber-50 text-amber-800 border-amber-300",
  },
  {
    value: "approved",
    en: "Approved",
    bn: "অনুমোদিত",
    tone: "bg-green-dark/10 text-green-deep border-green-dark/30",
  },
  {
    value: "rejected",
    en: "Rejected",
    bn: "বাতিল",
    tone: "bg-secondary text-muted-foreground border-border",
  },
];

export type ApplicationInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  amount: string;
  message: string;
};

const clip = (v: string, max: number) => {
  const t = v.trim();
  return t ? t.slice(0, max) : null;
};

/** Saves a website application. Anyone may insert; only admins can read. */
export async function submitApplication(input: ApplicationInput) {
  const { error } = await supabase.from("applications").insert({
    name: input.name.trim().slice(0, 120),
    phone: input.phone.trim().slice(0, 30),
    email: clip(input.email, 160),
    address: clip(input.address, 300),
    service: input.service.slice(0, 60),
    amount: clip(input.amount, 30),
    message: clip(input.message, 2000),
  });
  if (error) throw error;
}

export const applicationsQuery = {
  queryKey: ["applications"],
  queryFn: async (): Promise<Application[]> => {
    const { data, error } = await supabase
      .from("applications")
      .select(
        "id, name, phone, email, address, service, amount, message, status, admin_note, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []) as Application[];
  },
};

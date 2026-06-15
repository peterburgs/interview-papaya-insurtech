import type { Metadata } from "next";
import { InsurancePlanTable } from "@/modules/insurance-plan";

export const metadata: Metadata = {
  title: "Insurance Plan Pricing",
  description: "Compare insurance plan benefits, limits, and pricing with a responsive recommendation-first layout.",
};

const Page = () => {
  return <InsurancePlanTable />;
};

export default Page;

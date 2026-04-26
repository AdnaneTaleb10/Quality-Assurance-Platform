import FeatureCard from "./FeatureCard";
import { FileText, BarChart3, CheckCircle } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="bg-[#EFF4FF] py-20 px-4 md:px-10">

      <div className="w-full">

        {/* HEADER */}
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
            Everything You Need to Ensure Quality and Compliance
          </h2>

          <p className="mt-4 text-[#64748B] max-w-3xl mx-auto">
            Evaluate, validate, and manage quality assurance processes with structured workflows,
            evidence-based submissions, and real-time tracking.
          </p>

        </div>

        {/* CARDS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">

          <FeatureCard
            Icon={FileText}
            title="Proof-Based Evaluation"
            description="Each response must be supported by official documents such as reports, policies, or institutional records. This ensures every evaluation is traceable, verifiable, and backed by concrete evidence rather than assumptions."
            borderColor="#006D37"
          />

          <FeatureCard
            Icon={BarChart3}
            title="Statistics Dashboard"
            description="Monitor the progress of evaluations across different domains with structured analytics. View completion rates, submission status, and institutional performance through clear and intuitive visual dashboards."
            borderColor="#00346F"
          />

          <FeatureCard
            Icon={CheckCircle}
            title="Review & Approval Process"
            description="All submissions go through a controlled validation pipeline where administrators can review answers, verify attached proofs, approve or reject entries, and provide feedback to ensure compliance and accuracy."
            borderColor="#FFB77D"
          />

        </div>

      </div>
    </section>
  );
}
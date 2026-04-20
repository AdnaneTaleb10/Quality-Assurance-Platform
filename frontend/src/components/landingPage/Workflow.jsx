import WorkflowStep from "./WorkflowStep";

export default function Workflow() {
  return (
    <section id="workflow" className="bg-[#F8F9FF] py-20 px-4 md:px-10">

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full flex flex-col gap-16">

        {/* TOP SECTION */}
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-16">

          {/* LEFT IMAGE (BIGGER + NOT CENTERED FEEL) */}
          <div className="w-full md:w-2/5 flex justify-start">
            <img
              src="/workflow-image.svg"
              alt="Workflow illustration"
              className="w-full max-w-md md:max-w-xl lg:max-w-2xl"
            />
          </div>

          {/* RIGHT STEPS */}
          <div className="w-full md:w-2/5 flex flex-col gap-8">

            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
              Quality Assurance Workflow
            </h2>

            <div className="flex flex-col gap-7">

              <WorkflowStep
                number="1"
                title="Evaluate"
                description="Answer structured questions related to the university’s infrastructure using simple Yes/No inputs to assess the current state."
              />

              <WorkflowStep
                number="2"
                title="Prove"
                description="Upload supporting documents such as reports, policies, or official files to justify each response and ensure transparency."
              />

              <WorkflowStep
                number="3"
                title="Validate"
                description="Submissions are reviewed by the administrator, who verifies the answers and documents, then approves or rejects them with feedback if needed."
              />

            </div>

          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="bg-[#004A99] text-white rounded-xl p-10 text-center">

          <h3 className="text-2xl font-bold">
            Take Control of Institutional Quality
          </h3>

          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Use a structured evaluation system to assess infrastructure, upload supporting documents,
            and ensure reliable validation of results.
          </p>

          <button className="mt-6 bg-white text-[#004A99] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
            Begin Assessment
          </button>

        </div>

      </div>
    </section>
  );
}
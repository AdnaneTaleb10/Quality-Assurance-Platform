import Sidebar from "../components/feature_myAnswers/myAnswers_sidebar";
import Topbar from "../components/Topbar";
import PageHeader from "../components/feature_myAnswers/PageHeader";
import AnswersTable from "../components/feature_myAnswers/AnswersTable";

const MyAnswersPage = () => {
  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      <Topbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 px-8 py-6">
          <PageHeader />
          <AnswersTable />
        </div>
      </div>
    </div>
  );
};

export default MyAnswersPage;
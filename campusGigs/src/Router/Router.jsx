import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import About from "../Pages/About";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import Job from "../Pages/Job";
import Contact from "../Pages/Contact";
import EmployerSignUp from "../components/employerSignUp";
import ApplicantSignUp from "../components/ApplicantSignUp";
import EmployerDb from "../components/EmployerDb";
import EmployerMyAcc from "../components/EmployerMyAcc";
import EmployerAppList from "../components/EmployerAppList";
import EmployerJobPost from "../components/EmployerJobPost";
import EmployerStaffs from "../components/EmployerStaffs";
import EmployerRegisterSuccess from "../components/EmployerRegisterSuccess";
import ApplicantDashboard from "../components/ApplicantDashboard";
import ApplicantsMyAcc from "../components/ApplicantsMyAcc";
import AdminDashboard from "../components/AdminDashboard";
import ParentSignUp from "../components/ParentSignUp";
import ParentDashboard from "../components/ParentDashboard";
import ParentMyAcc from "../components/ParentMyAcc";
import ParentTutors from "../components/ParentTutors";
import ParentAppList from "../components/ParentAppList";
import ParentPostTutor from "../components/ParentPostTutor";
import AdminManageJob from "../components/AdminManageJob";
import AdminManageRegister from "../components/AdminManageRegister";
import ApplicantsJobApps from "../components/ApplicantsJobApps";
import ApplicantsCurrentJob from "../components/ApplicantsCurrentJob";
import ApplicantsLevelingSystem from "../components/ApplicantsLevelingSystem";
import ApplicantsFeedBack from "../components/ApplicantsFeedback";
import EmployerFeedBack from "../components/EmployerFeedback";
import AdminManageTutor from "../components/AdminManageTutor";


const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {path: "/", element: <Home/>},
        {path: "sign-in", element: <SignIn />},
        {path: "sign-up", element: <SignUp />},
        {path: "About", element: <About />},
        {path: "Job", element: <Job />},
        {path: "Contact", element: <Contact />},
        {path: "employerSignUp", element: <EmployerSignUp />},
        {path: "applicantSignUp", element: <ApplicantSignUp />},
        {path: "employerDb", element: <EmployerDb />},
        {path: "employerMyAcc", element: <EmployerMyAcc />},
        {path: "employerAppList", element: <EmployerAppList />},
        {path: "employerJobPost", element: <EmployerJobPost />},
        {path: "employerStaffs", element: <EmployerStaffs />},
        {path: "employerRegisterSuccess", element: <EmployerRegisterSuccess />},
        {path: "applicantDashboard", element: <ApplicantDashboard />},
        {path: "applicantsMyAcc", element: <ApplicantsMyAcc />},
        {path: "adminDashboard", element: <AdminDashboard />},
        {path: "parentSignUp", element: <ParentSignUp />},
        {path: "parentDashboard", element: <ParentDashboard />},
        {path: "parentMyAcc", element: <ParentMyAcc />},
        {path: "parentTutors", element: <ParentTutors />},
        {path: "parentAppList", element: <ParentAppList />},
        {path: "parentPostTutor", element: <ParentPostTutor />},
        {path: "adminManageJob", element: <AdminManageJob />},
        {path: "adminManageRegister", element: <AdminManageRegister />},
        {path: "applicantsJobApps", element: <ApplicantsJobApps />},
        {path: "applicantsCurrentJob", element: <ApplicantsCurrentJob />},
        {path: "applicantsLevelingSystem", element: <ApplicantsLevelingSystem />},
        {path: "applicantsFeedback", element: <ApplicantsFeedBack />},
        {path: "EmployerFeedBacks", element: <EmployerFeedBack />},
        {path: "AdminManageTutor", element: <AdminManageTutor />},
        

      ]
    },
  ]);

  export default router;
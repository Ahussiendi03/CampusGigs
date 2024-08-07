import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import About from "../Pages/About";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import Job from "../Pages/Job";
import Contact from "../Pages/Contact";
import EmployerSignUp from "../components/employerSignUp";
import ParentSignUp from "../components/ParentSignUp";
import ApplicantSignUp from "../components/ApplicantSignUp";
import EmployerDb from "../components/EmployerDb";
import EmployerMyAcc from "../components/EmployerMyAcc";
import EmployerAppList from "../components/EmployerAppList";

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
        {path: "parentSignUp", element: <ParentSignUp />},
        {path: "applicantSignUp", element: <ApplicantSignUp />},
        {path: "employerDb", element: <EmployerDb />},
        {path: "employerMyAcc", element: <EmployerMyAcc />},
        {path: "employerAppList", element: <EmployerAppList />},

      ]
    },
  ]);

  export default router;
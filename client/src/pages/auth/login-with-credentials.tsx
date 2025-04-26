import { Helmet } from "react-helmet";
import { LoginView } from "@/sections/auth/login/view";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>SkillNexus : Login</title>
      </Helmet>
      <LoginView />
    </>
  );
};

export default LoginPage;

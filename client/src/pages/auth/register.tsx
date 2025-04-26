import { RegisterView } from "@/sections/auth/register/view";
import { Helmet } from "react-helmet";

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>SkillNexus : Register</title>
      </Helmet>
      <RegisterView />
    </>
  );
};

export default RegisterPage;

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const OAuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      navigate("/courses");
    } else {
      navigate("/login");
    }
  }, []);

  return <div className="text-center mt-20">Logging you in with Google...</div>;
};

export default OAuthHandler;

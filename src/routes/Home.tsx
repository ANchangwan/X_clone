import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const logOut = () => {
  const navigate = useNavigate();
  auth.signOut();
  navigate("/");
};

export default function Home() {
  return (
    <h1>
      <button onClick={logOut}>Log Out</button>
    </h1>
  );
}

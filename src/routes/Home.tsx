import { auth } from "../firebase";

const logOut = () => {
  auth.signOut();
};

export default function Home() {
  return (
    <h1>
      <button onClick={logOut}>Log Out</button>
    </h1>
  );
}

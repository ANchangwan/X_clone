import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
  Form,
} from "../components/auth-components";
import GithubButton from "../components/github-button";

export default function FindPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") return;
    try {
      setIsLoading(true);
      const existEmail = await fetchSignInMethodsForEmail(auth, email);
      if (existEmail.length === 0) {
        alert("이메일 없음");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      navigate("/login");
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
    //create an Account
    //set thie name of the user
    //redirect
  };
  return (
    <Wrapper>
      <Title>Find Password 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <Input type="submit" value={isLoading ? "Loading" : "Find Password"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?<Link to="/create-account"> Create one</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}

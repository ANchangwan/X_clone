import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import PostTweetForm from "../components/post-tweet-form";
import { styled } from "styled-components";

const Wrapper = styled.div``;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
    </Wrapper>
  );
}

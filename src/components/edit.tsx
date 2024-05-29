import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { useState } from "react";

const Form = styled.form``;
const Column = styled.div``;
const EditTextArea = styled.textarea``;
const ModifyBtn = styled.button``;
const Photo = styled.img``;

export default function Edit({ tweet }: ITweet) {
  const [modify, setModify] = useState(tweet);
  const onChange = () => {};
  const onSubmit = () => {};
  return (
    <Form onSubmit={onSubmit}>
      <Column>
        <EditTextArea onChange={onChange} value={tweet}></EditTextArea>
        <ModifyBtn>수정</ModifyBtn>
      </Column>
      <Photo></Photo>
    </Form>
  );
}

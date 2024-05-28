import { styled } from "styled-components";
import { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  color: white;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf9;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf9;
  text-align: center;
  border: 1px solid #1d9bf9;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 15px;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf9;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const oneMb = 1 * 1024 * 1024;
    if (files && files[0].size > oneMb) {
      alert("용량이 큽니다. 1MB크기로 업로드해주세요!!");
      return;
    }
    if (files && files.length >= 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        console.log(result.ref);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
        setTweet("");
        setFile(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setTweet("");
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        onChange={onChange}
        rows={5}
        maxLength={500}
        value={tweet}
        placeholder="What is happening"
      />
      <AttachFileButton htmlFor="file">
        {file ? "✅Photo added" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="/image/*"
      ></AttachFileInput>
      <SubmitBtn
        type="submit"
        value={isLoading ? "Loading..." : "Post Tweet"}
      />
    </Form>
  );
}

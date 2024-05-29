import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, collection, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin-bottom: 5px;
  align-items: center;
`;

const Column = styled.div``;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const ModifyPayload = styled.textarea`
  display: block;
  border: none;
  background-color: black;
  color: white;
  width: 95%;
  resize: none;
  padding: 2px;
  margin: 5px;
  font-size: 16px;
  border-bottom: 2px solid black;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf9;
  }
`;
const Modify = styled.input`
  background-color: #1d9bf9;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  color: white;
`;

const ModifyPhoto = styled.label``;
const ModifyInput = styled.input`
  display: none;
`;

const Form = styled.form``;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  margin-right: 5px;
`;

const EditButton = styled.button`
  background-color: #1d9bf9;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEdit, setIsEdit] = useState(true);
  const [isTweet, setIsTweet] = useState(tweet);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || tweet.length > 180) return;
    try {
      const modifyText = await doc(db, "tweets", id);
      const ok = confirm("수정하시겠습니까?");
      if (ok) {
        await updateDoc(modifyText, { tweet: isTweet });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsEdit(true);
    }
  };

  const onEdit = () => {
    setIsEdit(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsTweet(e.target.value);
  };

  const changePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const ok = confirm("변경할건가요?");
    if (!ok || user?.uid !== userId) return;
    try {
      const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      await deleteObject(photoRef);
      if (files && files.length >= 1) {
        const photoDoc = doc(db, "tweets", id);
        const result = await uploadBytes(photoRef, files[0]);
        const url = await getDownloadURL(result.ref);
        await updateDoc(photoDoc, {
          photo: url,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    const ok = confirm("삭제할건가요?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEdit ? (
          <Payload>{tweet}</Payload>
        ) : (
          <Form onSubmit={onSubmit}>
            <ModifyPayload onChange={onChange} value={isTweet}></ModifyPayload>
            <Modify type="submit" value="수정"></Modify>
          </Form>
        )}
        {user?.uid === userId && isEdit ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {user?.uid === userId && isEdit ? (
          <EditButton onClick={onEdit}>Edit</EditButton>
        ) : null}
      </Column>
      {isEdit ? (
        <Column>{photo ? <Photo src={photo}></Photo> : null}</Column>
      ) : (
        <>
          <ModifyPhoto htmlFor="photo">
            <Column>{photo ? <Photo src={photo}></Photo> : null}</Column>
          </ModifyPhoto>
          <ModifyInput
            onChange={changePhoto}
            type="file"
            id="photo"
            accept="/image/*"
          ></ModifyInput>
        </>
      )}
    </Wrapper>
  );
}

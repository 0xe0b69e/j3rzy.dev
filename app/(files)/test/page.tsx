"use client";

import { useRef } from "react";

export default function Page (): JSX.Element
{
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  
  function uploadFile() {
    if (!fileInputRef?.current?.files) {
      return console.log('No file found');
    }
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('private', `${checkboxRef.current?.checked}`);
    
    fetch('/api/file', {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => console.log(data));
  }
  
  return (
    <div className="pt-16">
      <input ref={fileInputRef} type="file" />
      <input ref={checkboxRef} type="checkbox" id="checkbox" name="checkbox" />
      <label htmlFor="checkbox">Check me</label>
      <button onClick={uploadFile}>Upload file</button>
    </div>
  );
}
"use client";

export default function Page (): JSX.Element
{
  return (
    <>
      <iframe name="dummyframe" id="dummyframe" className="hidden"></iframe>
      <div className="pt-16 flex flex-col text-black">
        <form method="post" action="/api/file" encType="multipart/form-data" target="dummyframe">
          <input type="file" name="file" multiple/>
          <input type="checkbox" name="private"/>
          <button type="submit">Upload file</button>
        </form>
      </div>
    </>
  );
}
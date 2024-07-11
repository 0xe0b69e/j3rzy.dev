"use client";

import React, { useEffect } from "react";

export default function Home (): JSX.Element
{
  const [ loaded, setLoaded ] = React.useState(false);

  useEffect(() => setLoaded(true), []);

  return (
    <>
    </>
  )
}
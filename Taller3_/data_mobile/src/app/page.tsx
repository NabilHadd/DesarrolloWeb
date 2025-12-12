"use client";

import Image from "next/image";
import React, {useEffect, useState} from "react";
import axios  from "axios";
import {Admin} from "../modules/admin/types"

export default function Home() {
  const [admin, setAdmin] = useState<Admin[] | null>(null);
  const [error, setError] = useState();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/admin`)
    .then(res => {
      setAdmin(res.data);
      console.log(JSON.stringify(res));
    })
    .catch(err => {
      setError(err.error);
    });
  }, [])
 

  return (
    <p className="bg-green-400 flex justify-center m-4">{admin?.[0].nombre}</p>
  );
}

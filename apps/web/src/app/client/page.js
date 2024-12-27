"use client";

import { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function Client() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/data`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <span>Client</span>
      {JSON.stringify(data)}
    </div>
  );
}

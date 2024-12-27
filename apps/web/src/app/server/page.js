import { cookies } from "next/headers";
import { API_URL } from "../../config";

export default async function Server() {
  const cookiesData = await cookies();
  const headers = new Headers();
  headers.append("Cookie", cookiesData);

  const response = await fetch(`${API_URL}/data`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  const data = await response.json();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <span>Server</span>
      {JSON.stringify(data)}
    </div>
  );
}

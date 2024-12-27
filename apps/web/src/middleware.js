import { NextResponse } from "next/server";

function parseCookies(cookieString) {
  const cookies = cookieString.split(/(?<!Expires\S+),/g).map((s) => s.trim());

  return cookies.map((cookie) => {
    const [nameValue, ...opts] = cookie.split(";");
    const [name, value] = nameValue.split("=").map((s) => s.trim());

    const options = {};
    opts.forEach((opt) => {
      const [key, val] = opt
        .trim()
        .split("=")
        .map((s) => s.trim());
      options[key] = val === undefined ? true : val;
    });

    return [name, value, options];
  });
}

export async function middleware(request) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  if (!accessToken && refreshToken) {
    const headers = new Headers();
    headers.append("Cookie", `refresh_token=${refreshToken.value}`);

    const res = await fetch("http://localhost:3001/refresh", {
      method: "POST",
      headers: headers,
      credentials: "include",
    });

    const resp = NextResponse.next();
    resp.headers.append("set-cookie", res.headers.get("set-cookie"));

    parseCookies(res.headers.get("set-cookie")).forEach((cookie) => {
      resp.cookies.set(cookie[0], cookie[1], cookie[2]);
    });

    return resp;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

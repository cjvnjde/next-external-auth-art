import http from "http";

function generateToken(type) {
  return `${type}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

function createCookie(name, expires = new Date(0)) {
  return `${name}=${generateToken("access")}; HttpOnly; Path=/; SameSite=Lax; Expires=${expires.toUTCString()}`;
}

function enableCors(req, res) {
  const origin = req.headers.origin || "*";

  if (origin !== "*") {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
}

const server = http.createServer((req, res) => {
  const url = req.url;

  enableCors(req, res);
  res.setHeader("Content-Type", "application/json");

  switch (url) {
    case "/login": {
      res.setHeader("Set-Cookie", [
        createCookie("access_token", new Date(Date.now() + 10 * 1000)),
        createCookie("refresh_token", new Date(Date.now() + 5 * 60 * 1000)),
      ]);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Logged in" }));
      break;
    }
    case "/logout": {
      res.setHeader("Set-Cookie", [
        createCookie("access_token"),
        createCookie("refresh_token"),
      ]);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Logged out" }));
      break;
    }
    case "/refresh": {
      if (req.headers.cookie?.includes("refresh_token")) {
        res.setHeader("Set-Cookie", [
          createCookie("access_token", new Date(Date.now() + 10 * 1000)),
          createCookie("refresh_token", new Date(Date.now() + 5 * 60 * 1000)),
        ]);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Tokens refreshed" }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Not authenticated" }));
      }
      break;
    }
    default: {
      if (req.headers.cookie?.includes("access_token")) {
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Authenticated" }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Not authenticated" }));
      }
    }
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

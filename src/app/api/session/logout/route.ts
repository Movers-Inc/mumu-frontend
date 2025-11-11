import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Clear the JWT cookie
  const cookie = serialize("DDD-marketing", "", {
    maxAge: 0, // Set the maxAge to 0 to expire the cookie
    path: "/"
  });

  const redirectCookie = serialize("redirected", "true", {
    maxAge: 60 * 5, // The cookie will be valid for 5 minutes
    path: "/", // Make sure the cookie applies to all paths
    httpOnly: false // Allow the client to read this cookie (important for front-end usage)
  });

  // Create a new NextResponse instance and set the response headers
  const response = new NextResponse(null, {
    status: 303,
    headers: {
      "Set-Cookie": cookie,
      Location: "/"
    }
  });

  response.headers.append("Set-Cookie", redirectCookie);
  return response;
}

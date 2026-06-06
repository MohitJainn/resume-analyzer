export {default}
from "next-auth/middleware";
export const config={
    matcher: [
        "/Dashboard/:path*",
    ],
};
console.log("Middleware Loaded");
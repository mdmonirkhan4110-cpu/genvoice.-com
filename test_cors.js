import fetch from "node-fetch";

async function test() {
  try {
    const res = await fetch("https://auphonic.com/api/productions.json", {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
      }
    });
    console.log(res.status, res.headers.raw());
  } catch(e) {
    console.error(e);
  }
}
test();

import fetch from "node-fetch";

async function test() {
  const auphonicToken = "dummy";
  const res = await fetch('https://auphonic.com/api/productions.json', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${auphonicToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      metadata: { title: `GenVoice_${Date.now()}` },
      algorithms: {
        denoise: false,
        normloudness: true,
        dynamic_range_compressor: true,
        highpass_filter: false
      },
      output_files: [{ format: 'wav' }]
    })
  });
  console.log(res.status, res.statusText);
  console.log(await res.text());
}
test();

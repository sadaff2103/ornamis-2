
const fs = require('fs');
const API_KEY = "ijkkZSxjbLvv_5C6qdk9pQ";
const API_BASE = "https://stablehorde.net/api/v2";

const LOG_FILE = "horde_result.txt";

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

// Clear log file
try { fs.unlinkSync(LOG_FILE); } catch (e) { }

async function generateImage() {
    log("🎨 sending generation request...");

    try {
        const response = await fetch(`${API_BASE}/generate/async`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": API_KEY,
            },
            body: JSON.stringify({
                prompt: "ruby necklace",
                params: {
                    sampler_name: "k_euler_a",
                    cfg_scale: 7.5,
                    denoising_strength: 0.75,
                    height: 512,
                    width: 512,
                    karras: true,
                    steps: 30,
                    n: 1,
                },
                nsfw: false,
                censor_nsfw: false,
                trusted_workers: true,
                models: ["stable_diffusion"],
                r2: true,
            }),
        });

        if (!response.ok) {
            log("API Error: " + await response.text());
            return;
        }

        const data = await response.json();
        log("📝 Job ID: " + data.id);

        await waitForCompletion(data.id);

    } catch (error) {
        log("Request failed: " + error);
    }

    log("Script finished");
}

async function waitForCompletion(id) {
    let attempts = 0;
    while (attempts < 60) {
        await new Promise(r => setTimeout(r, 2000));

        try {
            const res = await fetch(`${API_BASE}/generate/check/${id}`);
            const status = await res.json();

            log(`Status: done=${status.done}, wait=${status.wait_time}, position=${status.queue_position}`);

            if (status.done) {
                await getImages(id);
                return;
            }
        } catch (e) {
            log("Check failed: " + e);
        }
        attempts++;
    }
    log("Timeout waiting for generation");
}

async function getImages(id) {
    const res = await fetch(`${API_BASE}/generate/status/${id}`);
    const data = await res.json();

    log("---------------------------------------------------");
    log("Final Response Data: " + JSON.stringify(data, null, 2));
    log("---------------------------------------------------");

    if (data.generations && data.generations.length > 0) {
        const gen = data.generations[0];
        log("Image URL/Data: " + gen.img);
        log("Censored: " + gen.censored);
    } else {
        log("No generations found.");
    }
}

generateImage();

const https = require('https');

const SUPABASE_URL = 'nauhpivojvoxapihcqvw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_EMAIL = process.argv[2] || 'sadafalisha0301@gmail.com';
const NEW_PASSWORD = process.argv[3];

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
    process.exit(1);
}
if (!NEW_PASSWORD) {
    console.error('Usage: node reset-password.mjs [email] <new_password>');
    process.exit(1);
}

function httpRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : '';
        const options = {
            hostname: SUPABASE_URL,
            port: 443,
            path: path,
            method: method,
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': 'Bearer ' + SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: data });
            });
        });

        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

async function main() {
    console.log('=== Supabase Password Reset ===');
    console.log('Target:', USER_EMAIL);

    // Step 1: List users
    console.log('\n[1] Fetching users...');
    const listRes = await httpRequest('GET', '/auth/v1/admin/users?per_page=1000', null);
    console.log('    Status:', listRes.status);

    if (listRes.status !== 200) {
        console.log('    Error response:', listRes.body);
        return;
    }

    const data = JSON.parse(listRes.body);
    const users = data.users || [];
    console.log('    Total users found:', users.length);

    const user = users.find(u => u.email === USER_EMAIL);
    if (!user) {
        console.log('    User NOT found!');
        console.log('    Emails in DB:', users.map(u => u.email));
        return;
    }
    console.log('    User ID:', user.id);
    console.log('    Email confirmed:', !!user.email_confirmed_at);

    // Step 2: Update the user
    console.log('\n[2] Resetting password...');
    const updateRes = await httpRequest('PUT', '/auth/v1/admin/users/' + user.id, {
        email_confirm: true,
        password: NEW_PASSWORD,
    });
    console.log('    Status:', updateRes.status);
    console.log('    Response:', updateRes.body.substring(0, 200));

    if (updateRes.status === 200) {
        console.log('\n✅ SUCCESS!');
        console.log('Email:', USER_EMAIL);
        console.log('Password:', NEW_PASSWORD);
        console.log('\nYou can now log in!');
    } else {
        console.log('\n❌ Failed to update password');
    }
}

main().catch(err => console.error('Fatal error:', err));

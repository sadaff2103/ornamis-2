const https = require('https');

const SUPABASE_HOST = 'nauhpivojvoxapihcqvw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_EMAIL = process.argv[2] || 'sadafalisha0301@gmail.com';
const NEW_PASSWORD = process.argv[3];

if (!SUPABASE_SERVICE_ROLE_KEY) {
    process.stdout.write('ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.\n');
    process.exit(1);
}
if (!NEW_PASSWORD) {
    process.stdout.write('Usage: node reset-password.cjs [email] <new_password>\n');
    process.exit(1);
}

function httpRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : '';
        const options = {
            hostname: SUPABASE_HOST,
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
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

async function main() {
    process.stdout.write('=== Supabase Password Reset ===\n');
    process.stdout.write('Target: ' + USER_EMAIL + '\n');

    // List users
    process.stdout.write('\n[1] Fetching users...\n');
    const listRes = await httpRequest('GET', '/auth/v1/admin/users?per_page=1000', null);
    process.stdout.write('    HTTP Status: ' + listRes.status + '\n');

    if (listRes.status !== 200) {
        process.stdout.write('    Error: ' + listRes.body + '\n');
        return;
    }

    const data = JSON.parse(listRes.body);
    const users = data.users || [];
    process.stdout.write('    Users found: ' + users.length + '\n');

    const user = users.find(u => u.email === USER_EMAIL);
    if (!user) {
        process.stdout.write('    NOT FOUND! Emails: ' + users.map(u => u.email).join(', ') + '\n');
        return;
    }
    process.stdout.write('    User ID: ' + user.id + '\n');

    // Update user
    process.stdout.write('\n[2] Updating password + confirming email...\n');
    const updateRes = await httpRequest('PUT', '/auth/v1/admin/users/' + user.id, {
        email_confirm: true,
        password: NEW_PASSWORD,
    });
    process.stdout.write('    HTTP Status: ' + updateRes.status + '\n');
    process.stdout.write('    Response: ' + updateRes.body.substring(0, 300) + '\n');

    if (updateRes.status === 200) {
        process.stdout.write('\nSUCCESS! Login with:\n');
        process.stdout.write('Email: ' + USER_EMAIL + '\n');
        process.stdout.write('Password: ' + NEW_PASSWORD + '\n');
    }
}

main().catch(err => {
    process.stdout.write('ERROR: ' + err.message + '\n');
});

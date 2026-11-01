// Usage: node scripts/hash-password.mjs | npx wrangler secret put ADMIN_PASSWORD_HASH
// The prompt goes to stderr and the typed password is not shown, so only the hash reaches stdout.
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";
import { Writable } from "node:stream";

let muted = false;
const output = new Writable({
  write(chunk, _encoding, done) {
    if (!muted) process.stderr.write(chunk);
    done();
  },
});

const rl = createInterface({ input: process.stdin, output, terminal: true });
rl.question("New admin password (12+ characters): ", (password) => {
  rl.close();
  process.stderr.write("\n");
  if (password.length < 12) {
    process.stderr.write("Password must be at least 12 characters.\n");
    process.exit(1);
  }
  const salt = randomBytes(16);
  process.stdout.write(`scrypt:${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`);
});
muted = true;

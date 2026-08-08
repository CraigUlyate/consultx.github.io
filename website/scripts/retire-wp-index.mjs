import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client as FtpClient } from "basic-ftp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });

const host = process.env.AFRIHOST_HOST;
const user = process.env.AFRIHOST_USER;
const password = process.env.AFRIHOST_PASSWORD;
const port = Number(process.env.AFRIHOST_PORT || 21);
const remoteDir = (process.env.AFRIHOST_REMOTE_DIR || "").replace(/\/+$/, "");

async function main() {
  const ftp = new FtpClient();
  await ftp.access({ host, port, user, password, secure: false });
  await ftp.cd(remoteDir);
  const list = await ftp.list();
  const names = list.map((item) => `${item.isDirectory ? "dir" : "file"} ${item.name}`).sort();
  console.log(`Listing ${remoteDir}:`);
  for (const name of names.slice(0, 40)) console.log(`  ${name}`);
  if (names.length > 40) console.log(`  ...and ${names.length - 40} more`);

  const hasIndexPhp = list.some((item) => item.name === "index.php");
  const hasIndexHtml = list.some((item) => item.name === "index.html");
  console.log(`index.php: ${hasIndexPhp ? "yes" : "no"}`);
  console.log(`index.html: ${hasIndexHtml ? "yes" : "no"}`);

  if (hasIndexPhp) {
    const stamp = new Date().toISOString().slice(0, 10);
    const backup = `index.php.bak-wp-${stamp}`;
    if (!list.some((item) => item.name === backup)) {
      await ftp.rename("index.php", backup);
      console.log(`Renamed index.php -> ${backup}`);
    } else {
      console.log(`Backup ${backup} already exists; left index.php as-is`);
    }
  }
  ftp.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

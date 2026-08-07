import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Client as FtpClient } from "basic-ftp";
import SftpClient from "ssh2-sftp-client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "out");

dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, ".env") });

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const clean = args.has("--clean");

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} in website/.env.local — see deploy_changes.md`);
  }
  return value;
}

function normalizeRemoteDir(dir) {
  const trimmed = dir.replace(/\\/g, "/").replace(/\/+$/, "");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full));
    else results.push(full);
  }
  return results;
}

function build() {
  console.log("Building static export...");
  const result = spawnSync("npm", ["run", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error("Build failed — deploy aborted");
  }
  if (!fs.existsSync(outDir)) {
    throw new Error("Build succeeded but website/out/ is missing");
  }
}

async function deploySftp({ host, port, user, password, remoteDir }) {
  const sftp = new SftpClient();
  console.log(`Connecting via SFTP to ${host}:${port}...`);
  await sftp.connect({
    host,
    port,
    username: user,
    password,
    readyTimeout: 20000,
  });

  try {
    const exists = await sftp.exists(remoteDir);
    if (!exists) {
      console.log(`Creating remote directory ${remoteDir}`);
      await sftp.mkdir(remoteDir, true);
    }

    if (clean) {
      console.log(`Cleaning remote directory ${remoteDir}...`);
      const listing = await sftp.list(remoteDir);
      for (const item of listing) {
        const target = `${remoteDir}/${item.name}`;
        if (item.type === "d") await sftp.rmdir(target, true);
        else await sftp.delete(target);
      }
    }

    console.log(`Uploading ${outDir} -> ${remoteDir}`);
    await sftp.uploadDir(outDir, remoteDir);
  } finally {
    await sftp.end();
  }
}

async function deployFtp({ host, port, user, password, remoteDir }) {
  const ftp = new FtpClient();
  ftp.ftp.verbose = false;
  console.log(`Connecting via FTP to ${host}:${port}...`);
  await ftp.access({
    host,
    port,
    user,
    password,
    secure: false,
  });

  try {
    await ftp.ensureDir(remoteDir);
    if (clean) {
      console.log(`Cleaning remote directory ${remoteDir}...`);
      await ftp.clearWorkingDir();
    }
    console.log(`Uploading ${outDir} -> ${remoteDir}`);
    await ftp.uploadFromDir(outDir);
  } finally {
    ftp.close();
  }
}

async function main() {
  const host = required("AFRIHOST_HOST");
  const user = required("AFRIHOST_USER");
  const password = required("AFRIHOST_PASSWORD");
  const protocol = (process.env.AFRIHOST_PROTOCOL || "sftp").toLowerCase();
  const port = Number(process.env.AFRIHOST_PORT || (protocol === "ftp" ? 21 : 22));
  const remoteDir = normalizeRemoteDir(required("AFRIHOST_REMOTE_DIR"));

  build();

  const files = walkFiles(outDir);
  console.log(`Prepared ${files.length} files from out/`);
  console.log(`Target: ${protocol.toUpperCase()} ${user}@${host}:${port}${remoteDir}`);

  if (dryRun) {
    console.log("Dry run only — no files uploaded.");
    for (const file of files.slice(0, 20)) {
      console.log(`  ${path.relative(outDir, file)}`);
    }
    if (files.length > 20) console.log(`  ...and ${files.length - 20} more`);
    return;
  }

  if (protocol === "sftp") {
    await deploySftp({ host, port, user, password, remoteDir });
  } else if (protocol === "ftp") {
    await deployFtp({ host, port, user, password, remoteDir });
  } else {
    throw new Error(`Unsupported AFRIHOST_PROTOCOL="${protocol}" (use sftp or ftp)`);
  }

  console.log("Deploy complete.");
}

main().catch((error) => {
  console.error(`\nDeploy failed: ${error.message}`);
  process.exit(1);
});

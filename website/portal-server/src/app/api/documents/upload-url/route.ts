import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { createUploadUrl } from "@/lib/storage";

const allowedTypes = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const body = await request.json() as { filename?: string; contentType?: string; companyId?: string };
  if (!body.filename || !body.contentType || !body.companyId || !allowedTypes.has(body.contentType)) {
    return Response.json({ error: "Invalid document upload request." }, { status: 400 });
  }
  const safeName = body.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const blobName = `organisations/${session.user.id}/companies/${body.companyId}/${randomUUID()}-${safeName}`;
  const uploadUrl = await createUploadUrl(blobName, body.contentType);
  return Response.json({ uploadUrl, blobName, expiresInSeconds: 600 });
}

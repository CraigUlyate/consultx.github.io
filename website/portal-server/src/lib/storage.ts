import { DefaultAzureCredential } from "@azure/identity";
import { BlobSASPermissions, BlobServiceClient, generateBlobSASQueryParameters } from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT;
const container = process.env.AZURE_STORAGE_CONTAINER ?? "documents";

export async function createUploadUrl(blobName: string, contentType: string) {
  if (!account) throw new Error("AZURE_STORAGE_ACCOUNT is not configured.");
  const service = new BlobServiceClient(`https://${account}.blob.core.windows.net`, new DefaultAzureCredential());
  const startsOn = new Date(Date.now() - 60_000);
  const expiresOn = new Date(Date.now() + 10 * 60_000);
  const delegationKey = await service.getUserDelegationKey(startsOn, expiresOn);
  const sas = generateBlobSASQueryParameters({
    containerName: container,
    blobName,
    permissions: BlobSASPermissions.parse("cw"),
    startsOn,
    expiresOn,
    contentType,
  }, delegationKey, account).toString();
  return `https://${account}.blob.core.windows.net/${container}/${blobName}?${sas}`;
}

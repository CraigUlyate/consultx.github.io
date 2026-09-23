import { auth, signIn, signOut } from "@/auth";
import { createWorkspaceCompany, ensurePortalUser, listWorkspaceCompanies } from "@/lib/workspace";
import { revalidatePath } from "next/cache";

export default async function PortalHome() {
  const session = await auth();

  if (!session?.user?.id) {
    return <main><h1>ConsultX Client Portal</h1><p>Secure annual-return workflow.</p><form action={async () => { "use server"; await signIn("microsoft-entra-id", { redirectTo: "/" }); }}><button type="submit">Sign in securely</button></form></main>;
  }

  const entraSubject = session.user.id;
  await ensurePortalUser({
    entraSubject,
    email: session.user.email ?? "unknown@consultx.local",
    displayName: session.user.name ?? "ConsultX user",
  });
  const companies = await listWorkspaceCompanies(entraSubject);
  async function addCompany(formData: FormData) {
    "use server";
    await createWorkspaceCompany(entraSubject, Object.fromEntries(formData));
    revalidatePath("/");
  }
  return <main><header><h1>ConsultX Client Portal</h1><p>Signed in as {session.user.email}</p><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button type="submit">Sign out</button></form></header><section><h2>Your companies</h2>{companies.length ? <ul>{companies.map((company) => <li key={company.id}><strong>{company.registeredName}</strong> · {company.registrationNumber}</li>)}</ul> : <p>No companies have been assigned to your account yet.</p>}</section><section><h2>Add a company</h2><form action={addCompany}><label>Registered name<input name="registeredName" required /></label><label>Registration number<input name="registrationNumber" required /></label><label>Entity type<select name="entityType" defaultValue="company"><option value="company">Company</option><option value="close_corporation">Close corporation</option></select></label><label>Financial year-end month<input name="financialYearEndMonth" type="number" min="1" max="12" required /></label><label>Primary contact email<input name="primaryContactEmail" type="email" required /></label><button type="submit">Add company</button></form></section></main>;
}

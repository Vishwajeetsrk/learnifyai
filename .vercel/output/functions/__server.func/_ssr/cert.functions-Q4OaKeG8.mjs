import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const emailCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  code: stringType().min(4).max(64).regex(/^[A-Za-z0-9-]+$/),
  to: stringType().email().max(254)
}).parse(d)).handler(createSsrRpc("afdf7f4e89351c40abdc7faeec59a2afe24db5dbdf17bc8d2ca638aa04e73aae"));
const adminEmailCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  certificateId: stringType().uuid(),
  to: stringType().email().max(254).optional(),
  idempotencyKey: stringType().min(8).max(128).regex(/^[A-Za-z0-9:_-]+$/).optional()
}).parse(d)).handler(createSsrRpc("601c59f1d3b91e129f466dadc80c22dad8300800318af8ea507e69648fe75805"));
const retryPendingCertificateEmails = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("504e67b3aad4cab0e2cfb54e1fcade68aadaf5924df935bd335cf29d093733bd"));
export {
  adminEmailCertificate as a,
  emailCertificate as e,
  retryPendingCertificateEmails as r
};

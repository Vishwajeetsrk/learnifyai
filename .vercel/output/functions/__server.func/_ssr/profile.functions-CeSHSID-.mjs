import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const getPublicProfile = createServerFn({
  method: "GET"
}).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("4bf0d871c1b1448bf83ecae994053dfefc9592abecd0f940b98c0f46242944f0"));
const getCreatorAnalytics = createServerFn({
  method: "GET"
}).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("f8700f9e1b3b1cba227af402b2df3b2e160cb4c5202990d7b89fb6f97b418ac6"));
export {
  getCreatorAnalytics as a,
  getPublicProfile as g
};

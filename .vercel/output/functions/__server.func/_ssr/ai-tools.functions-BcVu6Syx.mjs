import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { d as discriminatedUnionType, o as objectType, e as enumType, n as numberType, s as stringType, l as literalType } from "../_libs/zod.mjs";
const QuizInput = objectType({
  action: literalType("quiz"),
  topic: stringType().min(2).max(500),
  count: numberType().int().min(1).max(20).default(5),
  difficulty: enumType(["easy", "medium", "hard"]).default("medium")
});
const DoubtInput = objectType({
  action: literalType("doubt"),
  question: stringType().min(2).max(4e3),
  subject: stringType().max(200).optional()
});
const CareerInput = objectType({
  action: literalType("career"),
  goal: stringType().min(2).max(1e3),
  background: stringType().max(2e3).optional(),
  years: numberType().min(0).max(40).default(0)
});
const ReminderInput = objectType({
  action: literalType("reminder"),
  task: stringType().min(2).max(500),
  when: stringType().min(1).max(200),
  goal: stringType().max(500).optional()
});
const SynthInput = objectType({
  action: literalType("synth"),
  notes: stringType().min(10).max(2e4)
});
const FlashInput = objectType({
  action: literalType("flashcards"),
  topic: stringType().min(2).max(500),
  count: numberType().int().min(3).max(30).default(10)
});
const Input = discriminatedUnionType("action", [QuizInput, DoubtInput, CareerInput, ReminderInput, SynthInput, FlashInput]);
const runAiTool = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("33af551c8f8394d9f57af892e3af12cb6f428728b849520f0b91d27807f95f0e"));
export {
  runAiTool as r
};

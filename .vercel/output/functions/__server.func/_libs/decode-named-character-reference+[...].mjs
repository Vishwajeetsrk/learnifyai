import { c as characterEntities } from "./character-entities.mjs";
const own = {}.hasOwnProperty;
function decodeNamedCharacterReference(value) {
  return own.call(characterEntities, value) ? characterEntities[value] : false;
}
export {
  decodeNamedCharacterReference as d
};

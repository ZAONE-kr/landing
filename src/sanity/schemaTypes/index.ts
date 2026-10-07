import { zaoneLabFieldTagsType } from "./zaoneLabFieldTags";

export const schemaTypes = [zaoneLabFieldTagsType];

// 문서가 하나뿐인 종류. 새로 만들기·삭제·복제를 막는다(sanity.config.ts).
export const SINGLETON_TYPES = new Set<string>([zaoneLabFieldTagsType.name]);

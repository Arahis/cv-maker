import { atom } from "jotai";
import { Avatar } from "../types";

export const avatarOriginalAtom = atom<Avatar | null>(null);
export const avatarCroppedAtom = atom<Avatar | null>(null);

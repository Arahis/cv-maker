import { atom } from "jotai";
import { Avatar } from "../types";

export const avatarCroppedAtom = atom<Avatar | null>(null);

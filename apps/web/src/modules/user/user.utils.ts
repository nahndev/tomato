import type { User } from "./user.types";


type UserName = Pick<User, "name" | "familyName">;

export const getUserFullName = ({ name, familyName }: UserName) =>
  [name, familyName].filter(Boolean).join(" ");

export const getUserInitials = ({ name, familyName }: UserName) =>
  [name, familyName].map((part) => part?.charAt(0).toUpperCase()).join("");

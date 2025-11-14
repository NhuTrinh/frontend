import { api } from "./api";

function stripStatus(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const { status, ...rest } = obj;
  return rest;
}

export async function getMyProfile() {
  const res = await api.get("/candidates/profile-cv");
  return stripStatus(res.data);
}

export async function updateMyProfile(payload) {
  const res = await api.put("/candidates/profile-cv", payload);
  return stripStatus(res.data);
}


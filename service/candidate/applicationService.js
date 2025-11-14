import { api } from "./api";

// Đơn ứng tuyển của TÔI (đã populate jobId + companyId)
export async function getMyApplications() {
  const res = await api.get("/applications");
  return res.data?.applications ?? res.data?.data ?? res.data ?? [];
}

// Nộp đơn cho job (server lấy candidate từ token)
export async function applyMyselfToJob(jobId, payload = {}) {
  const res = await api.post(`/jobs/${jobId}/applications`, payload);
  return res.data?.application ?? res.data?.data ?? res.data;
}

// Hủy đơn theo id
export async function cancelApplicationById(applicationId) {
  const res = await api.delete(`/applications/${applicationId}`);
  return res.data ?? { ok: true };
}

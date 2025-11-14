import { api } from "./api";

/** Danh sách công việc: GET /api/v1/jobs
 * Backend trả: { status: "success", jobs: [...] }
 */
export async function getJobs(params = {}) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
  const res = await api.get("/jobs", { params: queryParams });
  return res.data?.jobs ?? res.data?.data ?? res.data ?? [];
}

/** Chi tiết công việc: GET /api/v1/jobs/:id
 * Nhiều backend trả: { status: "success", job: {...} }
 */
export async function getJobById(id) {
  const res = await api.get(`/jobs/${id}`);
  return res.data?.job ?? res.data?.data ?? res.data;
}

import { api } from "./client.js";

export const authApi = {
  login: async (payload) => (await api.post("/auth/login", payload)).data,
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  me: async () => (await api.get("/auth/me")).data
};

export const profileApi = {
  get: async () => (await api.get("/profile")).data,
  history: async () => (await api.get("/profile/history")).data,
  uploadResume: async (file) => {
    const form = new FormData();
    form.append("resume", file);
    return (await api.post("/profile/upload-resume", form, { headers: { "Content-Type": "multipart/form-data" } })).data;
  },
  updatePreferences: async (payload) => (await api.patch("/profile/preferences", payload)).data
};

export const internshipApi = {
  list: async () => (await api.get("/internships")).data,
  sync: async () => (await api.post("/internships/sync")).data
};

export const matchApi = {
  list: async () => (await api.get("/matches")).data,
  generate: async () => (await api.post("/matches/generate")).data
};

export const skillGapApi = {
  get: async (id) => (await api.get(`/skill-gaps/${id}`)).data
};

export const materialApi = {
  list: async () => (await api.get("/application-materials")).data,
  generate: async (internshipId) => (await api.post("/application-materials/generate", { internshipId })).data,
  approve: async (resumeVersionId) => (await api.post("/application-materials/approve", { resumeVersionId })).data,
  downloadPdf: async (id) => (await api.get(`/application-materials/${id}/pdf`, { responseType: "blob" })).data,
  openPdf: async (id) => {
    const blob = await materialApi.downloadPdf(id);
    window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
  }
};

export const applicationApi = {
  create: async (payload) => (await api.post("/applications", payload)).data,
  list: async () => (await api.get("/applications")).data,
  update: async ({ id, ...payload }) => (await api.patch(`/applications/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/applications/${id}`)).data
};

export const notificationApi = {
  list: async () => (await api.get("/notifications")).data,
  markRead: async (id) => (await api.patch(`/notifications/${id}/read`)).data
};

export const analyticsApi = {
  get: async () => (await api.get("/analytics")).data
};

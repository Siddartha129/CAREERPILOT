import { dbState } from "../config/db.js";
import { User, Profile, Internship, Match, ResumeVersion, ResumeHistory, Application, Notification } from "../models/index.js";
import { memoryStore } from "./memoryStore.js";

const models = { users: User, profiles: Profile, internships: Internship, matches: Match, resumeVersions: ResumeVersion, resumeHistory: ResumeHistory, applications: Application, notifications: Notification };

export const repo = {
  async getAll(coll, filter = {}, sort = {}) {
    if (dbState.mode === "memory") return memoryStore.getAll(coll, filter, sort);
    return models[coll].find(filter).sort(sort).lean();
  },
  async getById(coll, id) {
    if (dbState.mode === "memory") return memoryStore.getById(coll, id);
    return models[coll].findById(id).lean();
  },
  async getOne(coll, filter = {}) {
    if (dbState.mode === "memory") return memoryStore.getOne(coll, filter);
    return models[coll].findOne(filter).lean();
  },
  async create(coll, data) {
    if (dbState.mode === "memory") return memoryStore.create(coll, data);
    return (await models[coll].create(data)).toObject();
  },
  async updateById(coll, id, data) {
    if (dbState.mode === "memory") return memoryStore.updateById(coll, id, data);
    return models[coll].findByIdAndUpdate(id, data, { new: true }).lean();
  },
  async upsert(coll, filter, createData, updateData) {
    if (dbState.mode === "memory") return memoryStore.upsert(coll, filter, createData, updateData);
    return models[coll].findOneAndUpdate(filter, { $set: updateData, $setOnInsert: createData }, { upsert: true, new: true }).lean();
  },
  async deleteById(coll, id) {
    if (dbState.mode === "memory") return memoryStore.deleteById(coll, id);
    const result = await models[coll].findByIdAndDelete(id);
    return Boolean(result);
  },
  async deleteWhere(coll, filter = {}) {
    if (dbState.mode === "memory") return memoryStore.deleteWhere(coll, filter);
    const result = await models[coll].deleteMany(filter);
    return result.deletedCount || 0;
  }
};

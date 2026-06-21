import { randomUUID } from "node:crypto";

const collections = {
  users: [],
  profiles: [],
  internships: [],
  matches: [],
  resumeVersions: [],
  resumeHistory: [],
  applications: [],
  notifications: []
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const now = () => new Date();

function matchesFilter(item, filter = {}) {
  return Object.entries(filter).every(([key, value]) => {
    if (value === undefined) return true;
    return String(item[key]) === String(value);
  });
}

function sortRows(rows, sort = {}) {
  const [[key, direction] = []] = Object.entries(sort);
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    const left = a[key] ? new Date(a[key]).getTime() || a[key] : "";
    const right = b[key] ? new Date(b[key]).getTime() || b[key] : "";
    return left > right ? direction : left < right ? -direction : 0;
  });
}

export const memoryStore = {
  collections,
  getAll(coll, filter = {}, sort = {}) {
    return clone(sortRows(collections[coll].filter((item) => matchesFilter(item, filter)), sort));
  },
  getById(coll, id) {
    return clone(collections[coll].find((item) => String(item._id) === String(id)) || null);
  },
  getOne(coll, filter = {}) {
    return clone(collections[coll].find((item) => matchesFilter(item, filter)) || null);
  },
  create(coll, data) {
    const item = { ...data, _id: randomUUID(), createdAt: now(), updatedAt: now() };
    collections[coll].push(item);
    return clone(item);
  },
  updateById(coll, id, data) {
    const index = collections[coll].findIndex((item) => String(item._id) === String(id));
    if (index === -1) return null;
    collections[coll][index] = { ...collections[coll][index], ...data, updatedAt: now() };
    return clone(collections[coll][index]);
  },
  upsert(coll, filter, createData, updateData) {
    const existing = collections[coll].find((item) => matchesFilter(item, filter));
    if (existing) {
      Object.assign(existing, updateData, { updatedAt: now() });
      return clone(existing);
    }
    return this.create(coll, { ...filter, ...createData, ...updateData });
  },
  deleteById(coll, id) {
    const before = collections[coll].length;
    collections[coll] = collections[coll].filter((item) => String(item._id) !== String(id));
    return before !== collections[coll].length;
  },
  deleteWhere(coll, filter = {}) {
    const before = collections[coll].length;
    collections[coll] = collections[coll].filter((item) => !matchesFilter(item, filter));
    return before - collections[coll].length;
  }
};

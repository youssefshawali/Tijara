/** Maps Prisma `id` to `_id` for admin UI compatibility */
export function withMongoId<T extends { id: string }>(
  record: T
): Omit<T, "id"> & { _id: string } {
  const { id, ...rest } = record;
  return { ...rest, _id: id };
}

export function withMongoIds<T extends { id: string }>(
  records: T[]
): (Omit<T, "id"> & { _id: string })[] {
  return records.map(withMongoId);
}

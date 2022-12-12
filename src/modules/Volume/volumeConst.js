export const FILE_PARTITION = {
  BALANCED: 1,
  PRIORITY: 2,
  THROUGHPUT: 3,
};

export const FILE_PARTITION_TRANS = {
  [FILE_PARTITION.BALANCED]: "Balanced",
  [FILE_PARTITION.PRIORITY]: "Priority",
  [FILE_PARTITION.THROUGHPUT]: "Throughput",
};

export const BACKUP = {
  RAID: 1,
  NONE: 2,
};

export const ENCRYPTION = {
  ON: 1,
  OFF: 2,
};

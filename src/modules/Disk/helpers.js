const BYTE_IN_GB = 1024 * 1024 * 1024

export const convertGbToByte = (gb) => Math.round(gb * BYTE_IN_GB)
export const convertByteToGb = (byte) => (byte / BYTE_IN_GB).toFixed(1)

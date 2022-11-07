import extensions from "src/modules/File/Extesion/extensions.js";
import icons from "src/modules/File/Extesion/icons.js";

export const getExtensionForFilename = (filename) => filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)

export const getIconForFileName = (fileName) => extensions[getExtensionForFilename(fileName).toLowerCase()] || icons.file

export const getIconForFile = (file) => {
  if (file.type === 1) return icons.folder
  return getIconForFileName(file.name)
}

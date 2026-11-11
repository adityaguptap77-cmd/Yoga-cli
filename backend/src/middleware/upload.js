const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../config');
const { randomToken } = require('../utils/helpers');

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

fs.mkdirSync(config.uploadDir, { recursive: true });

// Files are held in memory, validated, and only then written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1, fields: 60, fieldSize: 200 * 1024 },
});

/** Detect image type from magic bytes, ignoring whatever the browser claimed. */
function detectImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

/**
 * Validate and store an uploaded image from multer.
 * Returns { path } on success, { error } if invalid, or {} if no file was sent.
 */
function saveImage(file) {
  if (!file || !file.buffer || file.size === 0) return {};
  const type = detectImageType(file.buffer);
  if (!type) return { error: 'Please upload a JPG, PNG or WebP image.' };
  const name = `${randomToken(12)}.${type}`;
  fs.writeFileSync(path.join(config.uploadDir, name), file.buffer, { flag: 'wx' });
  return { path: `/uploads/${name}` };
}

/** Remove a previously uploaded file. Only touches files inside the uploads folder. */
function removeUpload(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const file = path.join(config.uploadDir, path.basename(publicPath));
  fs.promises.unlink(file).catch(() => {});
}

/** Single-file upload middleware that turns multer errors into friendly JSON errors. */
function uploadSingle(field) {
  const handler = upload.single(field);
  return (req, res, next) => {
    handler(req, res, (err) => {
      if (!err) return next();
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? `That image is larger than ${Math.round(MAX_BYTES / 1048576)} MB. Please use a smaller file.`
        : 'The upload failed. Please try again.';
      res.status(422).json({ ok: false, message });
    });
  };
}

module.exports = { upload, uploadSingle, saveImage, removeUpload, MAX_BYTES };

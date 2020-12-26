'use strict';

const path = require('path');
const processMultipart = require('./processMultipart');
const isEligibleRequest = require('./isEligibleRequest');
const { debugLog } = require('./utilities');

const DEFAULT_OPTIONS = {
  debug: false,
  uploadTimeout: 60000,
  fileHandler: false,
  uriDecodeFileNames: false,
  safeFileNames: false,
  preserveExtension: false,
  abortOnLimit: false,
  responseOnLimit: 'File size limit has been reached',
  limitHandler: false,
  createParentPath: false,
  parseNested: false,
  useTempFiles: false,
  tempFileDir: path.join(process.cwd(), 'tmp')
};

/**
 * Expose the file upload middleware
 * @param {Function} options - Middleware options, supplied on a per request basses
 * @returns {Function} - express-fileupload middleware.
 */
module.exports = (options) => {
  return (req, res, next) => {
    const uploadOptions = Object.assign(DEFAULT_OPTIONS, await options(req, res, next));

    if (!isEligibleRequest(req)) {
      debugLog(uploadOptions, 'Request is not eligible for file upload!');
      return next();
    }
    processMultipart(uploadOptions, req, res, next);
  };
};

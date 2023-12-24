import Common from '../lib/common.js';
import FileService from '../modules/files/service/file.service.js';

const fileService = new FileService();

const removeInactiveFiles = async () => {
  try {
    const sixMonthAgoDateTime = Common.addMonth(new Date(), -6);
    const uploadedFilesMoreThan6MonthAgo = await fileService.getFileInfo({
      created_at: sixMonthAgoDateTime,
    });
    if (
      uploadedFilesMoreThan6MonthAgo
      && uploadedFilesMoreThan6MonthAgo.length > 0
    ) {
      await Promise.all(
        // eslint-disable-next-line max-len
        uploadedFilesMoreThan6MonthAgo.map((file) => fileService.removeFile(file.privateKey, file.userId).catch(() => {})),
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export default removeInactiveFiles;

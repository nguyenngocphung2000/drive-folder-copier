function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Sao Chép Thư Mục Google Drive')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function extractIdFromUrl(url) {
  if (!url) return null;
  var idMatch = url.match(/[-\w]{25,}/);
  return idMatch ? idMatch[0] : null;
}

function logToSheet(sourceUrl) {
  return false;
}

function getFolderContentsInfo(id) {
  var isFolder = false;
  var isFile = false;
  var itemObj = null;

  // Bước 1: Thử lấy dữ liệu dưới dạng File để kiểm tra định dạng gốc (MimeType)
  try {
    var file = DriveApp.getFileById(id);
    var mimeType = file.getMimeType();
    
    // So sánh định dạng xem có đích thị là Thư mục hay không
    if (mimeType === MimeType.FOLDER || mimeType === 'application/vnd.google-apps.folder') {
      isFolder = true;
    } else {
      isFile = true;
      itemObj = file;
    }
  } catch (e) {
    // Nếu DriveApp.getFileById() ném lỗi, thì ID đó chắc chắn là Thư mục
    isFolder = true;
  }

  // Bước 2: Xử lý theo từng nhánh đã phân loại
  if (isFile) {
    return { 
      success: true, 
      isFile: true,
      files: [{ id: itemObj.getId(), name: itemObj.getName() }], 
      folders: [], 
      name: itemObj.getName() 
    };
  }

  if (isFolder) {
    try {
      var folder = DriveApp.getFolderById(id);
      var files = folder.getFiles();
      var folders = folder.getFolders();
      
      var fileList = [];
      while (files.hasNext()) {
        var f = files.next();
        fileList.push({ id: f.getId(), name: f.getName() });
      }
      
      var folderList = [];
      while (folders.hasNext()) {
        var subFolder = folders.next();
        folderList.push({ id: subFolder.getId(), name: subFolder.getName() });
      }
      
      return { success: true, isFile: false, files: fileList, folders: folderList, name: folder.getName() };
    } catch (err) {
      return { success: false, error: err.toString() };
    }
  }
}

function createTargetFolder(folderName, destParentId) {
  try {
    var parentFolder = destParentId ? DriveApp.getFolderById(destParentId) : DriveApp.getRootFolder();
    var newFolder = parentFolder.createFolder(folderName);
    return { success: true, id: newFolder.getId() };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function copyFilesBatch(batch) {
  var results = [];
  for (var i = 0; i < batch.length; i++) {
    try {
      var item = batch[i];
      var file = DriveApp.getFileById(item.fileId);
      var destFolder = item.targetFolderId ? DriveApp.getFolderById(item.targetFolderId) : DriveApp.getRootFolder();
      file.makeCopy(file.getName(), destFolder);
      results.push({ fileId: item.fileId, success: true });
    } catch (e) {
      results.push({ fileId: item.fileId, success: false, error: e.toString() });
    }
  }
  return { success: true, results: results };
}

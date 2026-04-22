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
  try {
    var folder = DriveApp.getFolderById(id);
    var files = folder.getFiles();
    var folders = folder.getFolders();
    
    var fileList = [];
    while (files.hasNext()) {
      var file = files.next();
      fileList.push({
        id: file.getId(),
        name: file.getName()
      });
    }
    
    var folderList = [];
    while (folders.hasNext()) {
      var subFolder = folders.next();
      folderList.push({
        id: subFolder.getId(),
        name: subFolder.getName()
      });
    }
    
    return { success: true, files: fileList, folders: folderList, name: folder.getName() };
  } catch (e) {
    try {
      var singleFile = DriveApp.getFileById(id);
      return { 
        success: true, 
        files: [{ id: singleFile.getId(), name: singleFile.getName() }], 
        folders: [], 
        name: singleFile.getName() 
      };
    } catch (err) {
      return { success: false, error: err.toString() };
    }
  }
}

function createTargetFolder(folderName, destParentId) {
  try {
    var parentFolder;
    if (destParentId) {
      parentFolder = DriveApp.getFolderById(destParentId);
    } else {
      parentFolder = DriveApp.getRootFolder();
    }
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
      var destFolder = DriveApp.getFolderById(item.targetFolderId);
      file.makeCopy(file.getName(), destFolder);
      results.push({ fileId: item.fileId, success: true });
    } catch (e) {
      results.push({ fileId: item.fileId, success: false, error: e.toString() });
    }
  }
  return { success: true, results: results };
}

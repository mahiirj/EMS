const { exec } = require('child_process');
const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs');

// Configuration
const dbName = 'Garment'; // Replace with your database name
const backupPath = path.join(__dirname, "./GS_backup"); // Directory to store backups

// Ensure the backup directory exists
if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
}

// Function to perform the backup
const backupDatabase = () => {
    const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
    const backupFile = path.join(backupPath, `${dbName}_backup_${timestamp}`);
    
    // Command to back up the database
    const command = `mongodump --db=${dbName} --out="${backupFile}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Backup stderr: ${stderr}`);
            return;
        }
        console.log(`Backup successful: ${stdout}`);
    });
};

// Schedule the backup to run daily at 11:00 PM
const job = schedule.scheduleJob('00 14 * * *', () => {
    backupDatabase();
});

console.log('Backup scheduler started...');

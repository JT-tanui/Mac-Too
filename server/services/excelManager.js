const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs').promises;
const { dbPromise } = require('../config/database');
require('dotenv').config();

class ExcelManager {
    constructor() {
        if (!process.env.EXCEL_PATH || !process.env.EXCEL_BACKUP_PATH) {
            throw new Error('Excel paths not configured in environment variables');
        }

        this.excelPath = path.join(__dirname, '..', process.env.EXCEL_PATH);
        this.backupPath = path.join(__dirname, '..', process.env.EXCEL_BACKUP_PATH);
        
        // Ensure directories exist
        this.initializePaths();
    }

    async initializePaths() {
        const dataDir = path.dirname(this.excelPath);
        await fs.mkdir(dataDir, { recursive: true });
        await fs.mkdir(this.backupPath, { recursive: true });
    }

    async updateExcel() {
        const workbook = new ExcelJS.Workbook();
        const db = await dbPromise;

        // Get all contacts
        const contacts = await db.all('SELECT * FROM contacts ORDER BY created_at DESC');

        // Create or load worksheet
        let worksheet = workbook.addWorksheet('Contacts');
        
        // Set headers
        worksheet.columns = [
            { header: 'Date', key: 'created_at' },
            { header: 'Name', key: 'name' },
            { header: 'Email', key: 'email' },
            { header: 'Company', key: 'company' },
            { header: 'Service', key: 'service' },
            { header: 'Message', key: 'message' },
            { header: 'Budget', key: 'budget' }
        ];

        // Add data
        worksheet.addRows(contacts);

        // Style worksheet
        await this.styleWorksheet(worksheet);

        // Create backup
        await this.createBackup();

        // Save updated file
        await workbook.xlsx.writeFile(this.excelPath);

        return this.excelPath;
    }

    // Style worksheet
    async styleWorksheet(worksheet) {
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach(column => {
            column.width = 20;
        });
        return worksheet;
    }

    async createBackup() {
        try {
            if (await fs.access(this.excelPath).catch(() => false)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupFile = path.join(this.backupPath, `contacts-${timestamp}.xlsx`);
                await fs.copyFile(this.excelPath, backupFile);
            }
        } catch (error) {
            console.error('Backup creation failed:', error);
        }
    }

    async getExcelBuffer() {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(this.excelPath);
        return await workbook.xlsx.writeBuffer();
    }

    // Process new contacts
    async processNewContacts() {
        try {
            const db = await dbPromise;
            const newContacts = await db.all(
                'SELECT * FROM contacts WHERE processed = 0'
            );

            if (newContacts.length > 0) {
                const excelPath = await this.updateExcel();
                const buffer = await this.getExcelBuffer();
                
                // Send email with updated Excel
                await this.sendExcelUpdate(buffer);
                
                // Mark contacts as processed
                await db.run(
                    'UPDATE contacts SET processed = 1 WHERE processed = 0'
                );

                // Cleanup old backups
                await this.cleanupOldBackups();
            }
        } catch (error) {
            console.error('Contact processing error:', error);
            throw error;
        }
    }

    // Cleanup old backups (keep last 5)
    async cleanupOldBackups() {
        try {
            const files = await fs.readdir(this.backupPath);
            const backups = files
                .filter(f => f.startsWith('contacts-'))
                .sort()
                .reverse();

            if (backups.length > 5) {
                for (const file of backups.slice(5)) {
                    await fs.unlink(path.join(this.backupPath, file));
                }
            }
        } catch (error) {
            console.error('Backup cleanup error:', error);
        }
    }

    // Send Excel update email
    async sendExcelUpdate(buffer) {
        const { sendEmails } = require('./emailService');
        await sendEmails({
            type: 'excel_update',
            attachments: [{
                filename: 'contacts.xlsx',
                content: buffer
            }]
        });
    }
}

module.exports = new ExcelManager();
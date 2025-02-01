const ExcelJS = require('exceljs');
const { dbPromise } = require('../config/database');
const { sendEmails } = require('./emailService');
const path = require('path');
const fs = require('fs').promises;
const googleDrive = require('./googleDrive');

class BatchProcessor {
    constructor() {
        this.batchSize = 5;
        this.tempDir = path.join(__dirname, '../temp');
    }

    async processContacts() {
        const db = await dbPromise;
        
        // Get all contacts
        const contacts = await db.all(`
            SELECT * FROM contacts 
            ORDER BY created_at DESC
        `);

        if (contacts.length > 0) {
            // Update Google Sheet
            await googleDrive.updateSpreadsheet(contacts);
            
            // Send notification email
            await sendEmails({
                type: 'admin_update',
                message: 'Contact sheet has been updated'
            });
        }
    }

    async generateExcel(contacts) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Contacts');
        
        worksheet.columns = [
            { header: 'Name', key: 'name' },
            { header: 'Email', key: 'email' },
            { header: 'Company', key: 'company' },
            { header: 'Service', key: 'service' },
            { header: 'Message', key: 'message' },
            { header: 'Date', key: 'created_at' }
        ];

        worksheet.addRows(contacts);

        const filePath = path.join(this.tempDir, `contacts_${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    async cleanup(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    async markAsProcessed(contacts) {
        const db = await dbPromise;
        const ids = contacts.map(c => c.id).join(',');
        await db.run(`
            UPDATE contacts 
            SET processed = 1 
            WHERE id IN (${ids})
        `);
    }
}

module.exports = new BatchProcessor();
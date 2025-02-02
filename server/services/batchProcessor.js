const ExcelJS = require('exceljs');
const { dbPromise } = require('../config/database');
const { sendEmails } = require('./emailService');
const path = require('path');
const fs = require('fs').promises;

class BatchProcessor {
    constructor() {
        this.batchSize = 5;
        this.tempDir = path.join(__dirname, '../temp');
    }

    async ensureTempDir() {
        try {
            await fs.access(this.tempDir);
        } catch {
            await fs.mkdir(this.tempDir, { recursive: true });
        }
    }

    async processContacts() {
        const db = await dbPromise;
        
        try {
            // Get all contacts
            const contacts = await db.all(`
                SELECT * FROM contacts 
                ORDER BY created_at DESC
            `);

            if (contacts.length === 0) {
                return { message: 'No contacts to process' };
            }

            // Generate Excel report
            const reportPath = await this.generateExcelReport(contacts);

            // Process emails in batches
            for (let i = 0; i < contacts.length; i += this.batchSize) {
                const batch = contacts.slice(i, i + this.batchSize);
                await sendEmails({
                    recipients: batch.map(c => c.email),
                    subject: 'Thank you for contacting us',
                    template: 'contact-followup',
                    data: { }
                });
            }

            return {
                message: 'Batch processing completed',
                processedCount: contacts.length,
                reportPath
            };
        } catch (error) {
            console.error('Batch processing error:', error);
            throw error;
        }
    }

    async generateExcelReport(data) {
        await this.ensureTempDir();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Contacts');

        // Add headers
        worksheet.columns = [
            { header: 'Name', key: 'name' },
            { header: 'Email', key: 'email' },
            { header: 'Message', key: 'message' },
            { header: 'Created At', key: 'created_at' }
        ];

        // Add rows
        worksheet.addRows(data);

        // Style the worksheet
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach(column => {
            column.width = 20;
        });

        const filename = `contacts_${new Date().toISOString().split('T')[0]}.xlsx`;
        const filepath = path.join(this.tempDir, filename);
        
        await workbook.xlsx.writeFile(filepath);
        return filepath;
    }

    async cleanup() {
        try {
            const files = await fs.readdir(this.tempDir);
            const deletePromises = files.map(file => 
                fs.unlink(path.join(this.tempDir, file))
            );
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}

module.exports = new BatchProcessor();
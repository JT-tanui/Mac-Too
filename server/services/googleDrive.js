const { google } = require('googleapis');
const credentials = require('../config/google-credentials.json');

class GoogleDriveService {
    constructor() {
        this.auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/drive.file']
        );
        this.drive = google.drive({ version: 'v3', auth: this.auth });
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    }

    async updateSpreadsheet(contacts) {
        try {
            const sheets = google.sheets({ version: 'v4', auth: this.auth });
            
            // Get all contacts data in formatted array
            const values = contacts.map(contact => [
                contact.name,
                contact.email,
                contact.company,
                contact.service,
                contact.message,
                contact.budget,
                contact.created_at
            ]);

            await sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Contacts!A:G',
                valueInputOption: 'RAW',
                resource: { values }
            });

            return true;
        } catch (error) {
            console.error('Google Sheets error:', error);
            throw error;
        }
    }
}

module.exports = new GoogleDriveService();
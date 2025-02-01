const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  const template = await fs.readFile(templatePath, 'utf-8');
  return handlebars.compile(template);
}

async function generateExcel(contactData) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Contact Details');
  
  worksheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Company', key: 'company' },
    { header: 'Service', key: 'service' },
    { header: 'Message', key: 'message' },
    { header: 'Date', key: 'date' }
  ];
  
  worksheet.addRow(contactData);
  
  const filePath = path.join(__dirname, '../temp', `contact_${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

async function sendEmails(contactData) {
  try {
    // Generate Excel file
    const excelFile = await generateExcel(contactData);

    // Send admin notification with Excel
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Message:</strong> ${contactData.message}</p>
      `,
      attachments: [{
        filename: 'contact_details.xlsx',
        path: excelFile
      }]
    });

    // Load and compile template
    const template = await loadTemplate('userConfirmation');
    const htmlContent = template(contactData);

    // Send user confirmation with template
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: 'Thank you for contacting Mac & Too Agency',
      html: htmlContent
    });

    // Delete Excel file
    await fs.unlink(excelFile);

  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

module.exports = { sendEmails };
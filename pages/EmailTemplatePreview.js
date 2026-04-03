import { useState } from 'react';

// Basic HTML sanitizer — strips script tags, event handlers, and dangerous elements
function sanitizeHTML(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/javascript\s*:/gi, 'blocked:');
}

const EmailTemplatePreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const loadTemplate = async (template) => {
    try {
      const response = await fetch(`/EmailTemplates/${template}`);
      const html = await response.text();
      setTemplateContent(html);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };
  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
    if (template) {
      loadTemplate(template);
    } else {
      setTemplateContent('');
    }
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <select
        value={selectedTemplate}
        onChange={handleTemplateChange}
        style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}
      >
        <option value="">Select a template</option>
        <option value="reciept_email.html">Receipt Email</option>
        <option value="welcome_email.html">Welcome Email</option>
        <option value="kyc_email.html">KYC Email</option>
      </select>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          background: '#fff',
          minHeight: '500px',
          overflow: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(templateContent) }}
      />
    </div>
  );
};

export default EmailTemplatePreview;

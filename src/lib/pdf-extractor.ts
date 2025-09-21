/**
 * PDF Text Extractor for Resume Scoring
 * Extracts text from uploaded PDF files using multiple methods
 */

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    console.log('📖 Starting PDF text extraction...');
    
    // Validate buffer
    if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
      throw new Error('Invalid or empty file buffer');
    }

    console.log(`📋 Processing ${fileBuffer.length} byte PDF buffer...`);

    // Check if it's actually a PDF by looking at the header
    const pdfHeader = fileBuffer.toString('ascii', 0, 4);
    if (pdfHeader !== '%PDF') {
      throw new Error('File is not a valid PDF document (missing PDF header)');
    }

    let extractedText = '';
    let parseSuccess = false;

    // Method 1: Try PDF.js with proper server configuration
    try {
      console.log('🔍 Using PDF.js for text extraction...');
      
      // Import pdfjs-dist - use the server-compatible version
      const pdfjsLib = await import('pdfjs-dist');
      
      // Load the PDF document
      const typedArray = new Uint8Array(fileBuffer);
      const loadingTask = pdfjsLib.getDocument({
        data: typedArray,
        useSystemFonts: true,
        disableFontFace: true,
        useWorkerFetch: false,
        isEvalSupported: false
      });
      
      const pdfDocument = await loadingTask.promise;
      console.log(`📄 PDF loaded successfully: ${pdfDocument.numPages} pages`);
      
      const textParts: string[] = [];
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        try {
          console.log(`📃 Extracting text from page ${pageNum}...`);
          
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Process text items with proper spacing
          const pageTextItems = textContent.items
            .filter((item: any) => item && item.str && typeof item.str === 'string')
            .map((item: any) => item.str.trim())
            .filter((text: string) => text.length > 0);
          
          if (pageTextItems.length > 0) {
            const pageText = pageTextItems.join(' ');
            textParts.push(pageText);
            console.log(`📝 Page ${pageNum}: extracted ${pageText.length} characters`);
          }
          
        } catch (pageError) {
          console.log(`⚠️ Error extracting from page ${pageNum}:`, pageError);
          continue;
        }
      }
      
      extractedText = textParts.join('\n\n').trim();
      
      if (extractedText.length > 50) {
        parseSuccess = true;
        console.log(`✅ PDF.js extraction successful: ${extractedText.length} characters`);
        console.log(`📝 First 200 chars: "${extractedText.substring(0, 200)}..."`);
      } else {
        console.log('⚠️ PDF.js extracted insufficient text, trying alternative...');
      }
      
    } catch (pdfjsError) {
      console.log('⚠️ PDF.js extraction failed:', pdfjsError);
      console.log('🔄 Trying alternative method...');
    }

    // Method 2: Try pdf-parse as backup
    if (!parseSuccess) {
      try {
        console.log('🔄 Trying pdf-parse as backup...');
        const pdfParse = await import('pdf-parse');
        
        const data = await pdfParse.default(fileBuffer);
        
        if (data && data.text && data.text.length > 50) {
          extractedText = data.text.trim();
          parseSuccess = true;
          console.log(`✅ pdf-parse extraction successful: ${extractedText.length} characters`);
          console.log(`📝 First 200 chars: "${extractedText.substring(0, 200)}..."`);
        } else {
          console.log('⚠️ pdf-parse extracted insufficient text');
        }
        
      } catch (pdfParseError) {
        console.log('⚠️ pdf-parse extraction failed:', pdfParseError);
      }
    }

    // Method 3: Try pdf-lib as backup 
    if (!parseSuccess) {
      try {
        console.log('🔄 Trying pdf-lib as backup...');
        const { PDFDocument } = await import('pdf-lib');
        
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const pages = pdfDoc.getPages();
        
        console.log(`📄 PDF-lib loaded ${pages.length} pages but cannot extract text directly`);
        
      } catch (pdfLibError) {
        console.log('⚠️ pdf-lib also failed:', pdfLibError);
      }
    }

    // Method 4: Basic binary text search as last resort
    if (!parseSuccess) {
      try {
        console.log('🔍 Trying basic binary text search...');
        
        const pdfString = fileBuffer.toString('latin1');
        
        // Look for text objects in PDF
        const textObjects = [];
        const textRegex = /\((.*?)\)/g;
        let match;
        
        while ((match = textRegex.exec(pdfString)) !== null) {
          const text = match[1];
          if (text && text.length > 2 && /[a-zA-Z]/.test(text)) {
            textObjects.push(text.trim());
          }
        }
        
        if (textObjects.length > 5) {
          extractedText = textObjects.join(' ').trim();
          console.log(`📝 Binary search found ${textObjects.length} text objects`);
          parseSuccess = true;
        }
        
      } catch (basicError) {
        console.log('⚠️ Basic binary search failed:', basicError);
      }
    }

    // Return results or throw error
    if (parseSuccess && extractedText.length > 10) {
      console.log(`🎉 REAL text extraction completed successfully!`);
      console.log(`📊 Extracted ${extractedText.length} characters from uploaded PDF`);
      console.log(`📋 Sample text: "${extractedText.substring(0, 150)}..."`);
      return extractedText;
    } else {
      console.error('❌ All extraction methods failed');
      throw new Error(
        'Unable to extract text from this PDF file. This could be because:\n\n' +
        '• The PDF contains only images or scanned content (requires OCR)\n' +
        '• The PDF is password protected or encrypted\n' +
        '• The PDF has an unusual format or structure\n\n' +
        'Please try:\n' +
        '• A different PDF file with selectable text\n' +
        '• Converting scanned PDFs to text-based format\n' +
        '• Ensuring the PDF is not password protected'
      );
    }

  } catch (error) {
    console.error('❌ PDF text extraction failed:', error);
    throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
import { Document, Page, PDFViewer } from '@react-pdf/renderer';

import React from 'react';

const PdfViewer = (pdfLink) => {

    return (<div>{pdfLink &&
        <PDFViewer width="100%" height="600">
            <Document file={pdfLink}>
                <Page pageNumber={1} />
            </Document>
        </PDFViewer>}
    </div>)
};

export default PdfViewer;
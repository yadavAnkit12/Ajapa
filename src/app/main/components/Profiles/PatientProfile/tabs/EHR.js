import { ListSubheader, Typography, IconButton, ImageListItem } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Print, ZoomIn, ZoomOut, GetApp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { patientAPIConfig } from 'src/app/main/API/apiConfig';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import print from "print-js";
import { useDispatch } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function PdfViewer({ pdfLink, onClose, type }) {

  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);

  const containerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function goToNextPage() {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handlePrint(e) {
    e.preventDefault();
    if (type === 'pdf') { // for pdf type document  
      print(pdfLink);
    }
    else { // for images type document 
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const windowWidth = 900; // Adjust the desired width
      const windowHeight = 600; // Adjust the desired height
      const left = (screenWidth - windowWidth) / 2;
      const top = (screenHeight - windowHeight) / 2;
      const printWindow = window.open('', '', `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
      printWindow.document.open();
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write('<style type="text/css">');
      // printWindow.document.write('@media print {');
      printWindow.document.write('  body { margin: 0; padding: 0; text-align: center; }'); // Center the image
      printWindow.document.write('  img { max-width: 100%; max-height: 100%; }'); // Limit image size
      printWindow.document.write('}');
      printWindow.document.write('</style>');
      printWindow.document.write('<img id="print-image" alt="Image to Print" />');
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Load the image and set it as the source for the img element.
      const img = printWindow.document.getElementById('print-image');
      img.onload = function () {
        printWindow.print();
        printWindow.close();
      };
      img.src = pdfLink;
    }

  }

  function handleZoomIn() {
    setZoom(zoom + 0.2);
  }

  function handleZoomOut() {
    if (zoom > 0.2) {
      setZoom(zoom - 0.2);
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const elementTop = _.get(containerRef, 'current.getBoundingClientRect') ? containerRef.current.getBoundingClientRect().top + scrollTop : null;
      const elementBottom = _.get(containerRef, 'current.getBoundingClientRect') ? containerRef.current.getBoundingClientRect().bottom + scrollTop : null;

    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onClose]);
  function handleDownload() {
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = 'document.pdf';
    link.click();
  }

  return (
    <div ref={containerRef} className="pdf-viewer-container">
      <div>
        <IconButton onClick={goToPreviousPage} disabled={currentPage <= 1}>
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={goToNextPage} disabled={currentPage >= numPages}>
          <KeyboardArrowRight />
        </IconButton>
        <IconButton onClick={handlePrint}>
          <Print />
        </IconButton>
        <IconButton onClick={handleZoomIn}>
          <ZoomIn />
        </IconButton>
        <IconButton onClick={handleZoomOut}>
          <ZoomOut />
        </IconButton>
        <IconButton onClick={handleDownload}>
          <GetApp />
        </IconButton>
      </div>
      <div className="flex flex-row justify-between w-full items-start" >
        <div style={{ width: '50%', height: '100%' }}>
          {type === 'pdf' ? (<Document file={pdfLink} onLoadSuccess={onDocumentLoadSuccess}>
            <Page key={`page_${currentPage}`} pageNumber={currentPage} scale={zoom} renderAnnotationLayer={false} renderTextLayer={false} />
          </Document>) : <img src={pdfLink} alt="Document" />}

        </div>
        <IconButton className="pdf-viewer-close-btn" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}

function EHR(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const [patientID, setPatientID] = useState(null);
  const [ehrData, setEhrData] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const [type, setType] = useState('')

  useEffect(() => {
    const { patientId } = routeParams;
    setPatientID(patientId);
  }, []);

  useEffect(() => {
    if (patientID) {
      axios.get(`${patientAPIConfig.patientEhr}/${patientID}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setEhrData(response.data.data);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [patientID]);

  const documentHandler = (report) => {
    if (report) {
      report.map((file) => {
        setPdfLink(file.report);
        setType(file.originalName.endsWith('.pdf') ? 'pdf' : 'image')
        setIsViewerOpen(true);
      })

    } else {
      dispatch(showMessage({ message: 'Document not uploaded' }));
    }
  }

  return (
    <motion.div className="w-full">
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <div className="mb-48">
            <ListSubheader className="flex items-center px-0 mb-24 bg-transparent">
              <Typography className="text-2xl font-semibold leading-tight"></Typography>
            </ListSubheader>

            <div className="overflow-hidden flex flex-wrap -m-8">
              {_.size(ehrData.patientEHR) > 0 && <div>
                <h1>Self EHR</h1>
                <div className="flex flex-col sm:flex-row items-center mt-20">
                  {ehrData.patientEHR.map((ehrRecord, idx) => (
                    <ImageListItem
                      component={motion.div}
                      variants={item}
                      className="rounded-16 shadow overflow-hidden mb-10 mr-10 cursor-pointer bg-white"
                      style={{ minWidth: '150px', height: '150px' }}
                      onClick={() => documentHandler(ehrRecord.report)}
                      key={idx}
                    >
                      <div className="flex flex-auto w-full items-center justify-center" style={{ height: "80%" }}>
                        <div style={{ position: "relative" }}>
                          <FuseSvgIcon className="text-grey opacity-75" style={{ height: "56px", width: "56px" }}>
                            heroicons-outline:document
                          </FuseSvgIcon>
                          <div className="absolute left-0 bottom-0 px-6 rounded text-12 font-semibold leading-20 text-white" style={{ background: "rgb(229, 57, 53)" }} >PDF</div>
                        </div>
                      </div>
                    </ImageListItem>
                  ))}
                </div>
              </div>}
              {_.size(ehrData.familyEHR) > 0 && <div>
                <h1>Family EHR</h1>
                <div className="flex flex-col sm:flex-row items-center mt-20">
                  {ehrData.familyEHR.map((ehrRecord, idx) => (
                    <ImageListItem
                      component={motion.div}
                      variants={item}
                      className="rounded-16 shadow overflow-hidden mb-10 mr-10 cursor-pointer bg-white"
                      style={{ minWidth: '150px', height: '150px' }}
                      onClick={() => documentHandler(ehrRecord.report)}
                      key={idx}
                    >
                      <div className="flex flex-auto w-full items-center justify-center" style={{ height: "80%" }}>
                        <div style={{ position: "relative" }}>
                          <FuseSvgIcon className="text-grey opacity-75" style={{ height: "56px", width: "56px" }}>
                            heroicons-outline:document
                          </FuseSvgIcon>
                          <div className="absolute left-0 bottom-0 px-6 rounded text-12 font-semibold leading-20 text-white" style={{ background: "rgb(229, 57, 53)" }} >PDF</div>
                        </div>
                      </div>
                    </ImageListItem>
                  ))}
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>

      {isViewerOpen && (
        <PdfViewer pdfLink={pdfLink} type={type} onClose={() => setIsViewerOpen(false)} />
      )}
    </motion.div>
  );
}

export default EHR;  
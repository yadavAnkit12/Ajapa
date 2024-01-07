import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Print, ZoomIn, ZoomOut, GetApp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import print from "print-js";
import { useDispatch } from 'react-redux';
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from '@fuse/core/FuseLoading';

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function PdfViewer({ pdfLink, onClose }) {
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
    print(pdfLink);
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
          <Document file={pdfLink} onLoadSuccess={onDocumentLoadSuccess}>
            <Page key={`page_${currentPage}`} pageNumber={currentPage} scale={zoom} renderAnnotationLayer={false} renderTextLayer={false}/>
          </Document>
        </div>
        <IconButton className="pdf-viewer-close-btn" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </div >
  );
}

function DoctorDocument(props) {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);

  const documentTypes = [{
    type: 'licenseDocument',
    title: 'License Document'
  }, {
    type: 'certificateDocument',
    title: 'Certificate Document'
  }];

  useEffect(() => {
    if (props.doctorData) {
      setData(props.doctorData)
    }
  }, [props.doctorData]);

  if (!data) {
    return <FuseLoading/>;
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const documentHandler = (type) => {
    if (data[type]) {
      setPdfLink(data[type]);
      setIsViewerOpen(true);
    } else {
      dispatch(showMessage({ message: 'Document not uploaded' }));
    }
  }

  const getTitle = (url) => {
    if (url) {
      const documentArray = url.split('/');
      return documentArray[documentArray.length - 1];
    }
    return '';
  }
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full">
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">

          <div className="mb-48">
            <div className="flex flex-wrap -m-8 lg:w-full sm:w-1/2 md:w-1/4 p-8">
              {documentTypes.map((document, idx) => (
                <div className="flex flex-col sm:flex-row items-center" key={idx} >
                  <ImageListItem
                    component={motion.div}
                    variants={item}
                    className="rounded-16 shadow overflow-hidden mb-10 mx-10 cursor-pointer bg-white"
                    style={{ minWidth: '150px', height: '150px' }}
                    onClick={() => documentHandler(document.type)}
                  >
                    <div className="flex flex-auto w-full items-center justify-center" style={{ height: "80%" }}>
                      <div style={{ position: "relative" }}>
                        <FuseSvgIcon className="text-grey opacity-75" style={{ height: "56px", width: "56px" }}>
                          heroicons-outline:document
                        </FuseSvgIcon>
                        <div className="absolute left-0 bottom-0 px-6 rounded text-12 font-semibold leading-20 text-white" style={{ background: "rgb(229, 57, 53)" }} >PDF</div>
                      </div>
                    </div>
                    <ImageListItemBar
                      style={{ height: "20%", fontSize: "12px" }}
                      title={document.title}
                    />
                  </ImageListItem>
                  <div className="w-full" style={{ color: "Blue" }}>
                    {getTitle(data[document.type])}
                  </div>
                </div>)
              )}
            </div>

          </div>

        </div>
      </div>
      {isViewerOpen && (
        <PdfViewer pdfLink={pdfLink} onClose={() => setIsViewerOpen(false)} />
      )}
    </motion.div>
  );
}

export default DoctorDocument;

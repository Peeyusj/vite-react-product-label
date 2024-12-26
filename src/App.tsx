/* eslint-disable */
import React, { useRef } from "react";
import html2canvas from "html2canvas";

interface AppProps {
  productTitle: string; // Define the type for the productTitle prop
}

const App: React.FC<AppProps> = ({ productTitle }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null); // Properly type the ref to point to a div element

  const onClick = async () => {
    const options = {
      scale: 4, // High-quality capture
    };

    const element = wrapperRef.current;

    if (!element) {
      console.error("Wrapper element not found!");
      return;
    }

    try {
      // Generate a canvas from the wrapper content
      const canvas = await html2canvas(element, options);
      const imgDataUrl = canvas.toDataURL("image/jpeg", 1.0); // Convert to JPEG image

      // Create an iframe for printing
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.top = "-10000px"; // Move it off-screen
      iframe.style.visibility = "hidden"; // Hide the iframe
      document.body.appendChild(iframe);

      const printStyles = `
        @page {
          size: auto;
          margin: 0;
        }
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
        }
      `;

      // Create HTML layout for the labels
      const labelLayout = `
        <html>
          <head>
            <style>
              ${printStyles}
              .label-row {
                display: flex;
                flex-wrap: nowrap;
                gap: 2mm; /* Adjust for roll spacing if necessary */
                justify-content: center;
              }
              .label {
                width: 25mm;
                height: 15mm;
              }
            </style>
          </head>
          <body>
            <div class="label-row">
              <img class="label" src="${imgDataUrl}" />
              <img class="label" src="${imgDataUrl}" />
              <img class="label" src="${imgDataUrl}" />
              <img class="label" src="${imgDataUrl}" />
            </div>
          </body>
        </html>
      `;

      // Write content to the iframe
      const iframeDoc = iframe.contentWindow || iframe.contentDocument;
      if (!iframeDoc) {
        console.error("Could not get iframe document!");
        return;
      }
      // @ts-ignore
      const printDocument = iframeDoc.document || iframeDoc;
      printDocument.open();
      printDocument.write(labelLayout);
      printDocument.close();

      // Wait for iframe content to load, then print
      const onLoadHandler = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (error) {
          console.error("Error occurred while printing:", error);
        } finally {
          // Clean up iframe after printing
          document.body.removeChild(iframe);
        }
      };

      // Ensure the iframe is loaded before triggering print
      iframe.onload = onLoadHandler;

      // For some browsers, we might need to call `onLoadHandler` manually
      if (
        iframe.contentWindow &&
        iframe.contentDocument?.readyState === "complete"
      ) {
        onLoadHandler();
      }
    } catch (error) {
      console.error("Error generating labels for printing:", error);
    }
  };

  return (
    <div className="App">
      <h1>Label Printer</h1>
      <div
        ref={wrapperRef}
        style={{
          width: "25mm",
          height: "15mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #000",
          boxSizing: "border-box",
          padding: "2mm",
          fontSize: "8px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {productTitle}
      </div>
      <button
        onClick={onClick}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Print Labels
      </button>
    </div>
  );
};

export default App;

// import React, { useRef } from "react";
// import html2canvas from "html2canvas";

// const LabelPrinter = () => {
//   const wrapperRef = useRef();

//   const onClick = async () => {
//     const options = {
//       scale: 4, // High-quality capture
//     };

//     const element = wrapperRef.current;

//     if (!element) {
//       console.error("Wrapper element not found!");
//       return;
//     }

//     try {
//       // Generate a canvas from the wrapper content
//       const canvas = await html2canvas(element, options);
//       const imgDataUrl = canvas.toDataURL("image/jpeg", 1.0); // Convert to JPEG image

//       // Create an iframe for printing
//       const iframe = document.createElement("iframe");
//       iframe.style.position = "absolute";
//       iframe.style.top = "-10000px"; // Move it off-screen
//       iframe.style.visibility = "hidden"; // Hide the iframe
//       document.body.appendChild(iframe);

//       const printStyles = `
//         @page {
//           size: auto;
//           margin: 0;
//         }
//         body, html {
//           margin: 0;
//           padding: 0;
//           width: 100%;
//         }
//       `;

//       // Create HTML layout for the labels
//       const labelLayout = `
//         <html>
//           <head>
//             <style>
//               ${printStyles}
//               .label-row {
//                 display: flex;
//                 flex-wrap: nowrap;
//                 gap: 2mm; /* Adjust for roll spacing if necessary */
//                 justify-content: center;
//               }
//               .label {
//                 width: 25mm;
//                 height: 15mm;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 font-size: 10px;
//                 font-weight: bold;
//                 border: 1px solid #000; /* Add border for visibility */
//                 text-align: center;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="label-row">
//               <div class="label">Product-1</div>
//               <div class="label">Product-2</div>
//               <div class="label">Product-3</div>
//               <div class="label">Product-4</div>
//             </div>
//           </body>
//         </html>
//       `;

//       // Write content to the iframe
//       const iframeDoc = iframe.contentWindow || iframe.contentDocument;
//       const printDocument = iframeDoc.document || iframeDoc;
//       printDocument.open();
//       printDocument.write(labelLayout);
//       printDocument.close();

//       // Wait for iframe content to load, then print
//       const onLoadHandler = () => {
//         try {
//           iframe.contentWindow.focus();
//           iframe.contentWindow.print();
//         } catch (error) {
//           console.error("Error occurred while printing:", error);
//         } finally {
//           // Clean up iframe after printing
//           document.body.removeChild(iframe);
//         }
//       };

//       // Ensure the iframe is loaded before triggering print
//       iframe.onload = onLoadHandler;

//       // For some browsers, we might need to call `onLoadHandler` manually
//       if (iframe.contentWindow && iframe.contentDocument.readyState === "complete") {
//         onLoadHandler();
//       }
//     } catch (error) {
//       console.error("Error generating labels for printing:", error);
//     }
//   };

//   return (
//     <div className="App">
//       {/* Visible wrapper preview */}
//       <div
//         ref={wrapperRef}
//         style={{
//           width: "80mm", // Show 4 labels side by side in preview (4x25mm with gaps)
//           height: "15mm",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: "2mm",
//           border: "none",
//           padding: "10px",
//           boxSizing: "border-box",
//           background: "#f9f9f9",
//         }}
//       >
//         {/* Preview labels */}
//         <div
//           style={{
//             width: "25mm",
//             height: "15mm",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "10px",
//             fontWeight: "bold",
//             border: "1px solid #000", // Add border to mimic label
//           }}
//         >
//           Product-1
//         </div>
//         <div
//           style={{
//             width: "25mm",
//             height: "15mm",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "10px",
//             fontWeight: "bold",
//             border: "1px solid #000",
//           }}
//         >
//           Product-2
//         </div>
//         <div
//           style={{
//             width: "25mm",
//             height: "15mm",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "10px",
//             fontWeight: "bold",
//             border: "1px solid #000",
//           }}
//         >
//           Product-3
//         </div>
//         <div
//           style={{
//             width: "25mm",
//             height: "15mm",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "10px",
//             fontWeight: "bold",
//             border: "1px solid #000",
//           }}
//         >
//           Product-4
//         </div>
//       </div>
//       <button onClick={onClick} style={{ padding: "10px 20px", cursor: "pointer", marginTop: "10px" }}>
//         Print Labels
//       </button>
//     </div>
//   );
// };

// export default LabelPrinter;

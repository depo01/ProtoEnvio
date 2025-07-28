
export const generateConduceNumber = (requestId: string) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `CON-${date}-${requestId.split("-")[1]}`;
};

export const handlePrint = () => {
  window.print();
};

export const handleDownload = (conduceNumber: string) => {
  const conduceContent = document.getElementById("conduce-content");
  if (conduceContent) {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Conducé ${conduceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
              .package-item { border: 1px solid #ddd; padding: 10px; margin: 5px 0; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${conduceContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
};

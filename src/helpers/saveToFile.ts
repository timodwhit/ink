export function saveToFile(filename: string, text: string): void {
  // Create a blob with the text content
  const blob = new Blob([text], { type: "text/plain" });

  // Create a link element
  const link = document.createElement("a");

  // Set the link's href to a URL created from the blob
  link.href = URL.createObjectURL(blob);

  // Set the download attribute with the desired filename
  link.download = filename;

  // Append the link to the document
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}

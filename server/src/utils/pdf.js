function cleanText(value) {
  return String(value || "")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "?")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

function escapePdf(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLine(line, width = 95) {
  const words = line.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (!word) continue;
    if ((current + " " + word).trim().length > width) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  lines.push(current);
  return lines.length ? lines : [""];
}

export function textToPdf(text, options = {}) {
  const fontSize = options.fontSize || 10;
  const leading = options.leading || 14;
  const margin = 50;
  const width = 595.28;
  const height = 841.89;
  const lines = cleanText(text).split(/\r?\n/).flatMap((line) => wrapLine(line));
  const pages = [];
  for (let i = 0; i < lines.length; i += 48) pages.push(lines.slice(i, i + 48));
  if (!pages.length) pages.push([""]);

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  const kids = [];
  pages.forEach((pageLines, index) => {
    const contentObject = objects.length + 1;
    const pageObject = objects.length + 2;
    kids.push(`${pageObject} 0 R`);
    const body = [
      "BT",
      `/F1 ${fontSize} Tf`,
      `${margin} ${height - margin} Td`,
      `${leading} TL`,
      ...pageLines.map((line, lineIndex) => `${lineIndex ? "T* " : ""}(${escapePdf(line)}) Tj`),
      "ET"
    ].join("\n");
    objects.push(`<< /Length ${Buffer.byteLength(body, "latin1")} >>\nstream\n${body}\nendstream`);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObject} 0 R >>`);
  });

  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const startxref = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

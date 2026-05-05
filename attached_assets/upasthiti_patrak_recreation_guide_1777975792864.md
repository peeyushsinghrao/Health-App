# Upasthiti Patrak (Attendance Register) — PDF Recreation Guide

## Document Specifications

- **Page Size:** A4 Landscape — 841 × 595 pts (approximately 297mm × 210mm)
- **Page Orientation:** Landscape (width > height)
- **Margins:** ~15pt on all sides (tight margins to fit the wide table)
- **Font:** Devanagari-compatible Unicode font (e.g., Mangal, Noto Sans Devanagari, or any Hindi-capable font)
- **Language:** Hindi (Devanagari script)
- **Total Pages:** 1

---

## Layout Overview

The page contains:
1. A **title/header row** spanning full width (outside the main table)
2. A **single large table** spanning the full page width with complex merged headers and narrow date columns

---

## Section 1: Title Header (Above the Table)

- **Text:** `अवधि - 11 अप्रैल 2026 से 10 मई 2026 तक`
- **Position:** Top-left, inside the table's top-left merged cell (first cell of header row)
- **Font Size:** ~11–12pt, **Bold**
- **Alignment:** Left-aligned
- This text occupies a merged cell spanning the क्र.सं. and नाम कार्मिक मय पद columns, same row as the main month headers

---

## Section 2: Main Table Structure

### Overall Table Properties
- **Width:** Full page width (fills landscape A4 from margin to margin)
- **Border:** Thin solid black borders on all cells
- **Cell padding:** Minimal (~2pt)
- **Font size (general):** 7–8pt (very small, to fit 30+ date columns)
- **Text direction in date cells:** **Vertical (rotated 90° counterclockwise)** — text reads bottom-to-top

---

### Column Structure (left to right)

| # | Column Header (Hindi) | Approx Width | Notes |
|---|---|---|---|
| 1 | क्र.सं. | ~25pt | Serial number column |
| 2 | नाम कार्मिक मय पद | ~80pt | Name, designation column |
| 3–22 | Date columns 11–30 (April) | ~18pt each × 20 cols | Under "माह - अप्रैल 2026" |
| 23–32 | Date columns 1–10 (May) | ~18pt each × 10 cols | Under "माह - मई 2026" |
| 33 | उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग | ~45pt | Casual leaves in this period |
| 34 | पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग | ~45pt | Casual leaves till previous register |
| 35 | अब तक कुल लिए आकस्मिक अवकाश का योग | ~45pt | Total casual leaves so far |

**Total date columns: 30** (11 April to 10 May = 20 April dates + 10 May dates)

---

### Row Structure (top to bottom)

The table has **4 header rows** followed by **data rows**:

#### Header Row 1 (Merged cells):
| Columns spanned | Text | Merge type |
|---|---|---|
| क्र.सं. + नाम कार्मिक मय पद (cols 1–2) | `अवधि - 11 अप्रैल 2026 से 10 मई 2026 तक` | Rowspan=2 merged cell |
| All April date cols (cols 3–22) | `माह - अप्रैल 2026` | Colspan across 20 date columns, centered |
| All May date cols (cols 23–32) | `माह - मई 2026` | Colspan across 10 date columns, centered |
| Last 3 summary cols (cols 33–35) — each is separate | *(header text for each summary col — see below)* | Each spans 2 rows (rowspan=2) |

#### Header Row 2:
- क्र.सं. cell: `क्र.सं.` (label appears here or merged from above)
- नाम कार्मिक मय पद cell: `नाम कार्मिक मय पद` 
- Individual date numbers appear here: `11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30` then `1 2 3 4 5 6 7 8 9 10`
- Summary column headers (rowspanned from row 1):
  - Col 33: `उपस्थिति पत्रक अवधि में लिए गए आकस्मिक अवकाश का योग`
  - Col 34: `पूर्व उपस्थिति पत्रक तक लिए गए आकस्मिक अवकाश का योग`
  - Col 35: `अब तक कुल लिए आकस्मिक अवकाश का योग`

> **Note on summary column headers:** These are multi-line wrapped text in narrow-ish columns. Font size ~6–7pt. Text wraps vertically within cell. These cells are tall enough to display 3–4 lines of wrapped Hindi text.

---

### Date Column Headers — Text Direction

Each date number cell (11, 12, 13 ... 30, 1, 2 ... 10):
- Contains a **single number** (date)
- **Text is horizontal** in the header row
- Font size: ~8pt, bold, centered
- Column width: ~18pt (very narrow)

---

### Data Row(s)

#### Row 1 (example employee):
| Column | Value |
|---|---|
| क्र.सं. | `1` |
| नाम कार्मिक मय पद | `डॉ राम लाल, आयुर्वेद चिकित्सक` (two lines, name on top, designation below) |
| Date 11 (April) | `उपस्थित` — written **vertically** (rotated 90° CCW, bottom to top) |
| Date 12 | `उपस्थित` — vertical |
| Date 13 | `उपस्थित` — vertical |
| Date 14 | `उपस्थित` — vertical |
| Date 15 | `उपस्थित` — vertical |
| Date 16 | `उपस्थित` — vertical |
| Date 17 (Sunday/Off) | `Day Off` — vertical (in English) |
| Date 18 | `उपस्थित` — vertical |
| Date 19 | `उपस्थित` — vertical |
| Date 20 | `उपस्थित` — vertical |
| Date 21 | `उपस्थित` — vertical |
| Date 22 | `उपस्थित` — vertical |
| Date 23 | `उपस्थित` — vertical |
| Date 24 | `उपस्थित` — vertical |
| Date 25 | `उपस्थित` — vertical |
| Date 26 | `उपस्थित` — vertical |
| Date 27 | `उपस्थित` — vertical |
| Date 28 | `उपस्थित` — vertical |
| Date 29 | `उपस्थित` — vertical |
| Date 30 | `उपस्थित` — vertical |
| May 1 | `उपस्थित` — vertical |
| May 2 | `उपस्थित` — vertical |
| May 3 | `उपस्थित` — vertical |
| May 4 | `उपस्थित` — vertical |
| May 5 | `आकस्मिक अव.` — vertical (Casual Leave abbreviation) |
| May 6 | `उपस्थित` — vertical |
| May 7 | `उपस्थित` — vertical |
| May 8 | *(blank or उपस्थित — verify from source)* |
| May 9 | `उपस्थित` — vertical |
| May 10 | `उपस्थित` — vertical |
| उपस्थिति पत्रक अवधि में लिए गए... | `1` |
| पूर्व उपस्थिति पत्रक तक लिए गए... | `4` |
| अब तक कुल लिए... | `5` |

---

## Key Visual/Styling Details

### Text Rotation in Date Cells
- All attendance entries (उपस्थित, Day Off, आकस्मिक अव., etc.) in the date columns are **rotated 90° counterclockwise**
- The text reads from **bottom to top** when the page is in landscape orientation
- This is critical — without rotation the narrow columns cannot fit the text
- Cell height for data rows: ~55–60pt (tall enough to fit rotated text ~7–8 chars long)

### Font Sizes
| Element | Approx Size |
|---|---|
| Title in header | 11–12pt, Bold |
| Month group header (माह - अप्रैल 2026) | 9–10pt, Bold |
| Column sub-headers (क्र.सं., नाम...) | 8pt, Bold |
| Date numbers (11, 12...) | 8pt, Bold |
| Summary column header text | 6–7pt, Bold, wrapped |
| Employee name | 8pt |
| Attendance entries (rotated) | 7pt |
| Summary values (1, 4, 5) | 9–10pt, centered |

### Cell Alignment
- क्र.सं. column: center-aligned, vertically centered
- Name column: left-aligned or center-aligned, vertically centered
- Date columns (header row): center-aligned
- Date columns (data rows): center-aligned, text rotated
- Summary columns (header): center-aligned, wrapped text
- Summary columns (data): center-aligned

### Borders
- All cells have thin (0.5–1pt) solid black borders
- The outer table border may be slightly thicker (~1pt)
- No shading/background colors (white cells throughout)

---

## Reproduction Notes for AI Agent

1. **Use a table-based layout** — HTML `<table>` with `writing-mode: vertical-rl; transform: rotate(180deg)` for date cells, or equivalent in your target format.

2. **For HTML/CSS recreation:**
   - Set page to `@page { size: A4 landscape; margin: 10mm; }`
   - Use `writing-mode: vertical-lr; text-orientation: mixed; transform: rotate(180deg);` for rotated date cells
   - Use `font-family: 'Noto Sans Devanagari', 'Mangal', sans-serif;` for Hindi text

3. **For Word/DOCX recreation:**
   - Page setup: A4, landscape, narrow margins (1cm all sides)
   - Use table with merged cells for the header rows
   - Apply "Text Direction: Rotate all text 90°" to date data cells
   - Use very narrow column widths (~0.65cm) for date columns

4. **For PDF recreation (Python/ReportLab or WeasyPrint):**
   - Canvas size: `(841, 595)` points (landscape A4)
   - Use `canvas.rotate(90)` or equivalent for rotated date text
   - Ensure Devanagari font is embedded (e.g., Noto Sans Devanagari .ttf)

5. **The "Day Off" on date 17** appears to be in English, not Hindi — preserve as-is.

6. **"आकस्मिक अव."** on May 5 is an abbreviation for "आकस्मिक अवकाश" (Casual Leave).

7. **Blank rows:** After the example employee row, there appear to be additional empty data rows (for future employees) — add 10–15 empty rows of the same height below the filled row.

---

## Summary of Unique/Tricky Elements

| Challenge | Solution |
|---|---|
| 30 narrow date columns | Set fixed ~18pt width per column |
| Rotated attendance text | CSS `writing-mode` or Word text direction |
| Multi-row merged header | Use `rowspan` and `colspan` in HTML/table |
| Devanagari script | Embed Unicode Hindi font |
| Landscape A4 | Set page/canvas dimensions to 841×595pt |
| Very small font in summary headers | 6–7pt, allow text wrap |

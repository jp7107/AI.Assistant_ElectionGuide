import { Router } from 'express';
import { google } from 'googleapis';

const router = Router();

// Fallback timeline data (used when Google Sheets is not configured)
const FALLBACK_TIMELINE = [
  {
    step: 1,
    title: 'Announcement',
    description:
      'The Election Commission of India (ECI) announces the election schedule, including dates for nominations, polling, and counting.',
    icon: '📢',
    duration: 'Day 0',
  },
  {
    step: 2,
    title: 'Model Code of Conduct (MCC)',
    description:
      'MCC comes into effect immediately after announcement. Political parties and candidates must follow strict guidelines to ensure free and fair elections.',
    icon: '📋',
    duration: 'From announcement to results',
  },
  {
    step: 3,
    title: 'Notification',
    description:
      'Formal gazette notification is issued for the election. This officially starts the election process in the constituency.',
    icon: '📜',
    duration: '2-3 days after announcement',
  },
  {
    step: 4,
    title: 'Nomination',
    description:
      'Candidates file their nomination papers with the Returning Officer along with a security deposit. Last date is usually 7 days after notification.',
    icon: '📝',
    duration: '~7 days window',
  },
  {
    step: 5,
    title: 'Scrutiny of Nominations',
    description:
      'Returning Officer examines all nomination papers for validity. Invalid nominations are rejected.',
    icon: '🔍',
    duration: '1 day after nominations close',
  },
  {
    step: 6,
    title: 'Withdrawal of Candidatures',
    description:
      'Candidates can withdraw their nominations before the deadline. Final list of contesting candidates is prepared.',
    icon: '🔙',
    duration: '2 days after scrutiny',
  },
  {
    step: 7,
    title: 'Campaigning',
    description:
      'Candidates campaign through rallies, advertisements, door-to-door visits and social media. Campaign must stop 48 hours before polling.',
    icon: '📣',
    duration: 'Until 48hrs before polling',
  },
  {
    step: 8,
    title: 'Polling Day',
    description:
      'Voters cast their votes using Electronic Voting Machines (EVMs) at designated polling booths. Voting is typically from 7 AM to 6 PM.',
    icon: '🗳️',
    duration: 'Single day (multi-phase possible)',
  },
  {
    step: 9,
    title: 'Counting of Votes',
    description:
      'EVMs are opened and votes are counted at designated counting centres under strict supervision. VVPAT slips may be matched.',
    icon: '🔢',
    duration: 'Usually 1-2 days',
  },
  {
    step: 10,
    title: 'Results Declaration',
    description:
      'Results are declared constituency-wise. The candidate with the most votes wins. Results are available on ECI website in real-time.',
    icon: '🏆',
    duration: 'Same day as counting',
  },
  {
    step: 11,
    title: 'Government Formation',
    description:
      'The party or coalition with majority (272+ seats in Lok Sabha) is invited to form the government. The leader becomes Prime Minister.',
    icon: '🏛️',
    duration: 'Within days of results',
  },
];

// GET /api/timeline
router.get('/', async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

    if (!sheetId || !apiKey) {
      return res.json({ source: 'fallback', data: FALLBACK_TIMELINE });
    }

    const sheets = google.sheets({ version: 'v4', auth: apiKey });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Timeline!A2:E20',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json({ source: 'fallback', data: FALLBACK_TIMELINE });
    }

    const data = rows.map((row, idx) => ({
      step: idx + 1,
      title: row[0] || '',
      description: row[1] || '',
      icon: row[2] || '📌',
      duration: row[3] || '',
    }));

    res.json({ source: 'sheets', data });
  } catch (err) {
    console.error('Timeline fetch error:', err.message);
    res.json({ source: 'fallback', data: FALLBACK_TIMELINE });
  }
});

export default router;

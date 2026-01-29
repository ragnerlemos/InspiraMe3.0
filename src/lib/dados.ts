import { google } from 'googleapis';

const SPREADSHEET_ID = "1F7fiEGqeh3uJhnlz3nzbFx_mnIaKWSwHJ3HLwR-CnwU";
const GOOGLE_SERVICE_ACCOUNT_EMAIL = "inspirame@quotevid2-57726828-e0133.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpnkXS9iMLH1FR\nMqRE2MyR0JK2ZD43+NiMAHbhnfiRxpLsncTi8Z95/d8Z8XG3osFV3nrXM0WxHHEj\nvBxjmjLjDIKWNxch239w6a+SgeXt9/uBz/2D5kwR0sK9l3k0clMV1qebCtaSfDNj\nx+NZUga1vo12HtwcCbnzaToKM0qo7DYjxudZdlh/9Fb7pGkeynigWyhvlfEQk4wG\nOLLZsFaigo7TMTFj1xp5wbRHtGp++ny6N4a/8sVT7MDdRlT5cO+YW30ZkHL0wtRi\nR27yyOTNrKkX+PgJZXhdtsuSPAQCxatLKUa+QddU0tNSIWZol6bbEm0ivpme5dx8\n5DuvTJ0nAgMBAAECggEAArHK3l4rOIu2HeOZKQzTbYRfAeDxMH0JngO937l3Auqg\n8XuG7quaKUGnfMDrDQwO8f9d4gBLAzrDI1p89JCB1KO7IvBbs9DjiXz03VxATyAp\nRMRaL/FSVDz0YgQMS8R+Xf9YdawqgQ44pMU+ojy22MYSEJ/OrSImBZNhqPRsPOdP\ndydUnPLdv/13bUd7ohclgNwvnMUKxuEZaLWcpiFASIw2VCZH1IYOBoP0kJofT8JA\naR/DfOXMp+9wmM6O1WOiKHVMUGpdWomDC9VzDzg5cCTmCaJa7sPa0LyE4kWOEE0o\nn28fvnGnN9w3gibj/Q687lGptPKHP23NVJ3OS8uH5QKBgQDmxFid72JldohJ0oP3\nw1HufMjB6EjlbNi3AiOX9TFYBrY+Wmjv8HfoIN44pJ6tCyaUrEjK/TE/BR9yOWPE\n7k0jU7SSEMKT2esY9yl+oMnIqKRYR5Y6GXhE2+2u8C27CV4E0gE/eIx7mgnlAJKH\njGlOzLjdgT8SjalOZ5p3dZIBvQKBgQC8Kj626n0eUylcYFogXc/VWzIXNs549Wvt\nevE9SGcXJinh+f9EYDIjCQ03SgAyR/50HxouD8wu6JwL94ZLG59yP586erUXzrjz\nRjWYa77eSRiZLCevuDXLOcE8/rLzj70kP+zleEPQWo7byS+HEG1LrG+7/NCAagQ7\nEJtzB/peswKBgG4/c87QZQPwYyBRsLaX2/bCKu9o2Bqzq72TCgo5G//gBQU5EFVB\nXyfJPCF3lE87uozg2k4QNIzVF7bscBvPdY7hGK2H0E3umIDu5CYZDw4Mc6exW7Ya\nIPlU0PL40ABBc2d+JRZ7szIB36RGZ7rWfCEncVJxwv5MK4zHtmZIBx9JAoGAUy0x\nb9YT3NXSEL2e2XPerWeUquJVPu7t+JpCDV72Ayuhk/zYtDb5srcLmochsxhUCKy+\n++GL1qiIYlnWiVj6kJxDHKylZJLC+vbsNiZaxxP0xbDZEjoRvXYYT4gfPr8pUt7X\nL1CMWYvOXqV+VuwSBEODWMwWts0mdZ2PuberGzUCgYAB6LgAMjc9QSX7bj/ZT4Kk\ntzCGrJSM7Ja2NtEFtuRRttBVMGaG1RFmDrvZQR9GYhht8hlTiMwNBWjo+XG2Z9/F\n+61Yc7dlOpKI7H7ffwJKQwthVj02nsHaPDi0cHaHxCMxqBBVGW7t05wJSQR4t4FD\n5rpyEnmNuTv8Tc6H4e2qkg==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({
  version: 'v4',
  auth: auth,
});

export interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
    sheetName: string;
}

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

export interface SheetHierarchy {
  [sheetName: string]: CategoriesHierarchy;
}

const mapRowToQuote = (row: any[], index: number, sheetName: string): QuoteWithAuthor | null => {
    const quoteText = row[5];
    if (!quoteText || typeof quoteText !== 'string' || quoteText.trim() === '') {
        return null;
    }
    return {
        id: `${sheetName}-${index}`,
        quote: quoteText.trim(),
        author: row[9] || undefined,
        category: row[3] || 'Geral',
        subCategory: row[2] || undefined,
        sheetName: sheetName,
    };
};

export async function getAllSheetNames(forceRefresh = false): Promise<string[]> {
    if (!SPREADSHEET_ID) {
        console.error('SPREADSHEET_ID is not defined.');
        return [];
    }

    try {
        const spreadsheetMeta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });

        const sheetNames = spreadsheetMeta.data.sheets
            ?.map(sheet => sheet.properties?.title)
            .filter((title): title is string => !!title && title !== 'Modelo');

        return sheetNames || [];

    } catch (error) {
        console.error('Error fetching sheet names:', error);
        return [];
    }
}


export async function getAllQuotes(forceRefresh = false): Promise<QuoteWithAuthor[]> {
    if (!SPREADSHEET_ID) {
        console.error('SPREADSHEET_ID is not defined.');
        return [];
    }

    try {
        const sheetNames = await getAllSheetNames(forceRefresh);
        if (sheetNames.length === 0) {
            return [];
        }

        const ranges = sheetNames.map(name => `'${name}'!A:J`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges,
        });

        const valueRanges = response.data.valueRanges;
        if (!valueRanges) {
            console.warn('batchGet returned no valueRanges.');
            return [];
        }

        const quotes: QuoteWithAuthor[] = [];
        valueRanges.forEach((range, rangeIndex) => {
            const sheetName = sheetNames[rangeIndex];
            if (range.values) {
                for (let i = 1; i < range.values.length; i++) {
                    const quote = mapRowToQuote(range.values[i], i, sheetName);
                    if (quote) {
                        quotes.push(quote);
                    }
                }
            }
        });

        return quotes;

    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return [];
    }
}

export async function getSheetData(forceRefresh = false): Promise<SheetHierarchy> {
    const quotes = await getAllQuotes(forceRefresh);
    const sheetHierarchy: SheetHierarchy = {};

    quotes.forEach(quote => {
        if (!sheetHierarchy[quote.sheetName]) {
            sheetHierarchy[quote.sheetName] = {};
        }
        const sheetCategories = sheetHierarchy[quote.sheetName];
        if (quote.category) {
            if (!sheetCategories[quote.category]) {
                sheetCategories[quote.category] = [];
            }
            if (quote.subCategory && !sheetCategories[quote.category].includes(quote.subCategory) && quote.subCategory !== 'Todos') {
                sheetCategories[quote.category].push(quote.subCategory);
            }
        }
    });

    for (const sheetName in sheetHierarchy) {
        for (const cat in sheetHierarchy[sheetName]) {
            sheetHierarchy[sheetName][cat].sort();
        }
    }

    return sheetHierarchy;
}

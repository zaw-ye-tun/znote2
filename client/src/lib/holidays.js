// Finnish Official Holidays 2025-2030
// Includes both fixed and movable holidays

const calculateEaster = (year) => {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
};

const getMovableHolidays = (year) => {
  const easter = calculateEaster(year);
  const easterTime = easter.getTime();
  const day = 24 * 60 * 60 * 1000;
  
  return [
    // Good Friday (2 days before Easter)
    {
      date: new Date(easterTime - 2 * day),
      name: 'Pitkäperjantai (Good Friday)',
      nameEn: 'Good Friday'
    },
    // Easter Sunday
    {
      date: easter,
      name: 'Pääsiäispäivä (Easter Sunday)',
      nameEn: 'Easter Sunday'
    },
    // Easter Monday
    {
      date: new Date(easterTime + day),
      name: '2. pääsiäispäivä (Easter Monday)',
      nameEn: 'Easter Monday'
    },
    // Ascension Day (39 days after Easter)
    {
      date: new Date(easterTime + 39 * day),
      name: 'Helatorstai (Ascension Day)',
      nameEn: 'Ascension Day'
    },
    // Whit Sunday (49 days after Easter)
    {
      date: new Date(easterTime + 49 * day),
      name: 'Helluntaipäivä (Whit Sunday)',
      nameEn: 'Whit Sunday'
    },
    // Midsummer Eve (Friday between June 19-25)
    {
      date: getMidsummerEve(year),
      name: 'Juhannusaatto (Midsummer Eve)',
      nameEn: 'Midsummer Eve'
    },
    // Midsummer Day (Saturday between June 20-26)
    {
      date: getMidsummerDay(year),
      name: 'Juhannuspäivä (Midsummer Day)',
      nameEn: 'Midsummer Day'
    },
    // All Saints' Day (Saturday between Oct 31 - Nov 6)
    {
      date: getAllSaintsDay(year),
      name: 'Pyhäinpäivä (All Saints\' Day)',
      nameEn: 'All Saints\' Day'
    }
  ];
};

const getMidsummerEve = (year) => {
  // Midsummer Eve is the Friday between June 19-25
  const june19 = new Date(year, 5, 19);
  const dayOfWeek = june19.getDay();
  const daysToFriday = (5 - dayOfWeek + 7) % 7;
  return new Date(year, 5, 19 + daysToFriday);
};

const getMidsummerDay = (year) => {
  // Midsummer Day is the Saturday between June 20-26
  const june20 = new Date(year, 5, 20);
  const dayOfWeek = june20.getDay();
  const daysToSaturday = (6 - dayOfWeek + 7) % 7;
  return new Date(year, 5, 20 + daysToSaturday);
};

const getAllSaintsDay = (year) => {
  // All Saints' Day is the Saturday between October 31 and November 6
  const oct31 = new Date(year, 9, 31);
  const dayOfWeek = oct31.getDay();
  const daysToSaturday = (6 - dayOfWeek + 7) % 7;
  return new Date(year, 9, 31 + daysToSaturday);
};

const fixedHolidays = [
  { month: 0, day: 1, name: 'Uudenvuodenpäivä (New Year\'s Day)', nameEn: 'New Year\'s Day' },
  { month: 0, day: 6, name: 'Loppiainen (Epiphany)', nameEn: 'Epiphany' },
  { month: 4, day: 1, name: 'Vappu (May Day)', nameEn: 'May Day' },
  { month: 11, day: 6, name: 'Itsenäisyyspäivä (Independence Day)', nameEn: 'Independence Day' },
  { month: 11, day: 24, name: 'Jouluaatto (Christmas Eve)', nameEn: 'Christmas Eve' },
  { month: 11, day: 25, name: 'Joulupäivä (Christmas Day)', nameEn: 'Christmas Day' },
  { month: 11, day: 26, name: '2. joulupäivä (Boxing Day)', nameEn: 'Boxing Day' }
];

// Generate holidays for 2025-2030
export const finnishHolidays = (() => {
  const holidays = [];
  
  for (let year = 2025; year <= 2030; year++) {
    // Add fixed holidays
    fixedHolidays.forEach(holiday => {
      holidays.push({
        date: new Date(year, holiday.month, holiday.day),
        name: holiday.name,
        nameEn: holiday.nameEn,
        year
      });
    });
    
    // Add movable holidays
    getMovableHolidays(year).forEach(holiday => {
      holidays.push({
        ...holiday,
        year
      });
    });
  }
  
  return holidays;
})();

// Helper function to check if a date is a Finnish holiday
export const isHoliday = (date) => {
  return finnishHolidays.find(holiday => {
    const holidayDate = holiday.date;
    return (
      holidayDate.getDate() === date.getDate() &&
      holidayDate.getMonth() === date.getMonth() &&
      holidayDate.getFullYear() === date.getFullYear()
    );
  });
};

// Helper function to get holiday name for a date
export const getHolidayName = (date) => {
  const holiday = isHoliday(date);
  return holiday ? holiday.name : null;
};

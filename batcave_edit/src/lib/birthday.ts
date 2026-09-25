export const BIRTH = {
  year: 2008,
  month: 11,
  day: 2,
};

export function birthDate(year = BIRTH.year) {
  return new Date(year, BIRTH.month, BIRTH.day, 0, 0, 0, 0);
}

export function nextBirthday(from = new Date()) {
  const y = from.getFullYear();
  let next = birthDate(y);
  if (from >= next) next = birthDate(y + 1);
  return next;
}

export function ageYears(from = new Date()) {
  const b = birthDate();
  let age = from.getFullYear() - b.getFullYear();
  const had =
    from.getMonth() > b.getMonth() ||
    (from.getMonth() === b.getMonth() && from.getDate() >= b.getDate());
  if (!had) age -= 1;
  return age;
}

export function turningAge(from = new Date()) {
  return ageYears(from) + (isBirthday(from) ? 0 : 1);
}

export function isBirthday(from = new Date()) {
  return from.getMonth() === BIRTH.month && from.getDate() === BIRTH.day;
}

export interface Countdown {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function countdownTo(target: Date, from = new Date()): Countdown {
  const totalMs = Math.max(0, target.getTime() - from.getTime());
  const secondsTotal = Math.floor(totalMs / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;
  return { totalMs, days, hours, minutes, seconds };
}

export function livedFor(from = new Date()) {
  const start = birthDate().getTime();
  const ms = Math.max(0, from.getTime() - start);
  const days = Math.floor(ms / 86400000);
  const years = ageYears(from);
  return { ms, days, years };
}

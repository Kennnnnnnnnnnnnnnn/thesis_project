import moment from 'moment-timezone';

const khmerMonths = [
  'មករា', 'កម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export default function formatDateKhmer(date) {
  if (!date) return '';

  const momentDate = moment(date).tz('Asia/Phnom_Penh'); // set timezone

  const day = momentDate.date();
  const monthIndex = momentDate.month(); // 0-11
  const year = momentDate.year();
  const time = momentDate.format('hh:mm:ss A'); // 12-hour time with seconds

  return `${day} ${khmerMonths[monthIndex]} ${year} ${time}`;
}

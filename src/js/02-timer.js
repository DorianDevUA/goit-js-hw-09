import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  calendar: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  dataDays: document.querySelector('span[data-days]'),
  dataHours: document.querySelector('span[data-hours]'),
  dataMinutes: document.querySelector('span[data-minutes]'),
  dataSeconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;

let intervalId;
let isActive = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenTime = selectedDates[0].getTime();
    const currentTime = Date.now();

    if (chosenTime > currentTime) {
      refs.startBtn.disabled = false;
      Notiflix.Notify.success('Now, press the START button');
    } else {
      refs.startBtn.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future');
    }

    if (isActive) {
      refs.startBtn.disabled = true;
    }
  },
};

const fpTime = flatpickr(refs.calendar, options);

refs.startBtn.addEventListener('click', onClickStartBtn);

function onClickStartBtn() {
  if (isActive) {
    return;
  }

  const chosenTime = fpTime.selectedDates[0].getTime();
  refs.startBtn.disabled = true;
  isActive = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diffTime = chosenTime - currentTime;

    if (diffTime <= 0) {
      clearInterval(intervalId);
      isActive = false;
      return;
    }

    updateTimer(convertMs(diffTime));
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = addLeadingZero(days);
  refs.dataHours.textContent = addLeadingZero(hours);
  refs.dataMinutes.textContent = addLeadingZero(minutes);
  refs.dataSeconds.textContent = addLeadingZero(seconds);
}

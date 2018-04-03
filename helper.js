export default {
  formatDate(date) {
    let d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()
    let hour = Number(d.getHours())
    let minute = Number(d.getMinutes())
    let second = Number(d.getSeconds())

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    if (second < 10) second = '0' + second;

    return [year, month, day].join('-') + ` ${hour}:${minute}:${second}`;
  }
}

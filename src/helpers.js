import Swal from "sweetalert2";

export function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: message,
    });
}

export function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // فرمت 24 ساعته
  };
  const persianDateTime = new Date(date).toLocaleString("fa-IR", options);
  const [datePart, timePart] = persianDateTime.split(", ");
  const formattedDate = datePart.split("/").join("-");
  return `${formattedDate} ${timePart}`;
}
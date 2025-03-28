import Swal from "sweetalert2";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

export function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: message,
    });
}

// تاریخ میلادی را به شمسی تبدیل میکند
//YYYY/MM/DD HH:mm
export function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // فرمت 24 ساعته
  };
  return new Date(date).toLocaleString("fa-IR", options);
}

// قانون سفارشی برای مقایسه رمز عبور
export const sameAsPassword = (value, { password }) => {
    return value === password;
};

// تعریف Regex برای رمز عبور
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_)(*&^%$#@!]).{8,}$/;

// تابع اعتبارسنجی اختصاصی
export const passwordRule = (value) => passwordRegex.test(value);

// قانون سفارشی برای مقایسه تاریخ
const endAfterStart = (value, siblings) =>
    !value || !siblings.start_date || new Date(value) > new Date(siblings.start_date);

// قوانین اعتبارسنجی با پیام‌های فارسی
export const tasksRules = {
    title: {
        required: helpers.withMessage('عنوان الزامی است', required),
        minLength: helpers.withMessage('عنوان باید حداقل 3 کاراکتر باشد', minLength(3)),
        maxLength: helpers.withMessage('عنوان نمی‌تواند بیشتر از 255 کاراکتر باشد', maxLength(255)),
    },
    description: {
        required: helpers.withMessage('توضیحات الزامی است', required),
        minLength: helpers.withMessage('توضیحات باید حداقل 5 کاراکتر باشد', minLength(5)),
        maxLength: helpers.withMessage('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد', maxLength(500)),
    },
    start_date: {
        required: helpers.withMessage('تاریخ شروع الزامی است', required),
    },
    end_date: {
        required: helpers.withMessage('تاریخ پایان الزامی است', required),
        endAfterStart: helpers.withMessage('تاریخ پایان باید بعد از تاریخ شروع باشد', endAfterStart),
    },
};
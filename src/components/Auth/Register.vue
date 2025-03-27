<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%;">
            <div class="card-body">
                <h2 class="text-center mb-4 text-success fw-bold">ثبت‌نام</h2>
                <form @submit.prevent="handleSubmit">
                    <!-- فیلد نام -->
                    <div class="mb-3 position-relative">
                        <label for="name" class="form-label fw-semibold">نام</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-person-fill text-success"></i>
                            </span>
                            <input type="text" class="form-control text-center" id="name" v-model="formData.name"
                                placeholder="نام خود را وارد کنید" @blur="v$.name.$touch"
                                :class="{ 'is-invalid': v$.name.$error }" />
                        </div>
                        <div v-if="v$.name.$error" class="text-danger">
                            {{ v$.name.$errors[0].$message }}
                        </div>
                        <div v-if="errors.name" class=" text-danger">
                            {{ errors.name[0] }}
                        </div>
                    </div>

                    <!-- فیلد ایمیل -->
                    <div class="mb-3 position-relative">
                        <label for="email" class="form-label fw-semibold">ایمیل</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-envelope-fill text-success"></i>
                            </span>
                            <input type="text" class="form-control text-center" id="email" v-model="formData.email"
                                placeholder="ایمیل خود را وارد کنید" @blur="v$.email.$touch"
                                :class="{ 'is-invalid': v$.email.$error }" />
                        </div>
                        <div v-if="v$.email.$error" class="text-danger">
                            {{ v$.email.$errors[0].$message }}
                        </div>
                        <div v-if="errors.email" class=" text-danger">
                            {{ errors.email[0] }}
                        </div>
                    </div>

                    <!-- فیلد رمز عبور -->
                    <div class="mb-3 position-relative">
                        <label for="password" class="form-label fw-semibold">رمز عبور</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-lock-fill text-success"></i>
                            </span>
                            <input :type="showPassword ? 'text' : 'password'" class="form-control text-center"
                                id="password" v-model="formData.password" placeholder="رمز عبور خود را وارد کنید"
                                @blur="v$.name.$touch" :class="{ 'is-invalid': v$.password.$error }" />
                            <button type="button" class="btn btn-outline-secondary"
                                @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                        <div v-if="v$.password.$error" class="text-danger">
                            {{ v$.password.$errors[0].$message }}
                        </div>
                        <div v-if="errors.password" class=" text-danger">
                            {{ errors.password[0] }}
                        </div>
                    </div>

                    <!-- فیلد تکرار رمز عبور -->
                    <div class="mb-4 position-relative">
                        <label for="confirmPassword" class="form-label fw-semibold">تکرار رمز عبور</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-lock-fill text-success"></i>
                            </span>
                            <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control text-center"
                                id="confirmPassword" v-model="formData.password_confirmation"
                                placeholder="رمز عبور را دوباره وارد کنید" @blur="v$.password_confirmation.$touch"
                                :class="{ 'is-invalid': v$.password_confirmation.$error }" />
                            <button type="button" class="btn btn-outline-secondary"
                                @click="showConfirmPassword = !showConfirmPassword">
                                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                        <div v-if="v$.password_confirmation.$error" class="text-danger">
                            {{ v$.password_confirmation.$errors[0].$message }}
                        </div>
                    </div>

                    <button type="submit" :disabled="loading || v$.$invalid"
                        class="btn btn-success w-100 py-2 fw-semibold">
                        <span v-if="loading" class=" spinner-border spinner-border-sm me-2"></span>
                        <i class="bi bi-person-plus-fill me-2"></i> <span>ثبت‌نام</span>

                    </button>
                </form>

                <!-- لینک ورود -->
                <div class="text-center mt-3">
                    <span class="text-muted small">حساب دارید؟ </span>
                    <router-link to="/login" class="text-success small">وارد شوید</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from "../../axios/api.js";
import { useAuthUserStore } from '../../stores/auth_user.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers, email, maxLength } from '@vuelidate/validators';

const router = useRouter()
const authStore = useAuthUserStore()
const formData = reactive({
    name: '',
    email: "",
    password: "",
    password_confirmation: "",

});
// قانون سفارشی برای مقایسه رمز عبور
const sameAsPassword = (value, { password }) => {
    return value === password;
};
// قوانین اعتبارسنجی با پیام‌های فارسی
const rules = {
    name: {
        required: helpers.withMessage('فیلد نام الزامی است', required),
        minLength: helpers.withMessage('نام باید حداقل ۳ کاراکتر باشد', minLength(3)),
        maxLength: helpers.withMessage('نام باید حداکثر 255 کاراکتر باشد', maxLength(255)),
    },
    email: {
        required: helpers.withMessage('ایمیل الزامی است', required),
        email: helpers.withMessage('فرمت ایمیل نامعتبر است', email),
    },
    password: {
        required: helpers.withMessage('رمز عبور الزامی است', required),
        minLength: helpers.withMessage('رمز عبور باید حداقل 8 کاراکتر باشد', minLength(8)),
    },
    password_confirmation: {
        required: helpers.withMessage('تکرار عبور الزامی است', required),
        sameAsPassword: helpers.withMessage('رمز عبور و تکرار آن باید یکسان باشند', sameAsPassword),
    }
};
const v$ = useVuelidate(rules, formData, { $lazy: true });
const errors = ref({})
let loading = ref(false)
let showPassword = ref(false);
let showConfirmPassword = ref(false);

async function handleSubmit() {
    v$.value.$touch();
    if (!v$.value.$invalid) {

        errors.value = {};
        loading.value = true;

        try {
            const response = await api.post('register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            })

            if (response.data.success) {
                authStore.setAuthUser(response.data.data.user)
                authStore.setApiToken(response.data.data.api_token)

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'ثبت نام با موفقیت انجام شد',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                router.push({ name: 'dashboard' });
            }
        } catch (e) {
            if (e.response) {
                const { status, data } = e.response
                switch (status) {
                    case 422: // خطاهای اعتبارسنجی
                        errors.value = data.errors;
                        break;
                    case 401:// خطای احراز هویت
                        showError(data.message)
                        break;
                    default:
                        showError('مشکلی در سرور رخ داده است. لطفاً دوباره تلاش کنید.')
                        break;
                }
            } else {
                // خطای شبکه یا غیرمنتظره
                showError('اتصال به سرور برقرار نشد.')
            }
        } finally {
            loading.value = false;
        }
    }
}
</script>

<style scoped>
.card {
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #ffffff, #f1f3f5);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.btn-success {
    background: #198754;
    border: none;
    border-radius: 10px;
    transition: background 0.3s ease;
}

.btn-success:hover {
    background: #157347;
}

.input-group-text {
    border-radius: 0 10px 10px 0;
}

.form-control {
    border-radius: 10px 0 0 10px;
    transition: box-shadow 0.3s ease;
}

.form-control:focus {
    box-shadow: 0 0 10px rgba(25, 135, 84, 0.3);
    border-color: #198754;
}

.text-danger {
    font-size: 0.875rem;
}
</style>
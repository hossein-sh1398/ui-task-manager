<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card shadow-lg p-4" style="max-width: 500px; width: 100%;">
            <div class="card-body">
                <h2 class="text-center mb-4 text-primary fw-bold">ورود به سیستم</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3 position-relative">
                        <label for="email" class="form-label fw-semibold">ایمیل</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-envelope-fill text-primary"></i>
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

                    <div class="mb-4 position-relative">
                        <label for="password" class="form-label fw-semibold">رمز عبور</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-lock-fill text-primary"></i>
                            </span>
                            <input :type="showPassword ? 'text' : 'password'" class="form-control text-center" id="password"
                                v-model="formData.password" placeholder="رمز عبور خود را وارد کنید"
                                @blur="v$.password.$touch" :class="{ 'is-invalid': v$.password.$error }" />
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

                    <button type="submit" :disabled="loading || v$.$invalid"
                        class="btn btn-primary w-100 py-2 fw-semibold">
                        <span v-if="loading" class=" spinner-border spinner-border-sm me-2"></span>
                        <i class="bi bi-box-arrow-in-right me-2"></i> ورود
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthUserStore } from '../../stores/auth_user';
import api from '../../axios/api';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { showError } from '../../helpers';
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers, email } from '@vuelidate/validators';

const authUser = useAuthUserStore()
const router = useRouter()
const formData = reactive({
    email: "",
    password: "",
})
const errors = ref({})
let loading = ref(false)
let showPassword = ref(false)
// قوانین اعتبارسنجی با پیام‌های فارسی
const rules = {
    email: {
        required: helpers.withMessage('ایمیل الزامی است', required),
        email: helpers.withMessage('فرمت ایمیل نامعتبر است', email),
    },
    password: {
        required: helpers.withMessage('رمز عبور الزامی است', required),
        minLength: helpers.withMessage('رمز عبور باید حداقل 8 کاراکتر باشد', minLength(8)),
    }
};
const v$ = useVuelidate(rules, formData, { $lazy: true });

async function handleSubmit() {
    v$.value.$touch();

    if (!v$.value.$invalid) {
        loading.value = true;
        errors.value = {};
    
        try {
            const response = await api.post('login', {
                email: formData.email,
                password: formData.password,
            })
    
            authUser.setAuthUser(response.data.data.user)
            authUser.setApiToken(response.data.data.api_token)
    
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'ورود با موفقیت انجام شد',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
            router.push({ name: 'dashboard' });
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
/* استایل‌های سفارشی برای جذاب‌تر شدن */
.card {
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #ffffff, #f8f9fa);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.btn-primary {
    background: #0d6efd;
    border: none;
    border-radius: 10px;
    transition: background 0.3s ease;
}

.btn-primary:hover {
    background: #0b5ed7;
}

.input-group-text {
    border-radius: 0 10px 10px 0;
}

.form-control {
    border-radius: 10px 0 0 10px;
    transition: box-shadow 0.3s ease;
}

.form-control:focus {
    box-shadow: 0 0 10px rgba(13, 110, 253, 0.3);
    border-color: #0d6efd;
}
</style>
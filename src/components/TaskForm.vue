<template>
    <div class="container d-flex justify-content-center align-items-center">
        <div class="card shadow-lg p-2" style="max-width: 500px; width: 100%;">
            <div class="card-body">
                <h2 class="text-center mb-2 text-info fw-bold">تعریف تسک جدید</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="mb-2 position-relative">
                        <label for="title" class="form-label fw-semibold">عنوان</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-card-text text-info"></i>
                            </span>
                            <input type="text" class="form-control" id="title" v-model="formData.title"
                                placeholder="عنوان تسک را وارد کنید" @blur="v$.title.$touch"
                                :class="{ 'is-invalid': v$.title.$error }" />
                        </div>
                        <div v-if="v$.title.$error" class="text-danger">
                            {{ v$.title.$errors[0].$message }}
                        </div>
                        <div v-if="errors.title" class="text-danger">
                            {{ errors.title[0] }}
                        </div>
                    </div>

                    <div class="mb-2 position-relative">
                        <label for="description" class="form-label fw-semibold">توضیحات</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-chat-text-fill text-info"></i>
                            </span>
                            <textarea class="form-control" id="description" v-model="formData.description" rows="3"
                                placeholder="توضیحات تسک را وارد کنید" @blur="v$.description.$touch"
                                :class="{ 'is-invalid': v$.description.$error }"></textarea>
                        </div>
                        <div v-if="v$.description.$error" class="text-danger">
                            {{ v$.description.$errors[0].$message }}
                        </div>
                        <div v-if="errors.description" class=" text-danger">
                            {{ errors.description[0] }}
                        </div>
                    </div>

                    <div class="mb-2 position-relative">
                        <label for="startDate" class="form-label fw-semibold">تاریخ شروع</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-calendar-event text-info"></i>
                            </span>
                            <date-picker type="datetime" v-model="formData.start_date" format="YYYY-MM-DD HH:mm"
                                display-format="jYYYY/jMM/jDD HH:mm" placeholder="تاریخ شروع را انتخاب کنید"
                                class="form-control" @blur="v$.start_date.$touch"
                                :class="{ 'is-invalid': v$.start_date.$error }" />
                        </div>
                        <div v-if="v$.start_date.$error" class="text-danger">
                            {{ v$.start_date.$errors[0].$message }}
                        </div>
                        <div v-if="errors.start_date" class=" text-danger">
                            {{ errors.start_date[0] }}
                        </div>
                    </div>

                    <div class="mb-2 position-relative">
                        <label for="endDate" class="form-label fw-semibold">تاریخ پایان</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="bi bi-calendar-check text-info"></i>
                            </span>
                            <date-picker type="datetime" format="YYYY-MM-DD HH:mm" display-format="jYYYY/jMM/jDD HH:mm"
                                v-model="formData.end_date" @blur="v$.end_date.$touch"
                                :class="{ 'is-invalid': v$.end_date.$error }" placeholder="تاریخ پایان را انتخاب کنید"
                                class="form-control" />
                        </div>
                        <div v-if="v$.end_date.$error" class="text-danger">
                            {{ v$.end_date.$errors[0].$message }}
                        </div>
                        <div v-if="errors.end_date" class=" text-danger">
                            {{ errors.end_date[0] }}
                        </div>
                    </div>

                    <button type="submit" :disabled="loading || v$.$invalid"
                        class="btn btn-primary btn-sm mt-2 w-100 fw-semibold text-white">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <span>ثبت تسک</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import DatePicker from 'vue3-persian-datetime-picker';
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';
import api from '../axios/api'
import { showError, tasksRules } from '../helpers';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';

const router = useRouter()
const errors = ref({})
const formData = reactive({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
});
let loading = ref(false)

const v$ = useVuelidate(tasksRules, formData, { $lazy: true });

async function handleSubmit() {
    v$.value.$touch();

    if (!v$.value.$invalid) {
        errors.value = {};

        loading.value = true;

        try {
            const response = await api.post('tasks', {
                title: formData.title,
                description: formData.description,
                start_date: formData.start_date,
                end_date: formData.end_date,
            });
            if (response.data.success) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'وظیفه مورد نظر با موفقیت ثبت شد',
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
                        showError("خطای احراز هویت")
                        break;
                    default:
                        showError('مشکلی در سرور رخ داده است. لطفاً دوباره تلاش کنید.')
                        break;
                }
            } else {
                // خطای شبکه یا غیرمنتظره
                showError('اتصال به سرور برقرار نشد.')
            }
        }
        finally {
            loading.value = false;
        }
    }
}
</script>

<style scoped>
.card {
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #ffffff, #e9ecef);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.btn-info {
    background: #17a2b8;
    border: none;
    border-radius: 10px;
    transition: background 0.3s ease;
}

.btn-info:hover {
    background: #138496;
}

.input-group-text {
    border-radius: 0 10px 10px 0;
}

.form-control,
textarea,
.vue3-persian-datetime-picker input {
    border-radius: 10px 0 0 10px;
    transition: box-shadow 0.3s ease;
}

.form-control:focus,
textarea:focus,
.vue3-persian-datetime-picker input:focus {
    box-shadow: 0 0 10px rgba(23, 162, 184, 0.3);
    border-color: #17a2b8;
}

.text-danger {
    font-size: 0.875rem;
}
</style>

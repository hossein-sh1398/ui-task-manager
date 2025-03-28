<template>
    <div class="container my-5">
        <!-- دکمه افزودن تسک جدید -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-info fw-bold">لیست وظایف</h2>
            <router-link to="/tasks/create" class="btn btn-success btn-sm">
                <i class="bi bi-plus-circle me-2"></i> افزودن تسک جدید
            </router-link>
        </div>

        <!-- جدول وظایف -->
        <div class="mb-3 position-relative">
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="search" class="form-label fw-semibold">جستجو</label>
                    <div class="input-group position-relative">
                        <span class="input-group-text bg-light">
                            <i class="bi bi-search text-info"></i>
                        </span>
                        <input type="text" class="form-control" v-model="params.search" id="search"
                            placeholder="جستجو در وظایف..." />
                        <span class="position-absolute" v-if="params.search.length > 0" @click="params.search = ''"
                            style="left: 110px; top: 55%; transform: translateY(-50%); z-index: 10;">
                            <i class="bi bi-x text-muted" style="font-size: 1.2rem;"></i>
                        </span>
                        <button type="button" class="btn btn-info text-white" @click.prevent="doSearch()">
                            <i class="bi bi-search me-1"></i> جستجو
                        </button>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="statusFilter" class="form-label fw-semibold">فیلتر وضعیت</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light">
                            <i class="bi bi-filter text-info"></i>
                        </span>
                        <select class="form-select" v-model="params.status" @change="doFilter()" id="statusFilter">
                            <option value="">همه</option>
                            <option value="completed">انجام‌شده</option>
                            <option value="pending">در حال انجام</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="statusFilter" class="form-label fw-semibold">تعداد صفحه بندی</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light">
                            <i class="bi bi-filter text-info"></i>
                        </span>
                        <select class="form-select" v-model="params.per_page" @change="loadTasks()" id="statusFilter">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
                <div class="col-12 mt-2" v-if="isSearched">
                    <button type="button" @click="clearSearchAndFilters()" class="btn btn-outline-danger w-100">
                        <i class="bi bi-x-circle me-1"></i> حذف جستجو و فیلتر
                    </button>
                </div>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle">
                <thead class="table-dark">
                    <tr>
                        <th style="width: 80px;">
                            <a href="#" class="btn-sort" @click.prevent="columnSort('id')">
                                <template v-if="params.order === 'id'">
                                    <i v-if="params.dir == 'desc'" class=" bi bi-sort-down me-2"></i>
                                    <i v-else="params.dir == 'asc'" class="bi bi-sort-up me-2"></i>
                                </template>
                                <span>آدی</span>
                            </a>
                        </th>
                        <th style="width: 200px;">
                            <a href="#" class="btn-sort" @click.prevent="columnSort('title')">
                                <template v-if="params.order === 'title'">
                                    <i v-if="params.dir == 'desc'" class="bi bi-sort-down me-2"></i>
                                    <i v-else="params.dir == 'asc'" class="bi bi-sort-up me-2"></i>
                                </template>
                                <span>عنوان</span>
                            </a>
                        </th>
                        <th>
                            <a href="#" class="btn-sort" @click.prevent="columnSort('description')">
                                <template v-if="params.order === 'description'">
                                    <i v-if="params.dir == 'desc'" class="bi bi-sort-down me-2"></i>
                                    <i v-else="params.dir == 'asc'" class="bi bi-sort-up me-2"></i>
                                </template>
                                <span>توضیحات</span>
                            </a>
                        </th>
                        <th style="width: 120px;">
                            <a href="#" class="btn-sort" @click.prevent="columnSort('start_date')">
                                <template v-if="params.order === 'start_date'">
                                    <i v-if="params.dir == 'desc'" class="bi bi-sort-down me-2"></i>
                                    <i v-else="params.dir == 'asc'" class="bi bi-sort-up me-2"></i>
                                </template>
                                <span>تاریخ شروع</span>
                            </a>
                        </th>
                        <th style="width: 120px;">
                            <a href="#" class="btn-sort" @click.prevent="columnSort('end_date')">
                                <template v-if="params.order === 'end_date'">
                                    <i v-if="params.dir == 'desc'" class="bi bi-sort-down me-2"></i>
                                    <i v-else="params.dir == 'asc'" class="bi bi-sort-up me-2"></i>
                                </template>
                                <span>تاریخ پایان</span>
                            </a>
                        </th>
                        <th style="width: 120px;">
                            <a href="#" class="btn-sort" @click.prevent="columnSort('completed')">
                                <template v-if="params.order === 'completed'">
                                    <i v-if="params.dir == 'desc'" class="bi bi-sort-down me-2"></i>
                                    <i v-else="params.dir == 'asc'" class="bi bi-sort-up me-2"></i>
                                </template>
                                <span>وضعیت</span>
                            </a>
                        </th>
                        <th style="width: 150px;">عملیات</th>
                    </tr>
                </thead>
                <tbody v-if="!loading">
                    <tr v-for="(task, index) in tasks" :key="index">
                        <td>{{ task.id }}</td>
                        <td>{{ task.title }}</td>
                        <td>{{ task.description }}</td>
                        <td dir="ltr">{{ formatDate(task.start_date) }}</td>
                        <td dir="ltr">{{ formatDate(task.end_date) }}</td>
                        <td>
                            <span v-if="task.completed" class="text-success">
                                <i class="bi bi-check-circle-fill"></i> انجام‌شده
                            </span>
                            <span v-else class="text-danger">
                                <i class="bi bi-x-circle-fill"></i> در حال انجام
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-danger me-1" @click="deleteTask(task.id, index)" title="حذف">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-warning me-1" :disabled="task.editLoading"
                                @click="openEditModal(task.id, index)" title="ویرایش">
                                <i class=" spinner-border spinner-border-sm me-1" v-if="task.editLoading"></i>
                                <i class="bi bi-pencil-square" v-else></i>
                            </button>
                            <button class="btn btn-sm" :disabled="task.toggleLoading"
                                :class="task.completed ? 'btn-outline-success' : 'btn-outline-danger'"
                                @click="toggleStatus(task.id, index)" title="تغییر وضعیت">
                                <i class="spinner-border spinner-border-sm me-1" v-if="task.toggleLoading"></i>
                                <i class="bi bi-arrow-repeat" v-else></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <td colspan="7">
                            <div class="text-center">
                                <div class="spinner-border text-info" role="status">
                                    <span class="visually-hidden">در حال بارگذاری...</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div class="d-flex justify-content-center align-items-center"
                v-if="tasks.length > 5 && meta?.links?.length > 1">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li v-for="link in meta?.links" :key="link.url" class="page-item"
                            :class="{ active: link.active }">
                            <button class="page-link btn-sm" @click="!link.active ? loadPaginatedTasks(link.label) : ''">
                                {{ link.label }}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="alert alert-info text-center" v-if="tasks.length == 0 && loading == false">
            وظیفه‌ای برای نمایش پیدا نشد
        </div>

        <!-- مودال ویرایش -->
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-info fw-bold" id="editModalLabel">ویرایش تسک</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="editTitle" class="form-label fw-semibold">عنوان</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-card-text text-info"></i>
                                </span>
                                <input type="text" class="form-control" id="editTitle" v-model="editTask.title"
                                    placeholder="عنوان تسک" @blur="v$.title.$touch"
                                    :class="{ 'is-invalid': v$.title.$error }" />
                            </div>
                            <div v-if="v$.title.$error" class="text-danger">
                                {{ v$.title.$errors[0].$message }}
                            </div>
                            <div v-if="errors.title" class="text-danger">
                                {{ errors.title[0] }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="editDescription" class="form-label fw-semibold">توضیحات</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-chat-text-fill text-info"></i>
                                </span>
                                <textarea class="form-control" id="editDescription" v-model="editTask.description"
                                    rows="2" placeholder="توضیحات تسک" @blur="v$.description.$touch"
                                    :class="{ 'is-invalid': v$.description.$error }"></textarea>
                            </div>
                            <div v-if="v$.description.$error" class="text-danger">
                                {{ v$.description.$errors[0].$message }}
                            </div>
                            <div v-if="errors.description" class=" text-danger">
                                {{ errors.description[0] }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="editStartDate" class="form-label fw-semibold">تاریخ شروع</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-calendar-event text-info"></i>
                                </span>
                                <date-picker v-model="editTask.start_date" format="YYYY-MM-DD HH:mm" type="datetime"
                                    display-format="jYYYY/jMM/jDD HH:mm" placeholder="تاریخ شروع" class="form-control"
                                    @blur="v$.start_date.$touch" :class="{ 'is-invalid': v$.start_date.$error }" />
                            </div>
                            <div v-if="v$.start_date.$error" class="text-danger">
                                {{ v$.start_date.$errors[0].$message }}
                            </div>
                            <div v-if="errors.start_date" class=" text-danger">
                                {{ errors.start_date[0] }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="editEndDate" class="form-label fw-semibold">تاریخ پایان</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-calendar-check text-info"></i>
                                </span>
                                <date-picker type="datetime" v-model="editTask.end_date" format="YYYY-MM-DD HH:mm"
                                    display-format="jYYYY/jMM/jDD HH:mm" placeholder="تاریخ پایان" class="form-control"
                                    @blur="v$.end_date.$touch" :class="{ 'is-invalid': v$.end_date.$error }" />
                            </div>
                            <div v-if="v$.end_date.$error" class="text-danger">
                                {{ v$.end_date.$errors[0].$message }}
                            </div>
                            <div v-if="errors.end_date" class="text-danger">
                                {{ errors.end_date[0] }}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                            <i class="bi bi-x-circle me-1"></i> بستن
                        </button>

                        <button type="button" class="btn btn-primary btn-sm text-white"
                            :disabled="updateLoading || v$.$invalid" @click="saveEditedTask">
                            <span v-if="updateLoading" class="spinner-border spinner-border-sm me-2"></span>
                            ذخیره تغییرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import DatePicker from 'vue3-persian-datetime-picker';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { onMounted, reactive, ref } from 'vue';
import { formatDate, showError, tasksRules } from '../helpers';
import api from '../axios/api';
import useVuelidate from '@vuelidate/core';

const editTask = reactive({
    id: '',
    title: '',
    description: '',
    start_date: '',
    end_date: ''
});
const v$ = useVuelidate(tasksRules, editTask, { $lazy: true });

const params = ref({
    order: 'id',
    dir: 'desc',
    search: "",
    status: "",
    page: 1,
    per_page: 10,
})

let tasks = ref([]);
let meta = ref([]);
let modal = ref(null)
const errors = ref({
    title: "",
    description: "",
    start_date: "",
    end_date: ""
})
let loading = ref(false)
let deleteLoading = ref(false)
let updateLoading = ref(false)
let isSearched = ref(false)

function doSearch() {
    if (params.value.search.length > 0) {
        params.value.page = 1;
        loadTasks()
        isSearched.value = true;
    }
}
function doFilter() {
    params.value.page = 1;
    loadTasks();
}
function columnSort(column) {
    params.value.order = column;
    params.value.dir = params.value.dir === "desc" ? 'asc' : "desc";

    loadTasks()
}

function loadPaginatedTasks(page) {
    params.value.page = page
    loadTasks()
}
async function loadTasks() {
    loading.value = true;

    try {
        const response = await api.get('tasks', { params: params.value });
        if (response.data.success) {
            tasks.value = response.data.data.tasks.map(task => ({ ...task, toggleLoading: false, editLoading: false }))
            meta.value = response.data.data.meta;
            meta.value.links = meta.value.links.slice(1, -1) // آیتم اول و آخر صفحه بندی حذف بشه
        }
    } catch (e) {
        if (e.response) {
            const { status } = e.response
            switch (status) {
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
    } finally {
        loading.value = false;
    }
}
onMounted(() => {
    loadTasks()
});

async function deleteTask(id, index) {
    if (deleteLoading.value) return;

    Swal.fire({
        title: 'آیا مطمئن هستید؟',
        text: 'این تسک برای همیشه حذف خواهد شد!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'خیر'
    }).then(async (result) => {
        if (result.isConfirmed) {
            deleteLoading.value = true;

            try {
                const response = await api.delete(`tasks/${id}`);

                if (response.data.success) {
                    tasks.value.splice(index, 1);
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'تسک با موفقیت حذف شد',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                }
            } catch (e) {
                if (e.response) {
                    const { status } = e.response
                    switch (status) {
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
            } finally {
                deleteLoading.value = false;
            }
        }
    });
}
async function openEditModal(id, index) {
    if (tasks.value[index].editLoading) return;

    errors.value = {} // خطاهای اعتبارسنجی سمت سرور پاک بشن
    tasks.value[index].editLoading = true;

    try {
        const response = await api.get(`tasks/${id}`);

        if (response.data.success) {
            editTask.id = response.data.data.id;
            editTask.title = response.data.data.title;
            editTask.description = response.data.data.description;
            editTask.start_date = response.data.data.start_date;
            editTask.end_date = response.data.data.end_date;

            modal.value = new bootstrap.Modal(document.getElementById('editModal'));
            modal.value.show();
        }
    } catch (e) {
        if (e.response) {
            const { status } = e.response
            switch (status) {
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
    } finally {
        tasks.value[index].editLoading = false;
    }
}
async function saveEditedTask() {
    v$.value.$touch();

    if (!v$.value.$invalid) {
        errors.value = {}
        updateLoading.value = true;

        try {
            const response = await api.patch(`tasks/${editTask.id}`, {
                title: editTask.title,
                description: editTask.description,
                start_date: editTask.start_date,
                end_date: editTask.end_date,
            });

            if (response.data.success) {
                modal.value.hide();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'تسک با موفقیت ویرایش شد',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                loadTasks();
            }
        } catch (e) {
            if (e.response) {
                const { status, data } = e.response
                switch (status) {
                    case 401:// خطای احراز هویت
                        showError("خطای احراز هویت")
                        break;
                    case 422: // خطاهای اعتبارسنجی
                        errors.value = data.errors;
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
            updateLoading.value = false;
        }
    }
};
async function toggleStatus(id, index) {
    if (tasks.value[index].toggleLoading) return;
    tasks.value[index].toggleLoading = true;

    try {
        const response = await api.patch(`tasks/${id}/toggle`);

        if (response.data.success) {
            tasks.value[index].completed = !tasks.value[index].completed;

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `وضعیت تسک به "${tasks.value[index].completed ? 'انجام‌شده' : 'انجام‌نشده'}" تغییر کرد`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
    } catch (e) {
        if (e.response) {
            const { status } = e.response
            switch (status) {
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
    } finally {
        tasks.value[index].toggleLoading = false;
    }
}
function clearSearchAndFilters() {
    params.value.search = "";
    params.value.status = "";
    params.value.page = 1;
    params.value.per_page = 10;
    params.value.dir = "desc"
    params.value.order = "id"
    isSearched.value = false;
    loadTasks()
}

</script>

<style scoped>
.btn-sort {
    cursor: pointer;
    color: white;
    text-decoration: none;
}

.table {
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
}

.table-dark {
    background: #343a40;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
}

.table-hover tbody tr:hover {
    background-color: #f8f9fa;
    transition: background-color 0.3s ease;
}

.modal-content {
    border-radius: 15px;
}

.form-control,
textarea,
.vue3-persian-datetime-picker input {
    border-radius: 10px 0 0 10px;
}

.input-group-text {
    border-radius: 0 10px 10px 0;
}
</style>
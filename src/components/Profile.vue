<template>
    <div class="container my-5">
        <h2 class="text-info fw-bold mb-4">پروفایل کاربر</h2>
        <div class="card shadow-lg p-4" style="max-width: 600px; margin: auto;">
            <div class="card-body">
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">در حال بارگذاری...</span>
                    </div>
                </div>
                <div v-else-if="user">
                    <div class="mb-3 d-flex align-items-center">
                        <i class="bi bi-person-fill text-info me-2" style="font-size: 1.5rem;"></i>
                        <div>
                            <label class="fw-semibold text-muted">نام:</label>
                            <p class="mb-0">{{ user.name }}</p>
                        </div>
                    </div>
                    <div class="mb-3 d-flex align-items-center">
                        <i class="bi bi-envelope-fill text-info me-2" style="font-size: 1.5rem;"></i>
                        <div>
                            <label class="fw-semibold text-muted">ایمیل:</label>
                            <p class="mb-0">{{ user.email }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="alert alert-warning text-center">
                    اطلاعاتی برای نمایش وجود ندارد.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthUserStore } from '@/stores/auth_user';

const authUser = useAuthUserStore();
const user = ref(null);
const loading = ref(true);
onMounted(async () => {
    try {
        if (authUser.getAuthUser) {
            user.value = authUser.getAuthUser;
        } else {
            user.value = null;
        }
    } catch (error) {
        user.value = null;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.card {
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #ffffff, #f8f9fa);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

p {
    font-size: 1.1rem;
    color: #333;
}
</style>
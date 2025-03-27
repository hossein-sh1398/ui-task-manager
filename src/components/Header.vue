<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <router-link class="navbar-brand" :to="{ name: 'home' }">مدیریت وظایف</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <template v-if="!isSignedIn">
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'register' }">عضویت</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'login' }">ورود</router-link>
                        </li>
                    </template>
                    <template v-else>
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'dashboard' }">داشبورد</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'profile' }">
                                {{ authUser?.name || 'کاربر' }}
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'tasks_create' }">ایجاد وظیفه</router-link>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" @click.prevent="handleLogout">خروج</a>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthUserStore } from '../stores/auth_user';
import api from '../axios/api';
import Swal from 'sweetalert2';

const authStore = useAuthUserStore();
const router = useRouter();

const isSignedIn = computed(() => authStore.checkUserIsSigned);
const authUser = computed(() => authStore.getAuthUser);

const handleLogout = async () => {
    try {
        const response = await api.post('logout');
        if (response.data.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'خروج با موفقیت انجام شد',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            authStore.setAuthUser(null);
            authStore.setApiToken(null);
            router.push({ name: 'home' });
        }
    } catch (error) {
        console.error('خطا در خروج:', error);
        Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: 'مشکلی در خروج رخ داد. لطفاً دوباره تلاش کنید.',
        });
    }
};
</script>

<style scoped>
/* استایل کلی نوار ناوبری */
.navbar {
    background: linear-gradient(135deg, #00c4cc, #007bff);
    /* گرادیانت آبی و فیروزه‌ای */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    /* سایه نرم */
    padding: 1rem 0;
    /* فضای داخلی بیشتر */
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

/* برند (لوگو) */
.navbar-brand {
    color: #fff;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 0.3s ease, color 0.3s ease;
}

.navbar-brand:hover {
    color: #ffeb3b;
    /* زرد روشن */
    transform: scale(1.05);
}

/* دکمه همبرگر */
.navbar-toggler {
    border: none;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    transition: background 0.3s ease;
}

.navbar-toggler:hover {
    background: rgba(255, 255, 255, 0.3);
}

.navbar-toggler-icon {
    filter: brightness(0) invert(1);
    /* سفید کردن آیکون */
}

/* آیتم‌های منو */
.nav-item {
    margin: 0 0.5rem;
}

.nav-link {
    color: #fff;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

/* افکت خط زیر لینک */
.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #ffeb3b;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

/* پاسخ‌گویی در موبایل */
@media (max-width: 991px) {
    .navbar-nav {
        background: rgba(0, 124, 137, 0.95);
        /* پس‌زمینه تیره‌تر در موبایل */
        border-radius: 10px;
        padding: 1rem;
        margin-top: 0.5rem;
    }

    .nav-item {
        margin: 0.5rem 0;
    }

    .nav-link {
        padding: 0.75rem;
        font-size: 1.1rem;
    }
}
</style>
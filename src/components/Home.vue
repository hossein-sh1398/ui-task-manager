<template>
    <div class="home-container">
        <div class="hero-section">
            <h1 class="hero-title">به برنامه مدیریت وظایف خوش آمدید</h1>
            <p class="hero-subtitle">
                وظایفت رو منظم کن، زمانت رو مدیریت کن، و به اهدافت برس!
            </p>
            <router-link :to="{ name: isSignedIn ? 'dashboard' : 'login' }" class="btn btn-primary btn-lg cta-button">
                <i class="bi bi-rocket-takeoff-fill me-2"></i>
                {{ isSignedIn ? 'مشاهده وظایف' : 'ورود و شروع' }}
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthUserStore } from '@/stores/auth_user';

const authStore = useAuthUserStore();
const isSignedIn = computed(() => authStore.checkUserIsSigned);
</script>

<style scoped>
/* کانتینر اصلی */
.home-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f0f4f8, #d9e6f2);
    /* گرادیانت ملایم */
    padding: 2rem;
}

/* بخش هیرو */
.hero-section {
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    padding: 3rem 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    animation: fadeIn 1s ease-in-out;
}

/* عنوان */
.hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #007bff;
    /* آبی تیره */
    margin-bottom: 1rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

/* زیرعنوان */
.hero-subtitle {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 2rem;
    line-height: 1.6;
}

/* دکمه فراخوان */
.cta-button {
    background: linear-gradient(90deg, #00c4cc, #007bff);
    /* گرادیانت دکمه */
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    border-radius: 50px;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
    background: linear-gradient(90deg, #00d4dd, #0088ff);
}

/* انیمیشن ورود */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* پاسخ‌گویی */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .cta-button {
        padding: 0.5rem 1.5rem;
        font-size: 1rem;
    }
}
</style>
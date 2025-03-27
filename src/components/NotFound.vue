<!-- src/views/NotFound.vue -->
<template>
    <div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <h1 class="display-1 fw-bold text-danger">404</h1>
        <h2 class="text-info mb-4">صفحه پیدا نشد!</h2>
        <p class="lead text-muted mb-5">
            به نظر می‌رسه راه رو گم کردی. نگران نباش، می‌تونی به صفحه اصلی برگردی.
        </p>
        <router-link :to="{ name: 'home' }" class="btn btn-primary btn-lg">
            <i class="bi bi-house-door-fill me-2"></i> بازگشت به خانه
        </router-link>
    </div>
</template>

<script setup>

</script>

<style scoped>
.display-1 {
    font-size: 6rem;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-20px);
    }

    60% {
        transform: translateY(-10px);
    }
}
</style>
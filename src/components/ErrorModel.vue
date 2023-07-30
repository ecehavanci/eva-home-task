<template>
    <div v-if="errorMessage" class="error-modal">
        <div class="modal-content">
            <span class="close-button" @click="closeModal">&times;</span>
            <img src="@/assets/error.png" width="100" height="100" alt="Error" class="error-image" />
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        errorMessage: {
            type: String,
            required: true,
        },
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>
  
<style>
.error-modal {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
}

.modal-content {
    background-color: #fff;
    border: 1px solid #3895ff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 20px;
    max-width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.close-button {
    cursor: pointer;
    color: #3895ff;
    float: right;
    font-size: 18px;
    font-weight: bold;
}

.close-button:hover {
    color: #333;
}
</style>
  
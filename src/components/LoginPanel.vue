<template>
    <div class="login-container">
        <h2>Login</h2>
        <img src="@/assets/eva.png" alt="logo" class="logo">
        <form @submit.prevent="login" class="login-form">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="text" id="email" v-model="email" required />
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <div>
                <button>Login</button>
            </div>
        </form>
        <error-modal v-if="errorMessage" :error-message="errorMessage" @close="errorMessage = ''" />
    </div>
</template>
  
<script>
import axios from 'axios'
import ErrorModal from './ErrorModel.vue';
import UserModel from './models/UserModel.js';

export default {
    components: {
        ErrorModal
    },
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            userObject: null,
            // isLoading: false
        };
    },
    methods: {
        login() {
            if (this.email && this.password) {
                this.errorMessage = '';
                const credentials = {
                    "Email": this.email,
                    "Password": this.password,
                    "GrantType": "password",
                    "Scope": "amazon_data",
                    "ClientId": "C0001",
                    "ClientSecret": "SECRET0001",
                    "RedirectUri": "https://api.eva.guru"
                };

                axios.post('https://iapitest.eva.guru/oauth/token', credentials)
                    .then(response => {
                        if (response.data.ApiStatusCode == 200) {
                            const data = response.data.Data;
                            const accessToken = data.AccessToken;
                            console.log('Access Token:', accessToken);

                            const requestBody = {
                                "email": credentials.Email ?? "",
                            };

                            const config = {
                                headers: { Authorization: `Bearer ${accessToken}` }
                            };

                            axios.post('https://iapitest.eva.guru/user/user-information', requestBody, config)
                                .then(response2 => {
                                    if (response2.data.ApiStatusCode == 200) {

                                        this.$store.commit('setBareerToken', accessToken);
                                        console.log("store  :", this.$store.getters.getBareerToken)

                                        this.userObject = new UserModel(response2.data.Data.user)
                                        this.$store.commit('setUserInfo', this.userObject);
                                        console.log("user Info  :", this.$store.getters.getUserInfo)

                                        this.$router.push('/dashboard').catch(err => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });

                                    }
                                    else {
                                        this.errorMessage = 'Login failed 22 ' + response2.data.ApiStatusMessage;
                                    }

                                });

                        } else {
                            console.log('Login failed');
                            console.log('API Status Message:', response.data.ApiStatusMessage);
                            this.errorMessage = 'Login failed 1 ' + response.data.ApiStatusMessage;
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.errorMessage = 'Invalid email or password.';
                    });


            } else {
                this.errorMessage = 'Please provide email and password.';
            }

            this.email = ''
            this.password = ''
        },
    },
};
</script>

<style>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    justify-content: center;
}

.logo {
    width: 300px;
    height: auto;
}

h2 {
    text-align: center;
}

.login-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
}

input {
    width: 90%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #538ad8af;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #538ad8af;
}

.error-message {
    margin-top: 10px;
    color: red;
    font-size: 14px;
}
</style>
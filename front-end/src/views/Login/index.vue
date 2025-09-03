<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <img src="@/assets/images/logo.svg" alt="logo" />
        </div>
        <div class="login-title">nest-vue-admin</div>
        <div class="login-subtitle">企业级后台管理系统</div>
      </div>

      <el-form ref="loginFormRef" :model="login.form" :rules="login.rules" class="login-form" @keyup.enter="submit">
        <el-form-item prop="username">
          <el-input v-model="login.form.username" placeholder="请输入用户名" size="large" clearable :disabled="login.loading">
            <template #prefix>
              <FtIcon name="user"></FtIcon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="login.form.password" placeholder="请输入密码" type="password" size="large" show-password clearable :disabled="login.loading">
            <template #prefix>
              <FtIcon name="setting"></FtIcon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="login-actions">
          <el-button type="primary" size="large" class="login-btn" :loading="login.loading" @click="submit">
            {{ login.loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store'

// 表单引用
const loginFormRef = useTemplateRef('loginForm')

// 登录表单数据
const login = reactive({
  form: {
    username: '',
    password: ''
  },
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }
    ]
  }
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const submit = async () => {
  loginFormRef.value.validate().then(() => {
    login.loading = true
    userStore
      .login(login.form)
      .then(() => {
        ElMessage.success('登录成功')
        const redirectPath = route.query.redirect
        router.replace(redirectPath || '/')
      })
      .actch((error) => {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请检查用户名和密码')
      })
      .finally(() => {
        login.loading = false
      })
  })
}

onMounted(() => {})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 0;
}

.login-form {
  margin-bottom: 20px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-form .el-form-item:last-child {
  margin-bottom: 0;
}

.login-actions {
  margin-top: 32px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
}

.dev-tips {
  margin-top: 20px;
}

.dev-tips .el-alert {
  border-radius: 6px;
}

.dev-tips p {
  margin: 4px 0;
  font-size: 13px;
}

/* 自定义图标样式 */
.el-icon svg {
  width: 16px;
  height: 16px;
  fill: #a0a4aa;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-box {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 24px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .login-box {
    background: rgba(45, 55, 72, 0.95);
    color: #e2e8f0;
  }

  .login-title {
    color: #f7fafc;
  }

  .login-subtitle {
    color: #a0aec0;
  }
}
</style>

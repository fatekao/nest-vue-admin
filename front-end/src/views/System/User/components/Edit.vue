<script setup>
import enums from '@/utils/enums'
import rules from '@/utils/rules'
import { addUser, editUser, getUser } from '@/api/user'

const dialog = reactive({
  title: '新增用户',
  visible: false,
  type: 'add'
})

// 临时密码显示
const tempPassword = reactive({
  visible: false,
  password: '',
  username: ''
})

const baseInfo = reactive({
  form: {
    username: '',
    nickName: '',
    gender: '',
    email: '',
    phone: '',
    status: '',
    roleIds: ''
  },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, rules.length(3, 20)],
    nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }, rules.length(1, 50)],
    phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, rules.phone],
    email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }, rules.email]
  },
  api: null,
  loading: false
})

const openDialog = (type, data) => {
  dialog.type = type
  if (type === 'edit') {
    dialog.title = '编辑用户'
    getUser({ id: data.id }).then((res) => {
      baseInfo.form = { ...res.data }
    })
    baseInfo.api = editUser
  } else {
    dialog.title = '新增用户'
    baseInfo.form = {
      username: '',
      nickName: '',
      gender: '',
      email: '',
      phone: '',
      avatar: '',
      status: 1
    }
    baseInfo.api = addUser
  }
  dialog.visible = true
}

const baseInfoRef = useTemplateRef('baseInfoRef')

const emits = defineEmits(['search'])
const submit = () => {
  baseInfoRef.value.validate().then(() => {
    baseInfo.loading = true
    baseInfo
      .api(baseInfo.form)
      .then((res) => {
        ElMessage.success(`${dialog.title}成功!`)

        dialog.visible = false
        dialog.api = null
        emits('search')

        // 系统始终会返回临时密码，显示临时密码对话框
        if (res.data && res.data.tempPassword) {
          tempPassword.password = res.data.tempPassword
          tempPassword.username = res.data.username
          tempPassword.visible = true
        }
      })
      .finally(() => {
        baseInfo.loading = false
      })
  })
}

// 复制密码到剪贴板
const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(tempPassword.password)
    ElMessage.success('密码已复制到剪贴板')
  } catch {
    // 如果剪贴板 API 不可用，使用旧的方法
    const textArea = document.createElement('textarea')
    textArea.value = tempPassword.password
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('密码已复制到剪贴板')
  }
}

defineExpose({
  openDialog
})
</script>

<template>
  <ElDrawer :title="dialog.title" v-model="dialog.visible">
    <el-form ref="baseInfoRef" :model="baseInfo.form" :rules="baseInfo.rules" label-width="70px" :validate-on-rule-change="false">
      <el-form-item v-if="dialog.type === 'add'" label="用户名" prop="username">
        <el-input v-model="baseInfo.form.username" placeholder="请输入用户名" clearable />
      </el-form-item>

      <el-form-item v-if="dialog.type === 'add'" label="密码说明">
        <el-alert title="系统将自动为用户生成安全的临时密码" type="info" :closable="false" :show-icon="false" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="baseInfo.form.nickName" placeholder="请输入昵称" clearable />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="baseInfo.form.gender" placeholder="请选择性别" clearable>
          <el-option v-for="item in enums.user.gender" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="baseInfo.form.email" placeholder="请输入邮箱" clearable />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="baseInfo.form.phone" placeholder="请输入手机号" clearable />
      </el-form-item>

      <el-form-item label="头像" prop="avatar">
        <el-input v-model="baseInfo.form.avatar" placeholder="请输入头像地址" clearable />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="baseInfo.form.status" placeholder="请选择状态">
          <el-option v-for="item in enums.user.status" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="baseInfo.loading"> 确定 </el-button>
    </template>
  </ElDrawer>

  <!-- 临时密码显示对话框 -->
  <el-dialog title="用户创建成功" v-model="tempPassword.visible" width="400px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <div class="temp-password-content">
      <el-alert title="系统已为您自动生成临时密码" type="success" :closable="false" show-icon />

      <div class="password-info">
        <el-form label-width="80px">
          <el-form-item label="用户名：">
            <span class="info-text">{{ tempPassword.username }}</span>
          </el-form-item>
          <el-form-item label="临时密码：">
            <div class="password-display">
              <span class="password-text">{{ tempPassword.password }}</span>
              <el-button type="primary" size="small" @click="copyPassword" style="margin-left: 10px"> 复制密码 </el-button>
            </div>
          </el-form-item>
        </el-form>

        <el-alert title="请妥善保管此密码，并提醒用户在首次登录后修改密码" type="warning" :closable="false" />
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="tempPassword.visible = false"> 我已记住密码 </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.temp-password-content {
  padding: 10px 0;
}

.password-info {
  margin: 20px 0;
}

.info-text {
  font-weight: bold;
  color: #409eff;
}

.password-display {
  display: flex;
  align-items: center;
}

.password-text {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: #e6a23c;
  background-color: #fdf6ec;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #f5dab1;
}
</style>
